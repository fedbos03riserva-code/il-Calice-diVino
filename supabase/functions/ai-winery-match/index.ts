import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_QUERY_LEN = 1000;
const MAX_WINERIES_ITEMS = 50;
const MAX_BODY_BYTES = 100_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

function sanitizeString(str: string, maxLen: number): string {
  return str.slice(0, maxLen).replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

const MATCH_SYSTEM_PROMPT = `Sei il matching engine AI di B&F 45 — specializzato nell'abbinare buyer internazionali con le cantine dell'Oltrepò Pavese più adatte.

Analizzi la richiesta del buyer e valuti ogni cantina assegnando un punteggio (0-100) basato su:
- Corrispondenza tipologia vino vs tipologie prodotte
- Denominazioni richieste vs denominazioni della cantina
- Volume richiesto vs capacità produttiva
- Budget vs prezzo FOB
- Mercato target vs paesi già serviti
- Certificazioni richieste vs certificazioni possedute
- Incoterms richiesti vs incoterms accettati
- Lingue del team vs mercato target

Per ogni cantina: score (0-100), reasons (array), recommendation (1 frase).
INCLUDI solo cantine con score >= 30. Massimo 5, ordinate per score.`;

const MATCH_SCHEMA = {
  name: "restituisci_match",
  description: "Restituisce i risultati del matching buyer-cantine.",
  input_schema: {
    type: "object",
    properties: {
      analisi_richiesta: {
        type: "object",
        properties: {
          tipo_vino: { type: "string" },
          volume_stimato: { type: "string" },
          mercato_target: { type: "string" },
          budget_stimato: { type: "string" },
          certificazioni: { type: "array", items: { type: "string" } },
          incoterms: { type: "array", items: { type: "string" } },
          note: { type: "string" },
        },
        required: ["tipo_vino", "volume_stimato", "mercato_target", "budget_stimato", "certificazioni", "incoterms"],
      },
      matches: {
        type: "array",
        items: {
          type: "object",
          properties: {
            winery_id: { type: "string" },
            score: { type: "integer", minimum: 0, maximum: 100 },
            reasons: { type: "array", items: { type: "string" } },
            recommendation: { type: "string" },
          },
          required: ["winery_id", "score", "reasons", "recommendation"],
        },
      },
      sintesi: { type: "string" },
    },
    required: ["analisi_richiesta", "matches", "sintesi"],
  },
};

const EXPORT_SYSTEM_PROMPT = `Sei l'analista export AI di B&F 45 per le cantine dell'Oltrepò Pavese. Analizzi il profilo di una cantina e produci un piano strategico export.

Per ogni cantina analizzi:
1. MERCATI TARGET: 3 mercati prioritari non ancora serviti, con motivazione (trend, barriere, concorrenza)
2. PREZZO FOB: valutazione competitività e ottimizzazioni suggerite
3. CERTIFICAZIONI: quali mancano e quale impatto avrebbero
4. POSIZIONAMENTO: strategia per fiere export e canali
5. RISCHI: barriere doganali, normative, concorrenza locale
6. ACTION ITEMS: 5 azioni concrete con priorita (alta/media/bassa)

Sii specifico, cita dati di mercato reali quando possibile.`;

const EXPORT_SCHEMA = {
  name: "restituisci_analisi_export",
  description: "Restituisce l'analisi export strategica per una cantina.",
  input_schema: {
    type: "object",
    properties: {
      mercati_target: {
        type: "array",
        items: {
          type: "object",
          properties: {
            paese: { type: "string" },
            priorita: { type: "string", enum: ["alta", "media", "bassa"] },
            motivazione: { type: "string" },
            trend: { type: "string" },
            barriere: { type: "string" },
          },
          required: ["paese", "priorita", "motivazione", "trend", "barriere"],
        },
      },
      prezzo_fob: {
        type: "object",
        properties: {
          valutazione: { type: "string" },
          ottimizzazione: { type: "string" },
        },
        required: ["valutazione", "ottimizzazione"],
      },
      certificazioni_mancanti: {
        type: "array",
        items: {
          type: "object",
          properties: {
            certificazione: { type: "string" },
            impatto: { type: "string" },
          },
          required: ["certificazione", "impatto"],
        },
      },
      posizionamento: { type: "string" },
      rischi: { type: "array", items: { type: "string" } },
      action_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            azione: { type: "string" },
            priorita: { type: "string", enum: ["alta", "media", "bassa"] },
          },
          required: ["azione", "priorita"],
        },
      },
      sintesi: { type: "string" },
    },
    required: ["mercati_target", "prezzo_fob", "certificazioni_mancanti", "posizionamento", "rischi", "action_items", "sintesi"],
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  if (!checkRateLimit(clientIP)) {
    return new Response(JSON.stringify({ error: "RATE_LIMITED", message: "Troppe richieste. Riprova tra un minuto." }), {
      status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "PAYLOAD_TOO_LARGE", message: "Richiesta troppo grande." }), {
      status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: "PAYLOAD_TOO_LARGE", message: "Richiesta troppo grande." }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "INVALID_JSON", message: "JSON non valido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { query, wineries, lang, mode } = body;
    const isExportMode = mode === "export-analysis";

    if (typeof query !== "string" || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: "MISSING_QUERY", message: "Specifica una richiesta." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(wineries) || wineries.length === 0) {
      return new Response(JSON.stringify({ error: "MISSING_WINERIES", message: "Elenco cantine mancante." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (wineries.length > MAX_WINERIES_ITEMS) {
      return new Response(JSON.stringify({ error: "WINERIES_TOO_LARGE", message: "Elenco cantine troppo grande." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const querySanitized = sanitizeString(query, MAX_QUERY_LEN);
    const langSanitized = typeof lang === "string" ? lang.slice(0, 4) : "it";

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wineriesJson = JSON.stringify(wineries.slice(0, MAX_WINERIES_ITEMS).map((w: any) => ({
      id: String(w.id || "").slice(0, 20), nome: String(w.nome || "").slice(0, 100),
      comune: String(w.comune || "").slice(0, 50), provincia: String(w.provincia || "").slice(0, 10),
      ettari: Number(w.ettari) || 0, capacitaProduttiva: Number(w.capacitaProduttiva) || 0,
      tipologie: Array.isArray(w.tipologie) ? w.tipologie.map((t: any) => String(t).slice(0, 30)) : [],
      denominazioni: Array.isArray(w.denominazioni) ? w.denominazioni.map((d: any) => String(d).slice(0, 50)) : [],
      exportReady: Boolean(w.exportReady), paesiServiti: Array.isArray(w.paesiServiti) ? w.paesiServiti.map((p: any) => String(p).slice(0, 30)) : [],
      certificazioni: Array.isArray(w.certificazioni) ? w.certificazioni.map((c: any) => String(c).slice(0, 30)) : [],
      moq: Number(w.moq) || 0, prezzoFOB: Number(w.prezzoFOB) || 0,
      incoterms: Array.isArray(w.incoterms) ? w.incoterms.map((i: any) => String(i).slice(0, 10)) : [],
      lingueTeam: Array.isArray(w.lingueTeam) ? w.lingueTeam.map((l: any) => String(l).slice(0, 5)) : [],
      esporta: Boolean(w.esporta),
    })));

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese", nl: "Nederlands" };
    const langName = langNames[langSanitized] || "italiano";

    const systemPrompt = isExportMode ? EXPORT_SYSTEM_PROMPT : MATCH_SYSTEM_PROMPT;
    const schema = isExportMode ? EXPORT_SCHEMA : MATCH_SCHEMA;

    const userMessage = `LINGUA: scrivi TUTTI i valori testuali in ${langName}.

${isExportMode ? "PROFILO CANTINA DA ANALIZZARE:" : "RICHIESTA BUYER:"}
"${querySanitized}"

${isExportMode ? "DATI CANTINA:" : "CANTINE DISPONIBILI:"}
${wineriesJson}

${isExportMode ? "Produci l'analisi export strategica." : "Analizza la richiesta e valuta ogni cantina."}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: isExportMode ? 4000 : 3000,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        tools: [schema],
        tool_choice: { type: "tool", name: isExportMode ? "restituisci_analisi_export" : "restituisci_match" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("AI API error:", response.status, errText.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI_ERROR", message: "Errore del motore AI." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolBlock = data.content?.find((b: any) => b.type === "tool_use");
    const risultato = toolBlock ? toolBlock.input : null;

    if (!risultato) {
      return new Response(JSON.stringify({ error: "AI_NO_OUTPUT", message: "Il motore AI non ha restituito risultati." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(risultato), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message: "Errore interno." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

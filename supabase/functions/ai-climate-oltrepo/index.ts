const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

const SYSTEM_PROMPT = `Sei l'AI climatica di B&F 45, specializzata nell'analisi dell'impatto del cambiamento climatico sulla viticoltura dell'Oltrepò Pavese.

L'Oltrepò Pavese (45° parallelo, 300-700m slm) ha un clima temperato con escursioni termiche marcate, piogge 700-900mm/anno, gelate primaverili rischiose (aprile-maggio).

Analizzi scenari climatici per vitigni specifici (Pinot Nero, Croatina/Bonarda, Barbera, Riesling, Moscato, Ughetta di Canneto) e produci:
1. RISCHI CLIMATICI: per ogni vitigno, valori temperatura, gelate, siccita, grandinate
2. ADATTAMENTI: pratiche agronomiche consigliate (potatura, gestione chioma, irrigazione di soccorso)
3. PROIEZIONI: scenari a 5/10/20 anni con dati quantitativi
4. RACCOMANDAZIONI: vitigni piu resilienti, nuove varietà da considerare
5. MONITORAGGIO: sensori e dati da raccogliere per ottimizzare`;

const TOOL_SCHEMA = {
  name: "restituisci_analisi_climatica",
  description: "Restituisce l'analisi climatica per la viticoltura dell'Oltrepò Pavese.",
  input_schema: {
    type: "object",
    properties: {
      rischi_climatici: {
        type: "array",
        items: {
          type: "object",
          properties: {
            vitigno: { type: "string" },
            rischio: { type: "string" },
            livello: { type: "string", enum: ["basso", "medio", "alto", "critico"] },
            periodo: { type: "string" },
            dettaglio: { type: "string" },
          },
          required: ["vitigno", "rischio", "livello", "periodo", "dettaglio"],
        },
      },
      adattamenti: {
        type: "array",
        items: {
          type: "object",
          properties: {
            pratica: { type: "string" },
            descrizione: { type: "string" },
            priorita: { type: "string", enum: ["alta", "media", "bassa"] },
          },
          required: ["pratica", "descrizione", "priorita"],
        },
      },
      proiezioni: {
        type: "array",
        items: {
          type: "object",
          properties: {
            orizzonte: { type: "string" },
            scenario: { type: "string" },
            temperatura_media: { type: "string" },
            precipitazioni: { type: "string" },
            impatto_vitigni: { type: "string" },
          },
          required: ["orizzonte", "scenario", "temperatura_media", "precipitazioni", "impatto_vitigni"],
        },
      },
      vitigni_resilienti: {
        type: "array",
        items: {
          type: "object",
          properties: {
            vitigno: { type: "string" },
            motivazione: { type: "string" },
            score_resilienza: { type: "integer", minimum: 0, maximum: 100 },
          },
          required: ["vitigno", "motivazione", "score_resilienza"],
        },
      },
      monitoraggio: {
        type: "array",
        items: { type: "string" },
      },
      sintesi: { type: "string" },
    },
    required: ["rischi_climatici", "adattamenti", "proiezioni", "vitigni_resilienti", "monitoraggio", "sintesi"],
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

  try {
    const body = await req.json();
    const { vitigno, lang, scenario } = body;

    const langSanitized = typeof lang === "string" ? lang.slice(0, 4) : "it";
    const vitignoSanitized = typeof vitigno === "string" ? vitigno.slice(0, 200).replace(/[<>"'{}\\]/g, "").trim() : "tutti";
    const scenarioSanitized = typeof scenario === "string" ? scenario.slice(0, 500).replace(/[<>"'{}\\]/g, "").trim() : "";

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese", nl: "Nederlands" };
    const langName = langNames[langSanitized] || "italiano";

    const userMessage = `LINGUA: scrivi TUTTI i valori testuali in ${langName}.

VITIGNO/FOCUS: "${vitignoSanitized}"
${scenarioSanitized ? `SCENARIO SPECIFICO: "${scenarioSanitized}"` : ""}

Analizza l'impatto climatico sulla viticoltura dell'Oltrepò Pavese per il vitigno/focus indicato. Considera il clima attuale (45° parallelo, 300-700m slm) e le proiezioni di cambiamento climatico.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 4000,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "restituisci_analisi_climatica" },
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

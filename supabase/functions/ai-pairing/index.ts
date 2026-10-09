import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_PIATTO_LEN = 500;
const MAX_CATALOG_ITEMS = 500;
const MAX_CODE_LEN = 64;
const MAX_BODY_BYTES = 200_000;
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

const SYSTEM_PROMPT = `Sei il motore di abbinamento cibo-vino di B&F 45. Analizza il piatto a livello chimico (grassi, proteine, acidi, aromatici, piccantezza, umami, dolcezza) e abbinalo ai vini del catalogo.

Principi chimici chiave: tannini-proteine, acidita-grassi, zuccheri-dolcezza, CO2-pulizia palato, Maillard-legno, terpeni-spezie, capsacina-alcol.

SCORING IRC (0-100): chimica (0-40), aromatico (0-25), struttura (0-20), pulizia (0-15).

INCLUDI vini con score >= 55. Se nessuno supera 55, includi i TOP 3.

Per ogni abbinamento scrivi: meccanismo_chimico (2 frasi con nomi composti), perche_funzia (1 frase), perche_del_vino (3 righe: chimica + bocca + struttura), molecole_protagoniste (4-6 nomi), irc con 4 sotto-punteggi.

OUTPUT: JSON PURO via tool.`;

const SYSTEM_PROMPT_PRO = `Modalita PRO: aggiungi discorso_sommelier (3 righe tecniche), discorso_appassionato (3 rige emozionali), reazione_digestiva (2 frasi), temperatura_servizio, tempo_decantazione.`;

const TOOL_SCHEMA = {
  name: "restituisci_abbinamenti",
  description: "Restituisce l'analisi e gli abbinamenti vino.",
  input_schema: {
    type: "object",
    properties: {
      analisi_piatto: {
        type: "object",
        properties: {
          ingredienti_identificati: { type: "array", items: { type: "string" } },
          grassi: { type: "string" },
          proteine: { type: "string" },
          acidi: { type: "string" },
          volatili_aromatici: { type: "array", items: { type: "string" } },
          piccantezza: { type: "string" },
          umami: { type: "string" },
          tendenza_dolce: { type: "string" },
          complessita: { type: "string" },
          sfida_abbinamento: { type: "string" },
        },
        required: ["ingredienti_identificati", "grassi", "proteine", "acidi", "volatili_aromatici", "piccantezza", "umami", "tendenza_dolce", "complessita", "sfida_abbinamento"],
      },
      abbinamenti: {
        type: "array",
        items: {
          type: "object",
          properties: {
            wine_id: { type: "string" },
            score: { type: "integer", minimum: 0, maximum: 100 },
            principio: { type: "string" },
            interazione_primaria: { type: "string" },
            meccanismo_chimico: { type: "string" },
            sensazione_in_bocca: { type: "string" },
            molecole_protagoniste: { type: "array", items: { type: "string" } },
            perche_funziona: { type: "string" },
            perche_del_vino: { type: "string" },
            discorso_sommelier: { type: "string" },
            discorso_appassionato: { type: "string" },
            consigli_culinari: { type: "string" },
            chimica_in_bocca: { type: "string" },
            reazione_digestiva: { type: "string" },
            temperatura_servizio: { type: "string" },
            tempo_decantazione: { type: "string" },
            irc: {
              type: "object",
              properties: {
                chimica: { type: "integer", minimum: 0, maximum: 40 },
                aromatico: { type: "integer", minimum: 0, maximum: 25 },
                struttura: { type: "integer", minimum: 0, maximum: 20 },
                pulizia: { type: "integer", minimum: 0, maximum: 15 },
              },
              required: ["chimica", "aromatico", "struttura", "pulizia"],
            },
          },
          required: ["wine_id", "score", "principio", "interazione_primaria", "meccanismo_chimico", "sensazione_in_bocca", "molecole_protagoniste", "perche_funziona", "perche_del_vino", "discorso_sommelier", "discorso_appassionato", "consigli_culinari", "chimica_in_bocca", "reazione_digestiva", "temperatura_servizio", "tempo_decantazione", "irc"],
        },
      },
      consiglio_divino: { type: "string" },
    },
    required: ["analisi_piatto", "abbinamenti", "consiglio_divino"],
  },
};

const MAX_WINES = 40;

function normalizza(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

const REGOLE_TIPO: [string[], string[]][] = [
  [["carne rossa", "manzo", "bistecca", "brasato", "tagliata", "agnello", "cinghiale", "selvaggina", "costata"], ["Rosso"]],
  [["pesce", "branzino", "orata", "salmone", "tonno", "frutti di mare", "cozze", "vongole", "gamberi", "crostacei"], ["Bianco", "Spumante"]],
  [["formaggio", "formaggi", "stagionato", "pecorino", "parmigiano", "gorgonzola"], ["Rosso", "Dolce"]],
  [["pizza"], ["Rosso", "Rosato"]],
  [["dolce", "torta", "cioccolato", "dessert", "crostata", "tiramisu"], ["Dolce", "Spumante"]],
  [["frittura", "fritto", "frittata"], ["Spumante", "Bianco"]],
  [["antipasto", "aperitivo", "salumi"], ["Spumante", "Bianco", "Rosato"]],
];

function tipiSuggeriti(piatto: string): string[] {
  const p = normalizza(piatto);
  const tipi: string[] = [];
  for (const [keywords, ts] of REGOLE_TIPO) {
    if (keywords.some((k) => p.includes(k))) tipi.push(...ts);
  }
  return [...new Set(tipi)];
}

function campionaCatalogo(catalogo: any[], piatto: string, maxN = MAX_WINES): any[] {
  if (catalogo.length <= maxN) return catalogo;
  const tipiPrioritari = tipiSuggeriti(piatto);
  const prioritari = tipiPrioritari.length > 0 ? catalogo.filter((w) => tipiPrioritari.includes(w.tipo)) : [];
  const resto = catalogo.filter((w) => !prioritari.includes(w));
  const slotPrioritari = tipiPrioritari.length > 0 ? Math.min(prioritari.length, Math.floor(maxN * 0.6)) : 0;
  const campione = prioritari.slice(0, slotPrioritari);
  const perTipo: Record<string, any[]> = {};
  for (const w of resto) {
    if (!perTipo[w.tipo]) perTipo[w.tipo] = [];
    perTipo[w.tipo].push(w);
  }
  const tipi = Object.keys(perTipo);
  const slotRimanenti = maxN - campione.length;
  const quota = tipi.length > 0 ? Math.max(1, Math.floor(slotRimanenti / tipi.length)) : 0;
  for (const t of tipi) campione.push(...perTipo[t].slice(0, quota));
  const restanti = [...prioritari.slice(slotPrioritari), ...resto.filter((w) => !campione.includes(w))];
  let i = 0;
  while (campione.length < maxN && i < restanti.length) {
    if (!campione.includes(restanti[i])) campione.push(restanti[i]);
    i++;
  }
  return campione.slice(0, maxN);
}

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

    const { piatto, catalogo, lang, code, pro } = body;
    const isPro = pro === true;

    if (typeof piatto !== "string" || piatto.trim().length === 0) {
      return new Response(JSON.stringify({ error: "MISSING_PIATTO", message: "Specifica un piatto." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(catalogo) || catalogo.length === 0) {
      return new Response(JSON.stringify({ error: "MISSING_CATALOG", message: "Catalogo vini mancante." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (catalogo.length > MAX_CATALOG_ITEMS) {
      return new Response(JSON.stringify({ error: "CATALOG_TOO_LARGE", message: "Catalogo troppo grande." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof code !== "string" || code.trim().length === 0) {
      return new Response(JSON.stringify({ error: "ACCESS_CODE_REQUIRED", message: "Inserisci un codice di accesso per usare il motore AI." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const piattoSanitized = sanitizeString(piatto, MAX_PIATTO_LEN);
    const codeSanitized = sanitizeString(code, MAX_CODE_LEN);
    const langSanitized = typeof lang === "string" ? lang.slice(0, 4) : "it";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: codeRow, error: codeError } = await supabase
      .from("ai_access_codes")
      .select("id, code, max_uses, uses_count, expires_at, active, daily_limit, daily_uses_count, daily_reset_at")
      .eq("code", codeSanitized)
      .eq("active", true)
      .maybeSingle();

    if (codeError || !codeRow) {
      return new Response(JSON.stringify({ error: "INVALID_CODE", message: "Codice di accesso non valido." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "CODE_EXPIRED", message: "Codice scaduto." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (codeRow.uses_count >= codeRow.max_uses) {
      return new Response(JSON.stringify({ error: "CODE_EXHAUSTED", message: "Limite utilizzi totali raggiunto." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const dailyLimit = codeRow.daily_limit || 20;
    let dailyUses = codeRow.daily_uses_count || 0;
    const dailyResetAt = codeRow.daily_reset_at ? new Date(codeRow.daily_reset_at) : null;

    if (!dailyResetAt || (now.getTime() - dailyResetAt.getTime()) > 24 * 60 * 60 * 1000) {
      dailyUses = 0;
    }

    if (dailyUses >= dailyLimit) {
      return new Response(JSON.stringify({
        error: "DAILY_LIMIT_REACHED",
        message: `Limite giornaliero raggiunto (${dailyLimit} usi). Riprova tra 24 ore.`,
      }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const updateData: any = { uses_count: codeRow.uses_count + 1, daily_uses_count: dailyUses + 1 };
    if (!dailyResetAt || (now.getTime() - dailyResetAt.getTime()) > 24 * 60 * 60 * 1000) {
      updateData.daily_reset_at = now.toISOString();
    }

    await supabase
      .from("ai_access_codes")
      .update(updateData)
      .eq("id", codeRow.id);

    const campione = campionaCatalogo(catalogo, piattoSanitized, isPro ? 25 : MAX_WINES);
    const catalogoJson = JSON.stringify(campione.map((v: any) => ({
      id: String(v.id).slice(0, 50), nome: String(v.nome).slice(0, 100), tipo: String(v.tipo).slice(0, 20),
      regione: String(v.regione).slice(0, 50), fascia: String(v.fascia).slice(0, 20), prezzo: Number(v.prezzo) || 0,
      uva: String(v.uva || v.vitigno || "").slice(0, 100), alcol: Number(v.alcol || v.gradazioneAlcolica) || 0,
      acidita: String(v.acidita || v.acidità || "").slice(0, 20), tannini: String(v.tannini || "").slice(0, 20),
      corpo: String(v.corpo || "medio").slice(0, 20), residuo_zuccherino: Number(v.residuo_zuccherino || v.residuoZuccherino) || 0,
      profilo_aromatico: Array.isArray(v.profilo_aromatico) ? v.profilo_aromatico.slice(0, 4).map((s: any) => String(s).slice(0, 50)) : (Array.isArray(v.profiloAromatico) ? v.profiloAromatico.slice(0, 4).map((s: any) => String(s).slice(0, 50)) : []),
      abbina_bene_con: Array.isArray(v.abbina_bene_con) ? v.abbina_bene_con.slice(0, 3).map((s: any) => String(s).slice(0, 50)) : (Array.isArray(v.abbinamentiConsigliati) ? v.abbinamentiConsigliati.slice(0, 3).map((s: any) => String(s).slice(0, 50)) : []),
    })));

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese", nl: "Nederlands" };
    const langName = langNames[langSanitized] || "italiano";

    const proInstruction = isPro ? `\n\n${SYSTEM_PROMPT_PRO}` : "";

    const userMessage = `LINGUA: scrivi TUTTI i valori testuali in ${langName}. Le chiavi JSON restano in italiano.

PIATTO: "${piattoSanitized}"
CATALOGO:
${catalogoJson}
Analisi molecolare -> score -> JSON.${proInstruction}`;

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato. Contatta l'amministratore." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const model = isPro ? "claude-sonnet-4-20250514" : "claude-3-5-haiku-20241022";
    const maxTokens = isPro ? 6000 : 4000;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0,
        system: isPro ? SYSTEM_PROMPT + "\n\n" + SYSTEM_PROMPT_PRO : SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "restituisci_abbinamenti" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("AI API error:", response.status, errText.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI_ERROR", message: `Errore motore AI (${response.status}).` }), {
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

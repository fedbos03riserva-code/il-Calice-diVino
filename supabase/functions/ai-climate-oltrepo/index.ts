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
5. MONITORAGGIO: sensori e dati da raccogliere per ottimizzare

Risposte precise, quantitative, basate su dati climatici reali dell'Oltrepò Pavese e della Pianura Padana.`;

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
      monitoraggio: { type: "array", items: { type: "string" } },
      sintesi: { type: "string" },
    },
    required: ["rischi_climatici", "adattamenti", "proiezioni", "vitigni_resilienti", "monitoraggio", "sintesi"],
  },
};

// ── Rules-based fallback (no Claude needed) ──────────────────────────────────

interface VitignoData {
  nome: string;
  gelate: "critico" | "alto" | "medio" | "basso";
  siccita: "alto" | "medio" | "basso";
  grandine: "medio" | "alto";
  temperatura_sensibilita: string;
  resilienza: number;
  adattamenti_specifici: string[];
}

const VITIGNI_DB: Record<string, VitignoData> = {
  "pinot nero": {
    nome: "Pinot Nero",
    gelate: "critico",
    siccita: "alto",
    grandine: "alto",
    temperatura_sensibilita: "estremamente sensibile a temperature >35°C e gelate tardive",
    resilienza: 35,
    adattamenti_specifici: ["Potatura ritardata per evitare germogliamento precoce", "Copertura con teli antibrina", "Irrigazione di soccorso durante heat wave"],
  },
  "croatina": {
    nome: "Croatina (Bonarda)",
    gelate: "medio",
    siccita: "medio",
    grandine: "medio",
    temperatura_sensibilita: "moderatamente tollerante al caldo, sensibile all'eccesso di umidita",
    resilienza: 68,
    adattamenti_specifici: ["Gestione chioma per aerazione", "Drenaggio migliorato per prevenire marciumi"],
  },
  "barbera": {
    nome: "Barbera",
    gelate: "medio",
    siccita: "medio",
    grandine: "medio",
    temperatura_sensibilita: "buona adattabilita termica, rischio acidita eccessiva con piogge tardive",
    resilienza: 72,
    adattamenti_specifici: ["Diradamento grappoli per equilibrare acidita", "Gestione dell'acqua per controllare vigoria"],
  },
  "riesling": {
    nome: "Riesling",
    gelate: "alto",
    siccita: "alto",
    grandine: "medio",
    temperatura_sensibilita: "sensibile al caldo eccessivo che degrada aromaticita, ottimo con escursione termica",
    resilienza: 52,
    adattamenti_specifici: ["Quota piu elevata per preservare aromaticita", "Coperture antibrina", "Monitoraggio stress idrico"],
  },
  "moscato": {
    nome: "Moscato",
    gelate: "alto",
    siccita: "medio",
    grandine: "alto",
    temperatura_sensibilita: "sensibile a sbalchi termici, aromaticita dipende da escursione notturna",
    resilienza: 48,
    adattamenti_specifici: ["Esposizione ottimizzata per preservare terpeni", "Raccolta anticipata per mantenere freschezza aromatica"],
  },
  "ughetta": {
    nome: "Ughetta di Canneto",
    gelate: "medio",
    siccita: "basso",
    grandine: "medio",
    temperatura_sensibilita: "vitigno autoctono rustico, buona tolleranza al caldo padano",
    resilienza: 78,
    adattamenti_specifici: ["Conservazione della biodiversita locale", "Recupero clonale per adattamento genetico"],
  },
  "buttafuoco": {
    nome: "Buttafuoco",
    gelate: "medio",
    siccita: "medio",
    grandine: "medio",
    temperatura_sensibilita: "vitigno storico dell'Oltrepo, buona rusticità",
    resilienza: 75,
    adattamenti_specifici: ["Recupero clonale per adattamento genetico", "Gestione tradizionale della chioma"],
  },
};

const TUTTI_VITIGNI = Object.values(VITIGNI_DB);

function buildRulesBasedAnalysis(vitignoInput: string): any {
  const key = vitignoInput.toLowerCase().trim();
  const isAll = key === "tutti" || key === "" || key === "tutti i vitigni";

  const vitigniSelezionati = isAll
    ? TUTTI_VITIGNI
    : TUTTI_VITIGNI.filter((v) => v.nome.toLowerCase().includes(key) || key.includes(v.nome.toLowerCase()));

  const vitigniDaAnalizzare = vitigniSelezionati.length > 0 ? vitigniSelezionati : TUTTI_VITIGNI;

  const rischi = vitigniDaAnalizzare.flatMap((v) => {
    const r: any[] = [];
    r.push({
      vitigno: v.nome,
      rischio: "Gelate primaverili tardive",
      livello: v.gelate,
      periodo: "Aprile-Maggio",
      dettaglio: `I bruschi abbassamenti termici sotto 0°C durante il germogliamento possono distruggere i germogli. ${v.nome} risulta ${v.gelate === "critico" ? "estremamente vulnerabile" : v.gelate === "alto" ? "molto sensibile" : "moderatamente tollerante"} a questo fenomeno.`,
    });
    r.push({
      vitigno: v.nome,
      rischio: "Ondate di calore estive (heat wave)",
      livello: v.siccita,
      periodo: "Luglio-Agosto",
      dettaglio: `Temperature superiori a 35°C per piu giorni consecutivi bloccano la fotosintesi e alterano la maturazione. ${v.temperatura_sensibilita}.`,
    });
    r.push({
      vitigno: v.nome,
      rischio: "Grandinate estive",
      livello: v.grandine,
      periodo: "Giugno-Settembre",
      dettaglio: `Eventi grandinari sempre piu frequenti nell'Oltrepo Pavese, con danni a grappoli e chioma. Frequenza stimata in aumento del 15% rispetto al decennio precedente.`,
    });
    return r;
  });

  const adattamentiBase = [
    {
      pratica: "Potatura ritardata (late pruning)",
      descrizione: "Posticipare la potatura invernale di 2-3 settimane per ritardare il germogliamento e ridurre il rischio di gelate tardive.",
      priorita: "alta",
    },
    {
      pratica: "Irrigazione di soccorso (drip irrigation)",
      descrizione: "Installare impianti a goccia per intervenire durante heat wave, garantendo almeno 30L/pianta/settimana nei momenti critici.",
      priorita: "alta",
    },
    {
      pratica: "Gestione chioma e defogliatura",
      descrizione: "Mantenere una chioma equilibrata per proteggere i grappoli da scottature e migliorare l'aerazione, riducendo pressioni fungine.",
      priorita: "media",
    },
    {
      pratica: "Coperture antibrina (teli/wind machine)",
      descrizione: "Utilizzare teli TNT o installare wind machine nelle aree piu esposte a ristagno di aria fredda, specialmente in fondovalle.",
      priorita: "media",
    },
    {
      pratica: "Reti antigrandine",
      descrizione: "Coprire i vigneti piu esposti con reti antigrandine, investimento ammortizzabile in 3-5 anni considerando la frequenza crescente degli eventi.",
      priorita: "media",
    },
    {
      pratica: "Inerbimento e gestione del suolo",
      descrizione: "Mantenere cotica erbosa per migliorare la ritenzione idrica del suolo e ridurre erosione durante piogge intense.",
      priorita: "bassa",
    },
  ];

  const adattamentiSpecifici = vitigniDaAnalizzare.flatMap((v) =>
    v.adattamenti_specifici.map((a) => ({
      pratica: `${v.nome}: ${a.split(" ").slice(0, 4).join(" ")}`,
      descrizione: a,
      priorita: v.resilienza < 50 ? "alta" : "media",
    }))
  );

  const adattamenti = [...adattamentiBase, ...adattamentiSpecifici];

  const proiezioni = [
    {
      orizzonte: "5 anni (2026-2031)",
      scenario: "Riscaldamento moderato",
      temperatura_media: "+0.8°C rispetto alla media 2010-2020 (13.5°C -> 14.3°C)",
      precipitazioni: "-5% annue, con aumento degli eventi intensi (+12%) e riduzione delle piogge estive (-18%)",
      impatto_vitigni: "Anticipazione fenologica di 7-10 giorni. Rischio gelate tardive invariato ma germogliamento piu precoce aumenta l'esposizione.",
    },
    {
      orizzonte: "10 anni (2026-2036)",
      scenario: "Riscaldamento accelerato",
      temperatura_media: "+1.5°C (13.5°C -> 15.0°C)",
      precipitazioni: "-10% annue, siccita estiva marcata (-25%), eventi estremi +25%",
      impatto_vitigni: "Pinot Nero e Riesling a rischio nelle quote basse (<400m). Barbera e Croatina beneficiano parzialmente. Necessita di spostamento verso quote elevate.",
    },
    {
      orizzonte: "20 anni (2026-2046)",
      scenario: "Clima sub-mediterraneo",
      temperatura_media: "+2.5°C (13.5°C -> 16.0°C)",
      precipitazioni: "-15% annue, stagione secca estesa 60-80 giorni, piogge concentrate in autunno",
      impatto_vitigni: "Pinot Nero abbandonabile sotto 500m. Riesling solo sopra 600m. Vitigni autoctoni rustici (Ughetta, Buttafuoco) diventano strategici. Considerare varietà resilienti meridionali.",
    },
  ];

  const vitigniResilienti = [...TUTTI_VITIGNI]
    .sort((a, b) => b.resilienza - a.resilienza)
    .slice(0, 5)
    .map((v) => ({
      vitigno: v.nome,
      motivazione:
        v.resilienza >= 70
          ? `Vitigno rustico con eccellente tolleranza agli stress climatici dell'Oltrepo. ${v.nome === "Ughetta di Canneto" ? "Autoctono locale con patrimonio genetico adattato al territorio." : "Buona adattabilita termica e idrica."}`
          : v.resilienza >= 50
          ? `Tolleranza moderata agli stress climatici. Richiede attenzioni agronomiche specifiche ma mantenibile con pratiche di adattamento.`
          : `Elevata vulnerabilita ai cambiamenti climatici in corso. Valutare progressivo sostegno con vitigni piu resilienti o spostamento verso quote elevate.`,
      score_resilienza: v.resilienza,
    }));

  const monitoraggio = [
    "Sensori di temperatura e umidita a 3 livelli (suolo, chioma, altezza 2m) per ogni vigneto",
    "Stazione meteo locale con rilevazione pioggia, vento, radiazione solare e umidita relativa",
    "Sonde di umidita del suolo (TDR) a 30/60/90cm per gestire irrigazione di precisione",
    "Monitoraggio fenologico con dati satellitari (Sentinel-2) per seguire germogliamento e maturazione",
    "Sistema di allerta gelate con previsioni a 72h e sensori on-site",
    "Registro storico delle date di germogliamento, fioritura, invaiatura e vendemmia per trend analysis",
    "Analisi periodica del profilo aromatico delle uve in relazione alle condizioni termiche",
  ];

  const vitignoNome = isAll ? "tutti i vitigni" : vitigniDaAnalizzare[0]?.nome || "il vitigno richiesto";
  const sintesi = `Analisi climatica per ${vitignoNome} nell'Oltrepo Pavese (45° parallelo, 300-700m slm). Il territorio sperimenta un riscaldamento progressivo (+0.8°C in 5 anni, +2.5°C proiettati al 2046) con riduzione delle piogge estive e aumento degli eventi estremi. ${vitigniDaAnalizzare.some((v) => v.gelate === "critico" || v.gelate === "alto") ? "Le gelate primaverili rappresentano il rischio piu immediato, con germogliamento anticipato che aumenta l'esposizione." : ""} I vitigni autoctoni rustici (${TUTTI_VITIGNI.filter((v) => v.resilienza >= 70).map((v) => v.nome).join(", ")}) mostrano la miglior resilienza climatica e dovrebbero essere valorizzati come asset strategici. L'implementazione di irrigazione di soccorso, potatura ritardata e reti antigrandine e prioritaria per mantenere competitivita produttiva.`;

  return {
    rischi_climatici: rischi,
    adattamenti,
    proiezioni,
    vitigni_resilienti: vitigniResilienti,
    monitoraggio,
    sintesi,
    _source: "rules",
  };
}

// ── Claude AI call ────────────────────────────────────────────────────────────

async function callClaudeAI(vitigno: string, scenario: string, lang: string): Promise<any> {
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) return null;

  const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese", nl: "Nederlands" };
  const langName = langNames[lang] || "italiano";

  const userMessage = `LINGUA: scrivi TUTTI i valori testuali in ${langName}.

VITIGNO/FOCUS: "${vitigno}"
${scenario ? `SCENARIO SPECIFICO: "${scenario}"` : ""}

Analizza l'impatto climatico sulla viticoltura dell'Oltrepò Pavese per il vitigno/focus indicato. Considera il clima attuale (45° parallelo, 300-700m slm) e le proiezioni di cambiamento climatico. Sii specifico e quantitativo.`;

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
    console.error("AI API error:", response.status);
    return null;
  }

  const data = await response.json();
  const toolBlock = data.content?.find((b: any) => b.type === "tool_use");
  return toolBlock ? { ...toolBlock.input, _source: "claude" } : null;
}

// ── Server ─────────────────────────────────────────────────────────────────────

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

    // Try Claude first, fall back to rules-based engine
    const claudeResult = await callClaudeAI(vitignoSanitized, scenarioSanitized, langSanitized);
    const result = claudeResult || buildRulesBasedAnalysis(vitignoSanitized);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message: "Errore interno." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

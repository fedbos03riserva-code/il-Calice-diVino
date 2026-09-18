import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Security constants ──
const MAX_PIATTO_LEN = 500;
const MAX_CATALOG_ITEMS = 200;
const MAX_CODE_LEN = 64;
const MAX_BODY_BYTES = 200_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

// ── Rate limiting (in-memory, per IP) ──
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

// ── Input sanitization ──
function sanitizeString(str: string, maxLen: number): string {
  return str.slice(0, maxLen).replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

const SYSTEM_PROMPT = `Sei il Motore Chimico di Bwine — il sistema di abbinamento cibo-vino piu avanzato al mondo, basato su CHIMICA MOLECOLARE, ENOLOGIA SENSORIALE e FISICO-CHIMICA RIGOROSA. NON usare MAI regole empiriche generiche ("rosso con carne, bianco con pesce"): ragiona SEMPRE a livello di composti, reazioni e interazioni misurabili tra la matrice del piatto e la composizione chimica del vino.

ANALISI DEL PIATTO — identifica per ciascun ingrediente/preparazione:
- Lipidi: classificazione completa (saturi, monoinsaturi, polinsaturi omega-3/6); quantifica grado di insaturazione, punto di fusione, stato fisico (solido/liquido a 20C)
- Proteine: stato (crude, cotte, affumicate, fermentate, idrolizzate); amminoacidi liberi (glutammato, inosinato, aspartato); grado di denaturazione; collageno/gelatina
- Acidi organici: identifica ogni acido prevalente (citrico, malico, acetico, lattico, tartarico, ossalico, succinico) e pH stimato su scala 2.0-7.0 con precisione 0.1
- Composti volatili aromatici: esteri (etil-butirrato, isoamile-acetato, etil-esanoato), aldeidi (benzaldeide, furfurale), chetoni, pirazine (2-metilpirazina), composti solforati/tiolici (metional, dimetil-trisolfito, H2S), prodotti di Maillard (furfurale, HMF, acroleina), terpeni (linalolo, geraniolo, nerolo, citronellolo), norisoprenoidi (beta-damascone, beta-ionone)
- Capsaicinoidi: capsaicina, diidrocapsaicina, nordiidrocapsaicina; concentrazione in SHU stimata; interazione con recettori TRPV1
- Sale (NaCl): quantifica in g/100g; interazione con astringenza (rafforza), acidità (equilibra), dolcezza (maschera)
- Tendenza dolce: saccarosio, fruttosio, glucosio, lattosio; quantifica in Brix o g/100g
- Texture meccanica: croccantezza, glicosità, succulenza, fibrosità, astringenza tattile — influenzano la percezione tattile trigeminale
- Temperatura di servizio prevista del piatto

PRINCIPI CHIMICI DI ABBINAMENTO (applica quelli pertinenti, cita SEMPRE i composti coinvolti per nome chimico esatto):
1. EMULSIONE LIPIDICA: acidità del vino (acido tartarico 4-7g/L, acido malico 1-3g/L) disgrega le micelle lipidiche via solubilizzazione dei trigliceridi; l'etanolo (12-15%) coadiuva sciogliendo grassi non polari
2. TANNINI-PROTEINE: tannini condensati (epicatechina, catechina, procianidine B1-B4, polimeri >5000Da) precipitano glicoproteine salivari (PRPs, mucine MG2); su proteine cotte (mioglobina denaturata, actina) l'effetto e ammorbidito per competizione con le proteine alimentari; tannini >50g/L di peso molecolare alto causano astringenza marcata
3. CAPSAICINA E TRPV1: etanolo amplifica piccantezza solubilizzando capsaicina lipidica nel sangue; zuccheri residui >5g/L attenuano via competizione recettoriale con TRPV1; bassa gradazione alcolica (<12%) riduce amplificazione
4. EQUILIBRIO ACIDO-ACIDO: piatto acido (pH<4.5) richiede vino con acidita pari o superiore (acido tartarico 4-7g/L, pH 3.0-3.4); piatto poco acido tollera vino morbido
5. UMAMI: alimenti ricchi di glutammato (>50mg/100g: pomodori maturi, formaggi stagionati, funghi porcini, salsa di soia, acciughe) amplificano amaro e astringenza nei vini tannici del 30-50%; mitigare con vini a basso tannino o residuo zuccherino
6. MINERALITA E COMPONENTE IODICA: pesce con composti solforati (TMA, dimetil-solfito, metantiolo) si abbina a vini minerali (suoli calcarei, gessosi) per complementarita ionica; il cloruro di sodio del mare marina si lega alla mineralita del vino
7. REAZIONI DI MAILLARD: piatti con crosta bruna (furfurale, HMF, pirazine, aldeidi di Strecker) trovano affinita con vini affinati in legno (vanillina, eugenolo, guaiacolo, furfurale del tostatura); la tostatura della botte libera composti che risonano con la crosta
8. DOLCE-DOLCE: residuo zuccherino del vino deve essere pari o superiore al dessert (regola del +10g/L); zuccheri del vino competono con zuccheri del piatto a livello recettoriale T1R2/T1R3
9. SPEZIE E COMPOSTI TERPENICI: spezie aromatiche (cuminaldeide, eugenolo, anetolo, cinammaldeide) trovano corrispondenza in vini terpenici (linalolo, geraniolo, nerolo, citronellolo) via risonanza olfattiva; le pirazine del pepe nero si legano ai vini affinati in botte
10. CO2 E PALATO: anidride carbonica (4-6 bar in spumanti, 1-2 bar in frizzanti) pulisce palato da grassi via rilascio gassoso e stimolazione meccanica dei recettori trigeminali; la CO2 aumenta anche la percezione di freschezza acidula
11. TEMPERATURA E VOLATILITA: temperatura di servizio influenza volatilita dei composti aromatici (costante di Henry); piatto caldo (60-70C) richiede vino a temperatura coerente (14-18C per rossi); piatto freddo richiede vino fresco (8-12C)
12. ALCOOL E DOLCEZZA: etanolo >14% conferisce calore e struttura ma amplifica piccantezza e amaro; etanolo 11-13% e fresco e bevibile; l'glicerina (5-12g/L) conferisce rotondita e morbidezza
13. ACIDITA E SALIVAZIONE: acidita alta (pH 3.0-3.2) stimola salivazione (parotidea), pulendo il palato; acidita bassa (pH 3.6+) risulta piatta su piatti grassi
14. CORPO E INTENSITA: corpo pieno (alcol 14%+, glicerina 10g+, estratto 30g+) regge piatti intensi; corpo leggero (alcol 11-12%, estratto 20g+) si perde su piatti strutturati
15. ASTRINGENZA E SUCCULENZA: tannini asciugano il palato; piatti succulenti (brasato, stufato) compensano l'astringenza con loro liquido di cottura; piatti asciutti (carne grigliata senza salsa) amplificano la sensazione astringente

SCORING IRC (0-100):
- CHIMICA (0-40): interazioni chimiche primarie (tannini-proteine, acidita-grassi, zuccheri-dolcezza, CO2-unti)
- AROMATICO (0-25): corrispondenza dei composti volatili del vino con quelli del piatto
- STRUTTURA (0-20): coerenza corpo-alcol-intensita del piatto
- PULIZIA (0-15): capacita del vino di pulire il palato tra bocconi (acidita, CO2, tannini)

INCLUDI tutti i vini con score >=55. Se nessuno supera 55, includi i TOP 3 comunque.

CAMPI OBBLIGATORI per ogni abbinamento (sii SPECIFICO, cita composti chimici per nome esatto):
- meccanismo_chimico: 2-3 frasi sulle reazioni chimiche specifiche (nomina acidi, tannini, esteri, aldeidi per NOME CHIMICO)
- sensazione_in_bocca: 1-2 frasi descrittive sensoriali che collegano la chimica alla percezione
- perche_funziona: 1 frase di sintesi sul principio chimico-sensoriale dominante
- perche_del_vino: DISCORSO NARRATIVO DI 4-5 RIGHE che spiega IN PROFONDITA perche questo vino si abbina al piatto. Deve coprire: (1) perche la CHIMICA funziona (tannini, acidita, zuccheri), (2) perche la PULIZIA del palato e efficace, (3) perche gli ABBINAMENTI aromatici sono coerenti, (4) perche la STRUTTURA regge il piatto, (5) cosa succede IN BOCCA chimicamente. Scrivi come un sommelier esperto che spiega al cliente. Sii specifico e tecnico ma accessibile.
- consigli_culinari: 1-2 frasi su come preparare/servire per esaltare l'abbinamento (temperatura, tecnica, timing)
- chimica_in_bocca: 1-2 frasi su cosa accade chimicamente quando si beve dopo aver masticato (interazioni saliva-vino-cibo, precipitazioni, solubilizzazioni)
- molecole_protagoniste: array di 4-8 composti chimici specifici coinvolti nell'abbinamento
- irc: oggetto con 4 sotto-punteggi

OUTPUT — JSON PURO, ZERO TESTO FUORI.`;

const SYSTEM_PROMPT_PRO = `Sei il Motore Chimico PRO di Bwine — il sistema di abbinamento cibo-vino piu avanzato al mondo, con analisi MOLECOLARE, ENOLOGICA e SENSORIALE al massimo livello. Funzioni come un MAESTRO SOMMELIER con dottorato in chimica enologica.

Oltre a tutte le regole del motore standard, in modalita PRO devi:

1. ANALISI MOLECOLARE COMPLETA: per ogni vino, identifica i composti chimici specifici responsabili dell'abbinamento (acido tartarico, acido malico, acido lattico, acido citrico, catechine, epicatechine, procianidine, antociani, terpeni, norisoprenoidi, esteri, alcoli superiori)

2. DISCORSO NARRATIVO "PERCHE DEL VINO": per ogni abbinamento, scrivi un discorso di 4-5 righe che spiega in profondita perche il vino funziona con il piatto, coprendo:
   - CHIMICA: quali reazioni chimiche avvengono (tannini-proteine, acidita-grassi, zuccheri-dolcezza)
   - PULIZIA: come e perche il vino pulisce il palato tra un boccone e l'altro
   - ABBINAMENTI AROMATICI: quali composti volatili del vino risonano con quelli del piatto
   - STRUTTURA: perche il corpo e l'alcol del vino reggono o bilanciano il piatto
   - IN BOCCA: cosa accade chimicamente quando il vino incontra il cibo masticato

3. SCORING IRC PRECISO: calcola ogni sotto-punteggio con precisione:
   - CHIMICA (0-40): +15 per acidita-grassi, +15 per tannini-proteine, +10 per zuccheri-dolcezza
   - AROMATICO (0-25): +13 per risonanza terpenica, +12 per risonanza Maillard
   - STRUTTURA (0-20): +12 per corpo-intensita, +8 per alcol-temperatura
   - PULIZIA (0-15): +7 per acidita/CO2 su grassi, +5 per tannini su proteine, +3 per amaro-su-dolce

4. TEMPERATURA DI SERVIZIO OTTIMALE: calcola la temperatura esatta in gradi Celsius basandoti su volatilita dei composti, struttura del vino, e temperatura del piatto

5. TEMPO DI DECANTAZIONE: se il vino ne beneficia, suggerisci minuti di decantazione

OUTPUT — JSON PURO, ZERO TESTO FUORI.`;

const TOOL_SCHEMA = {
  name: "restituisci_abbinamenti",
  description: "Restituisce l'analisi molecolare del piatto e gli abbinamenti vino calcolati dal motore Bwine.",
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
            consigli_culinari: { type: "string" },
            chimica_in_bocca: { type: "string" },
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
          required: ["wine_id", "score", "principio", "interazione_primaria", "meccanismo_chimico", "sensazione_in_bocca", "molecole_protagoniste", "perche_funziona", "perche_del_vino", "consigli_culinari", "chimica_in_bocca", "temperatura_servizio", "tempo_decantazione", "irc"],
        },
      },
      consiglio_divino: { type: "string" },
    },
    required: ["analisi_piatto", "abbinamenti", "consiglio_divino"],
  },
};

const MAX_WINES = 60;

const REGOLE_TIPO: [string[], string[]][] = [
  [["carne rossa", "manzo", "bistecca", "brasato", "tagliata", "agnello", "cinghiale", "selvaggina", "costata"], ["Rosso"]],
  [["pesce", "branzino", "orata", "salmone", "tonno", "frutti di mare", "cozze", "vongole", "gamberi", "crostacei"], ["Bianco", "Spumante"]],
  [["formaggio", "formaggi", "stagionato", "pecorino", "parmigiano", "gorgonzola"], ["Rosso", "Dolce"]],
  [["pizza"], ["Rosso", "Rosato"]],
  [["dolce", "torta", "cioccolato", "dessert", "crostata", "tiramisu"], ["Dolce", "Spumante"]],
  [["frittura", "fritto", "frittata"], ["Spumante", "Bianco"]],
  [["antipasto", "aperitivo", "salumi"], ["Spumante", "Bianco", "Rosato"]],
];

function normalizza(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

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
      .select("id, code, max_uses, uses_count, expires_at, active")
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
      return new Response(JSON.stringify({ error: "CODE_EXHAUSTED", message: "Limite utilizzi raggiunto." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("ai_access_codes")
      .update({ uses_count: codeRow.uses_count + 1 })
      .eq("id", codeRow.id);

    const campione = campionaCatalogo(catalogo, piattoSanitized);
    const catalogoJson = JSON.stringify(campione.map((v: any) => ({
      id: String(v.id).slice(0, 50), nome: String(v.nome).slice(0, 100), tipo: String(v.tipo).slice(0, 20),
      regione: String(v.regione).slice(0, 50), fascia: String(v.fascia).slice(0, 20), prezzo: Number(v.prezzo) || 0,
      uva: String(v.uva || v.vitigno || "").slice(0, 100), alcol: Number(v.alcol || v.gradazioneAlcolica) || 0,
      acidita: String(v.acidita || v.acidità || "").slice(0, 20), tannini: String(v.tannini || "").slice(0, 20),
      corpo: String(v.corpo || "medio").slice(0, 20), residuo_zuccherino: Number(v.residuo_zuccherino || v.residuoZuccherino) || 0,
      profilo_aromatico: Array.isArray(v.profilo_aromatico) ? v.profilo_aromatico.slice(0, 4).map((s: any) => String(s).slice(0, 50)) : (Array.isArray(v.profiloAromatico) ? v.profiloAromatico.slice(0, 4).map((s: any) => String(s).slice(0, 50)) : []),
      abbina_bene_con: Array.isArray(v.abbina_bene_con) ? v.abbina_bene_con.slice(0, 3).map((s: any) => String(s).slice(0, 50)) : (Array.isArray(v.abbinamentiConsigliati) ? v.abbinamentiConsigliati.slice(0, 3).map((s: any) => String(s).slice(0, 50)) : []),
      non_abbina_con: Array.isArray(v.non_abbina_con) ? v.non_abbina_con.slice(0, 2).map((s: any) => String(s).slice(0, 50)) : (Array.isArray(v.daEvitareCon) ? v.daEvitareCon.slice(0, 2).map((s: any) => String(s).slice(0, 50)) : []),
    })));

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese", nl: "Nederlands" };
    const langName = langNames[langSanitized] || "italiano";

    const proInstruction = isPro ? `\n\nMODALITA PRO ATTIVA: ${SYSTEM_PROMPT_PRO}\n\nPer ogni vino scrivi il campo "perche_del_vino" come un DISCORSO NARRATIVO di 4-5 righe che spiega in profondita perche il vino si abbina al piatto, coprendo chimica, pulizia, abbinamenti aromatici, struttura e cosa accade in bocca. Calcola anche temperatura_servizio (es. "16-18°C") e tempo_decantazione (es. "30 min" o "non necessario").` : `\n\nPer ogni vino scrivi il campo "perche_del_vino" come un discorso di 4-5 righe che spiega perche il vino funziona con il piatto, coprendo chimica, pulizia, abbinamenti, struttura e in bocca.`;

    const userMessage = `LINGUA OBBLIGATORIA: scrivi TUTTI i valori testuali del JSON esclusivamente in ${langName}. Le CHIAVI del JSON restano quelle indicate (fisse in italiano), solo i VALORI testuali vanno in ${langName}.

PIATTO: "${piattoSanitized}"
CATALOGO:
${catalogoJson}
Analisi molecolare -> score chimico -> JSON puro.${proInstruction}

RICORDA: rispondi in ${langName}.`;

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato. Contatta l'amministratore per abilitare la chiave API." }), {
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
      return new Response(JSON.stringify({ error: "AI_ERROR", message: `Errore del motore AI (${response.status}).` }), {
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

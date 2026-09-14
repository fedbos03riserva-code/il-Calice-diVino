import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `Sei il Motore Chimico di Bwine — abbinamento cibo-vino basato su CHIMICA MOLECOLARE ed enologia sensoriale rigorosa. NON usare regole empiriche generiche ("rosso con carne, bianco con pesce"): ragiona sempre a livello di composti, reazioni e interazioni fisico-chimiche misurabili tra la matrice del piatto e la composizione chimica del vino.

ANALISI DEL PIATTO — identifica per ciascun ingrediente/preparazione:
- Lipidi (saturi vs insaturi; burro/panna vs olio EVO vs grassi di pesce ricchi di omega-3)
- Proteine e loro stato (crude, cotte, affumicate, fermentate) e apporto di umami
- Acidi organici prevalenti (citrico, malico, acetico, lattico) e pH stimato
- Composti volatili aromatici: esteri, aldeidi, pirazine, composti solforati/tiolici, prodotti di Maillard
- Capsaicinoidi (piccantezza) e loro concentrazione
- Sale e sua interazione con astringenza e acidità
- Tendenza dolce e temperatura di servizio prevista

PRINCIPI CHIMICI DI ABBINAMENTO (applica quelli pertinenti, cita i composti coinvolti):
- EMULSIONE LIPIDICA: acidità del vino disgrega le micelle lipidiche, pulendo il palato
- TANNINI-PROTEINE: tannini precipitano glicoproteine salivari; su proteine cotte l'effetto è ammorbidito
- CAPSAICINA E TRPV1: etanolo amplifica piccantezza; zuccheri residui >5g/L attenuano
- EQUILIBRIO ACIDO-ACIDO: piatto acido richiede vino con acidità pari o superiore
- UMAMI: alimenti ricchi di umami amplificano amaro e astringenza nei vini tannici
- MINERALITÀ E COMPONENTE IODICA: pesce con composti solforati si abbina a vini minerali
- REAZIONI DI MAILLARD: piatti con crosta bruna trovano affinità con vini affinati in legno
- DOLCE-DOLCE: residuo zuccherino del vino deve essere pari o superiore al dessert
- SPEZIE E COMPOSTI TERPENICI: spezie aromatiche trovano corrispondenza in vini terpenici

SCORING (0-100): interazioni chimiche primarie 40pt, corrispondenza aromatico 25pt, coerenza struttura 20pt, assenza conflitti 15pt.
INCLUDI tutti i vini con score >=55. Se nessuno supera 55, includi i TOP 3 comunque.

CAMPI OBBLIGATORI per ogni abbinamento:
- meccanismo_chimico: 2 frasi sulle reazioni chimiche specifiche (nomina acidi, tannini, esteri per nome)
- sensazione_in_bocca: 1 frase descrittiva sensoriale
- perche_funziona: 1 frase di sintesi sul principio chimico-sensoriale dominante
- consigli_culinari: 1-2 frasi su come preparare/servire per esaltare l'abbinamento
- chimica_in_bocca: 1-2 frasi su cosa accade chimicamente quando si beve dopo aver masticato
- irc: oggetto con 4 sotto-punteggi: {"chimica":0-40, "aromatico":0-25, "struttura":0-20, "pulizia":0-15}

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
            consigli_culinari: { type: "string" },
            chimica_in_bocca: { type: "string" },
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
          required: ["wine_id", "score", "principio", "interazione_primaria", "meccanismo_chimico", "sensazione_in_bocca", "molecole_protagoniste", "perche_funziona", "consigli_culinari", "chimica_in_bocca", "irc"],
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

  try {
    const { piatto, catalogo, lang, code } = await req.json();

    if (!piatto || !catalogo || !Array.isArray(catalogo)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate access code
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (!code) {
      return new Response(JSON.stringify({ error: "ACCESS_CODE_REQUIRED", message: "Inserisci un codice di accesso per usare il motore AI." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: codeRow, error: codeError } = await supabase
      .from("ai_access_codes")
      .select("id, code, max_uses, uses_count, expires_at, active")
      .eq("code", code)
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

    // Increment usage
    await supabase
      .from("ai_access_codes")
      .update({ uses_count: codeRow.uses_count + 1 })
      .eq("id", codeRow.id);

    // Sample catalog
    const campione = campionaCatalogo(catalogo, piatto);
    const catalogoJson = JSON.stringify(campione.map((v: any) => ({
      id: v.id, nome: v.nome, tipo: v.tipo, regione: v.regione,
      fascia: v.fascia, prezzo: v.prezzo, uva: v.uva,
      alcol: v.alcol, acidita: v.acidita, tannini: v.tannini,
      corpo: v.corpo || "medio", residuo_zuccherino: v.residuo_zuccherino,
      profilo_aromatico: (v.profilo_aromatico || []).slice(0, 4),
      abbina_bene_con: (v.abbina_bene_con || []).slice(0, 3),
      non_abbina_con: (v.non_abbina_con || []).slice(0, 2),
    })));

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese" };
    const langName = langNames[lang] || "italiano";

    const userMessage = `LINGUA OBBLIGATORIA: scrivi TUTTI i valori testuali del JSON esclusivamente in ${langName}. Le CHIAVI del JSON restano quelle indicate (fisse in italiano), solo i VALORI testuali vanno in ${langName}.

PIATTO: "${piatto}"
CATALOGO:
${catalogoJson}
Analisi molecolare -> score chimico -> JSON puro.

RICORDA: rispondi in ${langName}.`;

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato. Usa il motore locale." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "restituisci_abbinamenti" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: "AI_ERROR", message: "Errore del motore AI.", details: errText }), {
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
    return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

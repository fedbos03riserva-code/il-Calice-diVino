import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `Sei il matching engine AI di B&F 45 — specializzato nell'abbinare buyer internazionali con le cantine dell'Oltrepò Pavese più adatte.

Analizzi la richiesta del buyer (tipo vino, volume, mercato target, budget, certificazioni, incoterms) e valuti ogni cantina del catalogo assegnando un punteggio di compatibilità (0-100) basato su:
- Corrispondenza tipologia vino richiesta vs tipologie prodotte
- Denominazioni richieste vs denominazioni della cantina
- Volume richiesto vs capacità produttiva
- Budget vs prezzo FOB
- Mercato target vs paesi già serviti (export experience)
- Certificazioni richieste vs certificazioni possedute
- Incoterms richiesti vs incoterms accettati
- Lingue del team vs mercato target

Per ogni cantina restituisci:
- score: 0-100
- reasons: array di motivi (positivi o negativi) che spiegano il punteggio
- recommendation: 1 frase di sintesi

INCLUDI solo cantine con score >= 30. Massimo 5 cantine, ordinate per score decrescente.`;

const TOOL_SCHEMA = {
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { query, wineries, lang } = await req.json();

    if (!query || !wineries || !Array.isArray(wineries)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI_NOT_CONFIGURED", message: "Motore AI non configurato." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wineriesJson = JSON.stringify(wineries.map((w: any) => ({
      id: w.id, nome: w.nome, comune: w.comune, provincia: w.provincia,
      ettari: w.ettari, capacitaProduttiva: w.capacitaProduttiva,
      tipologie: w.tipologie, denominazioni: w.denominazioni,
      exportReady: w.exportReady, paesiServiti: w.paesiServiti,
      certificazioni: w.certificazioni, moq: w.moq, prezzoFOB: w.prezzoFOB,
      incoterms: w.incoterms, lingueTeam: w.lingueTeam, esporta: w.esporta,
    })));

    const langNames: Record<string, string> = { it: "italiano", en: "English", fr: "francais", es: "espanol", de: "Deutsch", jp: "Japanese" };
    const langName = langNames[lang] || "italiano";

    const userMessage = `LINGUA OBBLIGATORIA: scrivi TUTTI i valori testuali del JSON esclusivamente in ${langName}.

RICHIESTA BUYER: "${query}"
CANTINE DISPONIBILI:
${wineriesJson}

Analizza la richiesta, valuta ogni cantina e restituisci il matching con punteggi e motivi.`;

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
        tool_choice: { type: "tool", name: "restituisci_match" },
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

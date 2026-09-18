import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 15;

const rateMap = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRate(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit superato. Riprova tra 1 minuto." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { compound, lang } = await req.json();
    if (!compound || typeof compound !== "string" || compound.length > 200) {
      return new Response(JSON.stringify({ error: "Composto non valido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitized = compound.replace(/[<>"'{}\\]/g, "").trim();
    if (!sanitized) {
      return new Response(JSON.stringify({ error: "Composto vuoto" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langCode = (lang || "it").slice(0, 2);

    const promptMap: Record<string, string> = {
      it: `Spiega in modo breve e chiaro il composto chimico "${sanitized}" nel contesto del vino e dell'abbinamento cibo-vino. Rispondi in JSON con questa struttura esatta:
{
  "nome": "nome del composto",
  "cosa_e": "cos'è in 2-3 frasi semplici, comprensibili a un non chimico",
  "cosa_serve": "a cosa serve nel vino e nell'abbinamento cibo-vino in 2-3 frasi",
  "dove_si_trova": "dove si trova naturalmente (nel vino, nel cibo, o entrambi)",
  "effetto_in_bocca": "che effetto ha in bocca quando beviamo o mangiamo"
}
Non aggiungere testo fuori dal JSON.`,
      en: `Explain briefly and clearly the chemical compound "${sanitized}" in the context of wine and food pairing. Reply in JSON with this exact structure:
{
  "nome": "compound name",
  "cosa_e": "what it is in 2-3 simple sentences, understandable to a non-chemist",
  "cosa_serve": "what it does in wine and food pairing in 2-3 sentences",
  "dove_si_trova": "where it is found naturally (in wine, in food, or both)",
  "effetto_in_bocca": "what effect it has in the mouth when drinking or eating"
}
Do not add text outside the JSON.`,
      fr: `Explique brièvement et clairement le composé chimique "${sanitized}" dans le contexte du vin et de l'accord mets-vin. Répondez en JSON avec cette structure exacte:
{
  "nome": "nom du composé",
  "cosa_e": "ce que c'est en 2-3 phrases simples, compréhensible par un non-chimiste",
  "cosa_serve": "à quoi ça sert dans le vin et l'accord mets-vin en 2-3 phrases",
  "dove_si_trova": "où on le trouve naturellement (dans le vin, dans la nourriture, ou les deux)",
  "effetto_in_bocca": "quel effet il a en bouche quand on boit ou mange"
}
N'ajoutez pas de texte en dehors du JSON.`,
    };

    const prompt = promptMap[langCode] || promptMap.it;

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key non configurata" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Errore AI" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return new Response(JSON.stringify({
        nome: sanitized,
        cosa_e: text.slice(0, 300),
        cosa_serve: "",
        dove_si_trova: "",
        effetto_in_bocca: "",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
// force redeploy

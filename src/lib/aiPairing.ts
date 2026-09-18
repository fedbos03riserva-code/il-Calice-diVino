import { supabase } from "./supabase";
import type { Wine, PairingResult } from "../types/wine";
import { pairDishWithCatalog } from "./pairingEngine";

const REGOLE_TIPO_CLIENT: [string[], string[]][] = [
  [["carne rossa", "manzo", "bistecca", "brasato", "tagliata", "agnello", "cinghiale", "selvaggina", "costata"], ["Rosso"]],
  [["pesce", "branzino", "orata", "salmone", "tonno", "frutti di mare", "cozze", "vongole", "gamberi", "crostacei"], ["Bianco", "Spumante"]],
  [["formaggio", "formaggi", "stagionato", "pecorino", "parmigiano", "gorgonzola"], ["Rosso", "Dolce"]],
  [["pizza"], ["Rosso", "Rosato"]],
  [["dolce", "torta", "cioccolato", "dessert", "crostata", "tiramisu"], ["Dolce", "Spumante"]],
  [["frittura", "fritto", "frittata"], ["Spumante", "Bianco"]],
  [["antipasto", "aperitivo", "salumi"], ["Spumante", "Bianco", "Rosato"]],
];

function sampleCatalogForAI(catalog: Wine[], dish: string, maxN = 60): Wine[] {
  if (catalog.length <= maxN) return catalog;
  const p = dish.toLowerCase().trim();
  const tipiPrioritari: string[] = [];
  for (const [keywords, ts] of REGOLE_TIPO_CLIENT) {
    if (keywords.some((k) => p.includes(k))) tipiPrioritari.push(...ts);
  }
  const prioritari = tipiPrioritari.length > 0 ? catalog.filter((w) => tipiPrioritari.includes(w.tipo)) : [];
  const resto = catalog.filter((w) => !prioritari.includes(w));
  const slotPrioritari = tipiPrioritari.length > 0 ? Math.min(prioritari.length, Math.floor(maxN * 0.6)) : 0;
  const campione = prioritari.slice(0, slotPrioritari);
  const perTipo: Record<string, Wine[]> = {};
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

export interface AIPairingResult {
  analisi_piatto: {
    ingredienti_identificati: string[];
    grassi: string;
    proteine: string;
    acidi: string;
    volatili_aromatici: string[];
    piccantezza: string;
    umami: string;
    tendenza_dolce: string;
    complessita: string;
    sfida_abbinamento: string;
  };
  abbinamenti: Array<{
    wine_id: string;
    score: number;
    principio: string;
    interazione_primaria: string;
    meccanismo_chimico: string;
    sensazione_in_bocca: string;
    molecole_protagoniste: string[];
    perche_funziona: string;
    perche_del_vino: string;
    discorso_sommelier: string;
    discorso_appassionato: string;
    consigli_culinari: string;
    chimica_in_bocca: string;
    reazione_digestiva: string;
    temperatura_servizio: string;
    tempo_decantazione: string;
    irc: { chimica: number; aromatico: number; struttura: number; pulizia: number };
  }>;
  consiglio_divino: string;
}

const CODE_STORAGE_KEY = "bf45_ai_code";

export function getStoredCode(): string | null {
  return localStorage.getItem(CODE_STORAGE_KEY);
}

export function setStoredCode(code: string) {
  localStorage.setItem(CODE_STORAGE_KEY, code);
}

export function clearStoredCode() {
  localStorage.removeItem(CODE_STORAGE_KEY);
}

export async function validateCode(code: string): Promise<{ valid: boolean; error?: string; daily?: { limit: number; uses: number; remaining: number } }> {
  if (!code.trim()) return { valid: false, error: "Inserisci un codice" };
  const { data, error } = await supabase
    .from("ai_access_codes")
    .select("id, max_uses, uses_count, expires_at, active, daily_limit, daily_uses_count, daily_reset_at")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return { valid: false, error: "Codice non valido" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, error: "Codice scaduto" };
  if (data.uses_count >= data.max_uses) return { valid: false, error: "Limite utilizzi totali raggiunto" };

  // Check daily limit
  const now = new Date();
  const dailyLimit = data.daily_limit || 20;
  let dailyUses = data.daily_uses_count || 0;
  const dailyResetAt = data.daily_reset_at ? new Date(data.daily_reset_at) : null;
  if (!dailyResetAt || (now.getTime() - dailyResetAt.getTime()) > 24 * 60 * 60 * 1000) {
    dailyUses = 0;
  }
  if (dailyUses >= dailyLimit) return { valid: false, error: `Limite giornaliero raggiunto (${dailyLimit} usi). Si resetta tra 24 ore.` };

  return { valid: true, daily: { limit: dailyLimit, uses: dailyUses, remaining: dailyLimit - dailyUses } };
}

export async function getDailyUsage(code: string): Promise<{ limit: number; uses: number; remaining: number } | null> {
  const { data } = await supabase
    .from("ai_access_codes")
    .select("daily_limit, daily_uses_count, daily_reset_at")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .maybeSingle();
  if (!data) return null;
  const now = new Date();
  const dailyLimit = data.daily_limit || 20;
  let dailyUses = data.daily_uses_count || 0;
  const dailyResetAt = data.daily_reset_at ? new Date(data.daily_reset_at) : null;
  if (!dailyResetAt || (now.getTime() - dailyResetAt.getTime()) > 24 * 60 * 60 * 1000) {
    dailyUses = 0;
  }
  return { limit: dailyLimit, uses: dailyUses, remaining: dailyLimit - dailyUses };
}

export async function getAIPairing(
  dish: string,
  catalog: Wine[],
  lang: string,
  code: string,
  pro = false
): Promise<{ ai: boolean; results: PairingResult[]; analysis?: AIPairingResult["analisi_piatto"]; consiglio?: string; error?: string }> {
  try {
    // Campiona il catalogo lato client per ridurre il payload
    const sampled = sampleCatalogForAI(catalog, dish);
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-pairing`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ piatto: dish, catalogo: sampled, lang, code, pro }),
    });

    if (!response.ok) {
      return { ai: false, results: pairDishWithCatalog(catalog, dish), error: "local" };
    }

    const data: AIPairingResult = await response.json();

    const wineMap = new Map(catalog.map((w) => [w.id, w]));
    const results: PairingResult[] = (data.abbinamenti || [])
      .map((a) => {
        const wine = wineMap.get(a.wine_id);
        if (!wine) return null;
        return {
          wine,
          score: {
            chimica: a.irc.chimica,
            aromatico: a.irc.aromatico,
            struttura: a.irc.struttura,
            pulizia: a.irc.pulizia,
            totale: a.score,
          },
          meccanismo_chimico: a.meccanismo_chimico || "",
          sensazione_in_bocca: a.sensazione_in_bocca || "",
          consigli_culinari: a.consigli_culinari || "",
          motivo_abbinamento: a.perche_funziona || "",
          perche_del_vino: a.perche_del_vino || "",
          discorso_sommelier: a.discorso_sommelier || "",
          discorso_appassionato: a.discorso_appassionato || "",
          chimica_in_bocca: a.chimica_in_bocca || "",
          reazione_digestiva: a.reazione_digestiva || "",
          molecole_protagoniste: a.molecole_protagoniste || [],
          temperatura_servizio: a.temperatura_servizio || "",
          tempo_decantazione: a.tempo_decantazione || "",
        } as PairingResult;
      })
      .filter((r): r is PairingResult => r !== null)
      .sort((a, b) => b.score.totale - a.score.totale);

    return { ai: true, results, analysis: data.analisi_piatto, consiglio: data.consiglio_divino };
  } catch {
    return { ai: false, results: pairDishWithCatalog(catalog, dish), error: "local" };
  }
}

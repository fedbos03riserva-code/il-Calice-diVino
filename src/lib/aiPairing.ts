import { supabase } from "./supabase";
import type { Wine, PairingResult } from "../types/wine";
import { pairDishWithCatalog } from "./pairingEngine";

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
    consigli_culinari: string;
    chimica_in_bocca: string;
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

export async function validateCode(code: string): Promise<{ valid: boolean; error?: string }> {
  if (!code.trim()) return { valid: false, error: "Inserisci un codice" };
  const { data, error } = await supabase
    .from("ai_access_codes")
    .select("id, max_uses, uses_count, expires_at, active")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return { valid: false, error: "Codice non valido" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, error: "Codice scaduto" };
  if (data.uses_count >= data.max_uses) return { valid: false, error: "Limite utilizzi raggiunto" };
  return { valid: true };
}

export async function getAIPairing(
  dish: string,
  catalog: Wine[],
  lang: string,
  code: string
): Promise<{ ai: boolean; results: PairingResult[]; analysis?: AIPairingResult["analisi_piatto"]; consiglio?: string; error?: string }> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-pairing`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ piatto: dish, catalogo: catalog, lang, code }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { ai: false, results: pairDishWithCatalog(catalog, dish), error: err.message || "AI non disponibile, uso motore locale" };
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
        } as PairingResult;
      })
      .filter((r): r is PairingResult => r !== null)
      .sort((a, b) => b.score.totale - a.score.totale);

    return { ai: true, results, analysis: data.analisi_piatto, consiglio: data.consiglio_divino };
  } catch {
    return { ai: false, results: pairDishWithCatalog(catalog, dish), error: "Errore di connessione, uso motore locale" };
  }
}

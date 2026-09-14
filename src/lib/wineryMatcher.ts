import type { Winery } from "../data/wineryDirectory";

export interface BuyerQuery {
  description: string;
  tipoVino?: string;
  denominazione?: string;
  paese?: string;
  volume?: number;
  budget?: number;
  certificazione?: string;
  incoterm?: string;
}

export interface WineryMatch {
  winery: Winery;
  score: number;
  reasons: string[];
}

const COUNTRY_REGION_MAP: Record<string, string[]> = {
  "giappone": ["Giappone", "Asia"],
  "japan": ["Giappone", "Asia"],
  "germania": ["Germania", "Europa"],
  "germany": ["Germania", "Europa"],
  "usa": ["USA", "America"],
  "stati uniti": ["USA", "America"],
  "svizzera": ["Svizzera", "Europa"],
  "switzerland": ["Svizzera", "Europa"],
  "uk": ["UK", "Europa"],
  "inghilterra": ["UK", "Europa"],
  "cina": ["Cina", "Asia"],
  "china": ["Cina", "Asia"],
  "corea": ["Corea del Sud", "Asia"],
  "korea": ["Corea del Sud", "Asia"],
  "belgio": ["Belgio", "Europa"],
  "belgium": ["Belgio", "Europa"],
  "francia": ["Francia", "Europa"],
  "france": ["Francia", "Europa"],
  "australia": ["Australia", "Oceania"],
  "taiwan": ["Taiwan", "Asia"],
  "svezia": ["Svezia", "Europa"],
  "sweden": ["Svezia", "Europa"],
  "danimarca": ["Danimarca", "Europa"],
  "denmark": ["Danimarca", "Europa"],
};

const DENOM_KEYWORDS: Record<string, string[]> = {
  "pinot nero": ["Pinot Nero DOC", "Pinot Nero"],
  "pinot noir": ["Pinot Nero DOC", "Pinot Nero"],
  "bonarda": ["Bonarda DOC"],
  "buttafuoco": ["Buttafuoco DOC", "Buttafuoco Storico"],
  "sangue di giuda": ["Sangue di Giuda"],
  "riesling": ["Riesling DOC"],
  "metodo classico": ["Metodo Classico DOCG", "Cruasé DOCG"],
  "spumante": ["Metodo Classico DOCG", "Cruasé DOCG"],
  "moscato": ["Moscato DOC"],
  "barbera": ["Barbera DOC"],
  "cortese": ["Cortese DOC"],
  "chardonnay": ["Chardonnay DOC"],
};

const CERT_KEYWORDS: Record<string, string> = {
  "bio": "Bio EU",
  "biologico": "Bio EU",
  "organic": "Bio EU",
  "vegan": "Vegan",
  "brc": "BRC",
  "ifs": "IFS",
  "iso": "ISO 22000",
  "iso 22000": "ISO 22000",
};

const TYPE_KEYWORDS: Record<string, string> = {
  "rosso": "Rosso",
  "red": "Rosso",
  "bianco": "Bianco",
  "white": "Bianco",
  "rosato": "Rosato",
  "rose": "Rosato",
  "rosé": "Rosato",
  "spumante": "Spumante",
  "sparkling": "Spumante",
  "dolce": "Dolce",
  "sweet": "Dolce",
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function matchWineries(query: BuyerQuery, wineries: Winery[]): WineryMatch[] {
  const desc = normalize(query.description);
  const reasons: Map<string, string[]> = new Map();
  const scores: Map<string, number> = new Map();

  for (const w of wineries) {
    let score = 0;
    const r: string[] = [];

    // Export readiness (base)
    if (w.exportReady) {
      score += 15;
      r.push("Export-ready con struttura export attiva");
    } else {
      score += 3;
      r.push("Non ancora export-ready ma con potenziale");
    }

    // Denomination match
    for (const [keyword, denoms] of Object.entries(DENOM_KEYWORDS)) {
      if (desc.includes(keyword) || (query.denominazione && normalize(query.denominazione).includes(keyword))) {
        if (denoms.some((d) => w.denominazioni.some((wd) => wd.includes(d)))) {
          score += 25;
          r.push(`Produce ${denoms.filter((d) => w.denominazioni.some((wd) => wd.includes(d))).join(", ")}`);
        }
      }
    }

    // Wine type match
    for (const [keyword, type] of Object.entries(TYPE_KEYWORDS)) {
      if (desc.includes(keyword) || (query.tipoVino && normalize(query.tipoVino).includes(keyword))) {
        if (w.tipologie.includes(type)) {
          score += 15;
          r.push(`Tipologia ${type} in produzione`);
        }
      }
    }

    // Country/market match
    for (const [keyword, countries] of Object.entries(COUNTRY_REGION_MAP)) {
      if (desc.includes(keyword) || (query.paese && normalize(query.paese).includes(keyword))) {
        if (w.paesiServiti.some((p) => countries.includes(p))) {
          score += 20;
          r.push(`Già esporta in ${countries.filter((c) => w.paesiServiti.includes(c)).join(", ")}`);
        } else if (w.esporta) {
          score += 8;
          r.push("Ha esperienza export, mercato nuovo da sviluppare");
        }
      }
    }

    // Certification match
    for (const [keyword, cert] of Object.entries(CERT_KEYWORDS)) {
      if (desc.includes(keyword) || (query.certificazione && normalize(query.certificazione).includes(keyword))) {
        if (w.certificazioni.includes(cert)) {
          score += 15;
          r.push(`Certificazione ${cert} presente`);
        }
      }
    }

    // Volume/capacity match
    const volumeNum = query.volume || (desc.match(/(\d+)\s*(bottiglie|bottle|bt|cas|casse)?/)?.[1] ? parseInt(desc.match(/(\d+)\s*(bottiglie|bottle|bt|cas|casse)?/)?.[1] || "0") : 0);
    if (volumeNum > 0) {
      const capacityBottles = w.capacitaProduttiva * 133; // 1 hl ≈ 133 bottles
      if (capacityBottles >= volumeNum) {
        score += 15;
        r.push(`Capacità produttiva adeguata (${w.capacitaProduttiva.toLocaleString()} hl/anno)`);
      } else {
        score -= 5;
        r.push(`Capacità produttiva limitata per il volume richiesto`);
      }
    }

    // Budget/price match
    const budgetNum = query.budget || (desc.match(/(\d+(?:[.,]\d+)?)\s*€|euro|eur/i)?.[1] ? parseFloat(desc.match(/(\d+(?:[.,]\d+)?)\s*€|euro|eur/i)?.[1]?.replace(",", ".") || "0") : 0);
    if (budgetNum > 0) {
      if (w.prezzoFOB <= budgetNum) {
        score += 10;
        r.push(`Prezzo FOB €${w.prezzoFOB.toFixed(2)}/bt entro budget`);
      } else {
        score -= 5;
        r.push(`Prezzo FOB €${w.prezzoFOB.toFixed(2)}/bt sopra budget`);
      }
    }

    // Incoterm match
    if (query.incoterm || desc.match(/\b(exw|fob|cif|ddp|dap)\b/i)) {
      const incoterm = query.incoterm || desc.match(/\b(exw|fob|cif|ddp|dap)\b/i)?.[1].toUpperCase();
      if (incoterm && w.incoterms.includes(incoterm)) {
        score += 10;
        r.push(`Incoterm ${incoterm} disponibile`);
      }
    }

    // Language match (bonus for multilingual teams)
    if (w.lingueTeam.length >= 3) {
      score += 5;
      r.push(`Team commerciale multilingue (${w.lingueTeam.join(", ")})`);
    }

    if (r.length === 0) r.push("Cantina del territorio Oltrepò Pavese");

    reasons.set(w.id, r);
    scores.set(w.id, Math.max(0, Math.min(100, score)));
  }

  return wineries
    .map((w) => ({
      winery: w,
      score: scores.get(w.id) || 0,
      reasons: reasons.get(w.id) || [],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

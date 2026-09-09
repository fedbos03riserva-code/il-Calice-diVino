import type { Wine, PairingResult } from "../types/wine";

// IRC scoring: chimica 0-40, aromatico 0-25, struttura 0-20, pulizia 0-15
// Total: 0-100

const ACIDITY_MATCH: Record<string, string[]> = {
  alta: ["acido", "limone", "pomodoro", "agrumi", "vongole", "cozze", "pesce crudo", "frittura", "insalata", "caprese", "ceviche", "sushi"],
  altissima: ["acido", "limone", "pomodoro", "agrumi", "vongole", "cozze", "pesce crudo", "frittura", "insalata", "caprese", "ceviche", "sushi", "asparagi"],
  media: ["medio", "pollo", "risotto", "pasta", "formaggi freschi", "salumi", "pizza"],
  bassa: ["dolce", "frutta", "dessert", "cioccolato", "formaggi erborinati"],
};

const TANNIN_MATCH: Record<string, string[]> = {
  strutturati: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù"],
  potenti: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù", "cinghiale"],
  titanici: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù", "cinghiale"],
  vellutati: ["agnello", "pollo", "risotto", "pasta al ragù", "formaggi semi-stagionati"],
  medi: ["pollo", "salumi", "pasta", "risotto", "formaggi medi", "pizza", "carne bianca"],
  morbidi: ["pizza", "salumi", "pasta al pomodoro", "formaggi freschi", "carne bianca"],
  fini: ["pesce", "anatra", "funghi", "formaggi semi-stagionati", "salmone", "risotto"],
  leggeri: ["pesce", "insalata", "antipasti", "formaggi freschi", "aperitivo"],
  assenti: ["pesce crudo", "ostriche", "frutti di mare", "insalata", "formaggi freschi", "aperitivo"],
};

const BODY_MATCH: Record<string, string[]> = {
  pieno: ["bistecca", "carne rossa", "agnello", "cacciagione", "brasato", "ragù", "formaggi stagionati", "cinghiale", "aragosta"],
  "medio-pieno": ["agnello", "pollo", "risotto", "pasta al ragù", "formaggi semi-stagionati", "brasato"],
  medio: ["pollo", "risotto", "pasta", "formaggi medi", "salumi", "pizza", "pesce al forno"],
  "leggero-medio": ["pesce", "antipasti", "insalata", "formaggi freschi", "risotto leggero"],
  leggero: ["pesce crudo", "ostriche", "insalata", "aperitivo", "frutti di mare", "antipasti leggeri"],
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function checkDishMatch(dish: string, keywords: string[]): boolean {
  const normalizedDish = normalizeText(dish);
  return keywords.some((kw) => normalizedDish.includes(normalizeText(kw)));
}

function scoreChimica(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);

  // Acidity matching (0-15)
  const acidityKeywords = ACIDITY_MATCH[wine.acidita] || [];
  if (checkDishMatch(dish, acidityKeywords)) score += 15;
  else if (wine.acidita === "alta" || wine.acidita === "altissima") {
    if (dishNorm.includes("pesce") || dishNorm.includes("frittura") || dishNorm.includes("insalata")) score += 12;
    else score += 6;
  } else if (wine.acidita === "media") score += 8;
  else score += 4;

  // Tannin matching (0-15)
  const tanninKeywords = TANNIN_MATCH[wine.tannini] || [];
  if (checkDishMatch(dish, tanninKeywords)) score += 15;
  else if (wine.tannini === "assenti" || wine.tannini === "leggeri") {
    if (dishNorm.includes("pesce") || dishNorm.includes("insalata")) score += 12;
    else score += 6;
  } else if (wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") {
    if (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("agnello")) score += 12;
    else score += 4;
  } else score += 8;

  // Residual sugar (0-10)
  if (wine.residuo_zuccherino > 50) {
    if (dishNorm.includes("dolc") || dishNorm.includes("dessert") || dishNorm.includes("cioccolat") || dishNorm.includes("formaggi erborinati")) score += 10;
    else score += 2;
  } else if (wine.residuo_zuccherino > 10) {
    if (dishNorm.includes("aperitiv") || dishNorm.includes("dolc")) score += 8;
    else score += 5;
  } else {
    score += 7;
  }

  return Math.min(score, 40);
}

function scoreAromatico(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);

  // Check if wine's aromatic profile complements the dish
  const profile = wine.profilo_aromatico.map(normalizeText);

  // Herbaceous dishes pair with herbaceous wines
  if (dishNorm.includes("erbe") || dishNorm.includes("insalata") || dishNorm.includes("pesto") || dishNorm.includes("verdur")) {
    if (profile.some((p) => p.includes("erbe") || p.includes("vegetale") || p.includes("fresco"))) score += 12;
  }

  // Fruity dishes pair with fruity wines
  if (dishNorm.includes("frutta") || dishNorm.includes("dolc")) {
    if (profile.some((p) => p.includes("frutta") || p.includes("mela") || p.includes("ciliegia") || p.includes("fragola"))) score += 12;
  }

  // Spicy dishes pair with aromatic/spicy wines
  if (dishNorm.includes("speziat") || dishNorm.includes("piccant") || dishNorm.includes("curry") || dishNorm.includes("spezie")) {
    if (profile.some((p) => p.includes("spezie") || p.includes("pepe") || p.includes("oriental"))) score += 12;
  }

  // Earthy/savory dishes pair with earthy wines
  if (dishNorm.includes("funghi") || dishNorm.includes("tartufo") || dishNorm.includes("selvaggina") || dishNorm.includes("cacciagon")) {
    if (profile.some((p) => p.includes("terra") || p.includes("sottobosco") || p.includes("tartufo") || p.includes("funghi"))) score += 12;
  }

  // Seafood pairs with mineral/citrus wines
  if (dishNorm.includes("pesce") || dishNorm.includes("mare") || dishNorm.includes("ostriche") || dishNorm.includes("crostace")) {
    if (profile.some((p) => p.includes("agrumi") || p.includes("mineral") || p.includes("salin") || p.includes("marin"))) score += 12;
  }

  // Check abbina_bene_con list for explicit dish matches
  if (wine.abbina_bene_con.some((food) => dishNorm.includes(normalizeText(food)))) score += 13;

  // Base aromatic score
  if (score === 0) score = 8;

  return Math.min(score, 25);
}

function scoreStruttura(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);

  // Body matching
  const bodyKeywords = BODY_MATCH[wine.corpo] || [];
  if (checkDishMatch(dish, bodyKeywords)) score += 12;
  else {
    if (wine.corpo === "pieno" && (dishNorm.includes("carne") || dishNorm.includes("brasato") || dishNorm.includes("ragù"))) score += 10;
    else if (wine.corpo === "leggero" && (dishNorm.includes("pesce") || dishNorm.includes("insalata"))) score += 10;
    else score += 6;
  }

  // Alcohol level matching (0-8)
  if (wine.alcol >= 14.5) {
    if (dishNorm.includes("bistecca") || dishNorm.includes("carne rossa") || dishNorm.includes("selvaggina")) score += 8;
    else if (dishNorm.includes("pesce") || dishNorm.includes("insalata")) score += 2;
    else score += 5;
  } else if (wine.alcol >= 13.5) {
    score += 6;
  } else if (wine.alcol >= 12) {
    if (dishNorm.includes("pesce") || dishNorm.includes("aperitivo")) score += 7;
    else score += 5;
  } else {
    if (dishNorm.includes("aperitivo") || dishNorm.includes("pesce crudo")) score += 8;
    else score += 4;
  }

  return Math.min(score, 20);
}

function scorePulizia(wine: Wine, dish: string): number {
  let score = 8; // Base score
  const dishNorm = normalizeText(dish);

  // Check non_abbina_con — penalize mismatches
  if (wine.non_abbina_con.some((food) => dishNorm.includes(normalizeText(food)))) {
    return 2;
  }

  // High acidity cleanses palate from fat/fried
  if ((wine.acidita === "alta" || wine.acidita === "altissima") &&
      (dishNorm.includes("fritt") || dishNorm.includes("gras") || dishNorm.includes("formaggi"))) {
    score += 7;
  }

  // Bubbles cleanse palate
  if (wine.tipo === "Spumante" && (dishNorm.includes("fritt") || dishNorm.includes("gras"))) {
    score += 7;
  }

  // Tannins cleanse palate from protein/fat
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("formaggi stagionati"))) {
    score += 5;
  }

  return Math.min(score, 15);
}

function generateMeccanismoChimico(wine: Wine, dish: string): string {
  const parts: string[] = [];
  const dishNorm = normalizeText(dish);

  if ((wine.acidita === "alta" || wine.acidita === "altissima") &&
      (dishNorm.includes("gras") || dishNorm.includes("fritt") || dishNorm.includes("formaggi"))) {
    parts.push("L'acidità elevata del vino taglia il grasso del piatto, pulendo il palato tra un boccone e l'altro.");
  }
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("agnello"))) {
    parts.push("I tannini si legano alle proteine della carne, ammorbidendo la sensazione astringente e intensificando il sapore.");
  }
  if (wine.residuo_zuccherino > 50 && (dishNorm.includes("dolc") || dishNorm.includes("dessert"))) {
    parts.push("Il residuo zuccherino bilancia la dolcezza del dessert, creando un'armonia di zuccheri.");
  }
  if (wine.tipo === "Spumante" && (dishNorm.includes("fritt") || dishNorm.includes("gras"))) {
    parts.push("Le bollicine (anidride carbonica) puliscono il palato dall'unto della frittura, rinfrescando la bocca.");
  }
  if (wine.corpo === "pieno" && (dishNorm.includes("brasato") || dishNorm.includes("ragù") || dishNorm.includes("bistecca"))) {
    parts.push("La struttura piena del vino regge l'intensità del piatto senza essere sopraffatto.");
  }
  if (wine.corpo === "leggero" && (dishNorm.includes("pesce") || dishNorm.includes("insalata"))) {
    parts.push("La leggerezza del vino non copre la delicatezza del piatto, mantenendone intatte le sfumature.");
  }

  if (parts.length === 0) {
    parts.push("L'equilibrio tra acidità, struttura e profilo aromatico crea un'armonia gustativa con il piatto.");
  }

  return parts.join(" ");
}

function generateSensazioneInBocca(wine: Wine): string {
  const parts: string[] = [];
  parts.push(`Alcol ${wine.alcol}% conferisce ${wine.alcol >= 14 ? "calore e struttura" : "freschezza e leggerezza"}.`);
  parts.push(`Acidità ${wine.acidita}, tannini ${wine.tannini}.`);
  parts.push(`Corpo ${wine.corpo} con ${wine.residuo_zuccherino > 50 ? "dolcezza residua marcata" : wine.residuo_zuccherino > 10 ? "leggera dolcezza" : "secco e pulito"}.`);
  return parts.join(" ");
}

function generateConsigliCulinari(wine: Wine, dish: string): string {
  const pairings = wine.abbina_bene_con.slice(0, 4).join(", ");
  const notPairings = wine.non_abbina_con.slice(0, 2).join(", ");
  return `Oltre a "${dish}", questo vino eccelle con: ${pairings}. Evita invece: ${notPairings}.`;
}

function generateMotivo(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  if (wine.abbina_bene_con.some((f) => dishNorm.includes(normalizeText(f)))) {
    return `Abbinamento classico: il vino è esplicitamente indicato per "${dish}".`;
  }
  return `Abbinamento per complementarità chimico-aromatica: le caratteristiche del vino si armonizzano con il piatto.`;
}

export function pairWineWithDish(wine: Wine, dish: string): PairingResult {
  const chimica = scoreChimica(wine, dish);
  const aromatico = scoreAromatico(wine, dish);
  const struttura = scoreStruttura(wine, dish);
  const pulizia = scorePulizia(wine, dish);
  const totale = chimica + aromatico + struttura + pulizia;

  return {
    wine,
    score: { chimica, aromatico, struttura, pulizia, totale },
    meccanismo_chimico: generateMeccanismoChimico(wine, dish),
    sensazione_in_bocca: generateSensazioneInBocca(wine),
    consigli_culinari: generateConsigliCulinari(wine, dish),
    motivo_abbinamento: generateMotivo(wine, dish),
  };
}

export function pairDishWithCatalog(
  catalog: Wine[],
  dish: string,
  filters?: { tipo?: string; fascia?: string; maxPrice?: number }
): PairingResult[] {
  let wines = [...catalog];

  if (filters?.tipo && filters.tipo !== "all") {
    wines = wines.filter((w) => w.tipo === filters.tipo);
  }
  if (filters?.fascia && filters.fascia !== "all") {
    wines = wines.filter((w) => w.fascia === filters.fascia);
  }
  if (filters?.maxPrice !== undefined) {
    wines = wines.filter((w) => w.prezzo <= filters.maxPrice!);
  }

  const results = wines.map((w) => pairWineWithDish(w, dish));
  results.sort((a, b) => b.score.totale - a.score.totale);
  return results.slice(0, 12);
}

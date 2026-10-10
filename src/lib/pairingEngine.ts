import type { Wine, PairingResult, UserRole } from "../types/wine";

// IRC scoring: chimica 0-40, aromatico 0-25, struttura 0-20, pulizia 0-15
// Total: 0-100

// Expanded dish-to-wine matching with weighted keyword categories
const ACIDITY_MATCH: Record<string, { strong: string[]; medium: string[]; weak: string[] }> = {
  alta: {
    strong: ["acido", "limone", "pomodoro", "agrumi", "vongole", "cozze", "pesce crudo", "frittura", "insalata", "caprese", "ceviche", "sushi", "asparagi", "ostriche", "carpaccio", "tartare"],
    medium: ["risotto", "pasta", "pollo", "formaggi freschi", "salumi", "pizza", "antipasti"],
    weak: ["bistecca", "brasato", "ragù", "cacciagione", "formaggi stagionati", "cioccolato", "dessert"],
  },
  altissima: {
    strong: ["acido", "limone", "pomodoro", "agrumi", "vongole", "cozze", "pesce crudo", "frittura", "insalata", "caprese", "ceviche", "sushi", "asparagi", "ostriche", "carpaccio", "tartare", "crudo"],
    medium: ["risotto", "pasta", "pollo", "formaggi freschi", "salumi", "pizza", "antipasti", "brodetto"],
    weak: ["bistecca", "brasato", "ragù", "cacciagione", "formaggi stagionati", "cioccolato", "dessert", "agnello"],
  },
  media: {
    strong: ["pollo", "risotto", "pasta", "formaggi freschi", "salumi", "pizza", "carne bianca", "vitello", "maiale", "coniglio"],
    medium: ["pesce al forno", "salmone", "tonno", "funghi", "tartufo", "legumi"],
    weak: ["pesce crudo", "ostriche", "ceviche", "cioccolato", "dessert"],
  },
  bassa: {
    strong: ["dolce", "frutta", "dessert", "cioccolato", "formaggi erborinati", "torta", "crostata", "panna cotta", "zabaione"],
    medium: ["formaggi stagionati", "parmigiano", "pecorino"],
    weak: ["pesce crudo", "ostriche", "insalata", "frittura", "ceviche", "sushi", "acido", "limone"],
  },
};

const TANNIN_MATCH: Record<string, { strong: string[]; medium: string[]; weak: string[] }> = {
  strutturati: {
    strong: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù", "cinghiale", "manzo", "filetto", "tagliata"],
    medium: ["pasta al ragù", "lasagna", "pizza", "salumi", "formaggi medi"],
    weak: ["pesce", "insalata", "ostriche", "pesce crudo", "dessert", "cioccolato bianco"],
  },
  potenti: {
    strong: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù", "cinghiale", "manzo", "filetto", "tagliata", "stracotto"],
    medium: ["pasta al ragù", "lasagna", "pizza", "salumi"],
    weak: ["pesce", "insalata", "ostriche", "pesce crudo", "dessert", "aperitivo"],
  },
  titanici: {
    strong: ["bistecca", "carne rossa", "agnello", "cacciagione", "selvaggina", "brasato", "formaggi stagionati", "ragù", "cinghiale", "manzo", "filetto", "tagliata", "stracotto", "guancia"],
    medium: ["pasta al ragù", "lasagna", "polenta", "stufato"],
    weak: ["pesce", "insalata", "ostriche", "pesce crudo", "dessert", "aperitivo", "antipasti leggeri"],
  },
  vellutati: {
    strong: ["agnello", "pollo", "risotto", "pasta al ragù", "formaggi semi-stagionati", "vitello", "coniglio", "maiale", "anatra"],
    medium: ["lasagna", "pizza", "salumi", "funghi", "tartufo"],
    weak: ["pesce crudo", "ostriche", "ceviche", "sushi"],
  },
  medi: {
    strong: ["pollo", "salumi", "pasta", "risotto", "formaggi medi", "pizza", "carne bianca", "vitello", "maiale"],
    medium: ["funghi", "tartufo", "legumi", "minestra", "zuppa"],
    weak: ["pesce crudo", "ostriche", "bistecca", "cacciagione"],
  },
  morbidi: {
    strong: ["pizza", "salumi", "pasta al pomodoro", "formaggi freschi", "carne bianca", "pollo", "focaccia"],
    medium: ["risotto", "legumi", "verdure"],
    weak: ["bistecca", "cacciagione", "selvaggina", "pesce crudo"],
  },
  fini: {
    strong: ["pesce", "anatra", "funghi", "formaggi semi-stagionati", "salmone", "risotto", "tonno", "trota"],
    medium: ["pollo", "vitello", "legumi"],
    weak: ["bistecca", "cacciagione", "ragù", "brasato"],
  },
  leggeri: {
    strong: ["pesce", "insalata", "antipasti", "formaggi freschi", "aperitivo", "frutti di mare", "crudo"],
    medium: ["risotto leggero", "verdure", "legumi"],
    weak: ["bistecca", "brasato", "ragù", "formaggi stagionati", "cacciagione"],
  },
  assenti: {
    strong: ["pesce crudo", "ostriche", "frutti di mare", "insalata", "formaggi freschi", "aperitivo", "ceviche", "sushi", "carpaccio di pesce"],
    medium: ["pesce al vapore", "risotto leggero", "verdure", "antipasti leggeri"],
    weak: ["bistecca", "brasato", "ragù", "cacciagione", "formaggi stagionati", "carne rossa"],
  },
};

const BODY_MATCH: Record<string, { strong: string[]; medium: string[]; weak: string[] }> = {
  pieno: {
    strong: ["bistecca", "carne rossa", "agnello", "cacciagione", "brasato", "ragù", "formaggi stagionati", "cinghiale", "aragosta", "stracotto", "guancia", "manzo"],
    medium: ["pasta al ragù", "lasagna", "polenta", "funghi"],
    weak: ["pesce crudo", "insalata", "aperitivo", "antipasti leggeri", "ostriche"],
  },
  "medio-pieno": {
    strong: ["agnello", "pollo", "risotto", "pasta al ragù", "formaggi semi-stagionati", "brasato", "anatra", "salmone", "tonno"],
    medium: ["lasagna", "pizza", "funghi", "tartufo", "salumi"],
    weak: ["pesce crudo", "ostriche", "ceviche", "insalata"],
  },
  medio: {
    strong: ["pollo", "risotto", "pasta", "formaggi medi", "salumi", "pizza", "pesce al forno", "vitello", "maiale", "coniglio"],
    medium: ["funghi", "legumi", "minestra", "verdure"],
    weak: ["bistecca", "cacciagione", "selvaggina", "pesce crudo", "ostriche"],
  },
  "leggero-medio": {
    strong: ["pesce", "antipasti", "insalata", "formaggi freschi", "risotto leggero", "verdure", "legumi"],
    medium: ["pollo", "salumi", "pizza"],
    weak: ["bistecca", "brasato", "ragù", "cacciagione", "formaggi stagionati"],
  },
  leggero: {
    strong: ["pesce crudo", "ostriche", "insalata", "aperitivo", "frutti di mare", "antipasti leggeri", "ceviche", "sushi", "carpaccio"],
    medium: ["pesce al vapore", "risotto leggero", "verdure"],
    weak: ["bistecca", "brasato", "ragù", "formaggi stagionati", "cacciagione", "agnello"],
  },
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function scoreCategory(dish: string, match: { strong: string[]; medium: string[]; weak: string[] } | undefined, maxScore: number): number {
  if (!match) return Math.round(maxScore * 0.4);
  const dishNorm = normalizeText(dish);
  const strongHit = match.strong.some((kw) => dishNorm.includes(normalizeText(kw)));
  const mediumHit = match.medium.some((kw) => dishNorm.includes(normalizeText(kw)));
  const weakHit = match.weak.some((kw) => dishNorm.includes(normalizeText(kw)));
  if (strongHit) return maxScore;
  if (mediumHit) return Math.round(maxScore * 0.7);
  if (weakHit) return Math.round(maxScore * 0.2);
  return Math.round(maxScore * 0.45);
}

function scoreChimica(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);

  // Acidity matching (0-15)
  score += scoreCategory(dish, ACIDITY_MATCH[wine.acidita], 15);

  // Tannin matching (0-15)
  score += scoreCategory(dish, TANNIN_MATCH[wine.tannini], 15);

  // Residual sugar (0-10)
  if (wine.residuo_zuccherino > 50) {
    if (dishNorm.includes("dolc") || dishNorm.includes("dessert") || dishNorm.includes("cioccolat") || dishNorm.includes("formaggi erborinati") || dishNorm.includes("torta") || dishNorm.includes("crostata")) score += 10;
    else if (dishNorm.includes("piccant") || dishNorm.includes("speziat") || dishNorm.includes("curry")) score += 7;
    else score += 2;
  } else if (wine.residuo_zuccherino > 10) {
    if (dishNorm.includes("aperitiv") || dishNorm.includes("dolc") || dishNorm.includes("sushi") || dishNorm.includes("piccant")) score += 8;
    else score += 5;
  } else {
    // Dry wines: check for sugar-driven penalties
    if (dishNorm.includes("dolc") && !dishNorm.includes("dolce e") && !dishNorm.includes("agrodolc")) score += 1;
    else score += 7;
  }

  return Math.min(score, 40);
}

function scoreAromatico(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);
  const profile = wine.profilo_aromatico.map(normalizeText);

  // Herbaceous dishes pair with herbaceous wines
  if (dishNorm.includes("erbe") || dishNorm.includes("insalata") || dishNorm.includes("pesto") || dishNorm.includes("verdur") || dishNorm.includes("basilic")) {
    if (profile.some((p) => p.includes("erbe") || p.includes("vegetale") || p.includes("fresco") || p.includes("salvia") || p.includes("timo"))) score += 12;
  }

  // Fruity dishes pair with fruity wines
  if (dishNorm.includes("frutta") || dishNorm.includes("dolc")) {
    if (profile.some((p) => p.includes("frutta") || p.includes("mela") || p.includes("ciliegia") || p.includes("fragola") || p.includes("pera") || p.includes("pesca"))) score += 12;
  }

  // Spicy dishes pair with aromatic/spicy wines
  if (dishNorm.includes("speziat") || dishNorm.includes("piccant") || dishNorm.includes("curry") || dishNorm.includes("spezie") || dishNorm.includes("pepe")) {
    if (profile.some((p) => p.includes("spezie") || p.includes("pepe") || p.includes("oriental") || p.includes("chiodi"))) score += 12;
  }

  // Earthy/savory dishes pair with earthy wines
  if (dishNorm.includes("funghi") || dishNorm.includes("tartufo") || dishNorm.includes("selvaggina") || dishNorm.includes("cacciagon") || dishNorm.includes("bosco")) {
    if (profile.some((p) => p.includes("terra") || p.includes("sottobosco") || p.includes("tartufo") || p.includes("funghi") || p.includes("cuoio"))) score += 12;
  }

  // Seafood pairs with mineral/citrus wines
  if (dishNorm.includes("pesce") || dishNorm.includes("mare") || dishNorm.includes("ostriche") || dishNorm.includes("crostace") || dishNorm.includes("vongole") || dishNorm.includes("cozze") || dishNorm.includes("frutti di mare")) {
    if (profile.some((p) => p.includes("agrumi") || p.includes("mineral") || p.includes("salin") || p.includes("marin") || p.includes("iodio"))) score += 12;
  }

  // Smoky/grilled dishes pair with oaky wines
  if (dishNorm.includes("grigli") || dishNorm.includes("arrosto") || dishNorm.includes("bbq") || dishNorm.includes("carbonc") || dishNorm.includes("affumicat")) {
    if (profile.some((p) => p.includes("legno") || p.includes("vanigl") || p.includes("torba") || p.includes("affumic") || p.includes("toasted"))) score += 12;
  }

  // Floral wines with delicate dishes
  if (dishNorm.includes("risotto") || dishNorm.includes("asparagi") || dishNorm.includes("fiori")) {
    if (profile.some((p) => p.includes("fiore") || p.includes("rosa") || p.includes("gelsomino") || p.includes("viola"))) score += 10;
  }

  // Check abbina_bene_con list for explicit dish matches
  if (wine.abbina_bene_con.some((food) => dishNorm.includes(normalizeText(food)))) score += 13;

  // Base aromatic score
  if (score === 0) score = 7;

  return Math.min(score, 25);
}

function scoreStruttura(wine: Wine, dish: string): number {
  let score = 0;
  const dishNorm = normalizeText(dish);

  // Body matching (0-12)
  score += scoreCategory(dish, BODY_MATCH[wine.corpo], 12);

  // Alcohol level matching (0-8)
  if (wine.alcol >= 14.5) {
    if (dishNorm.includes("bistecca") || dishNorm.includes("carne rossa") || dishNorm.includes("selvaggina") || dishNorm.includes("brasato") || dishNorm.includes("cacciagione")) score += 8;
    else if (dishNorm.includes("pesce") || dishNorm.includes("insalata") || dishNorm.includes("ostriche") || dishNorm.includes("aperitivo")) score += 1;
    else score += 4;
  } else if (wine.alcol >= 13.5) {
    if (dishNorm.includes("bistecca") || dishNorm.includes("agnello") || dishNorm.includes("brasato") || dishNorm.includes("formaggi")) score += 6;
    else if (dishNorm.includes("pesce") || dishNorm.includes("insalata")) score += 5;
    else score += 6;
  } else if (wine.alcol >= 12) {
    if (dishNorm.includes("pesce") || dishNorm.includes("aperitivo") || dishNorm.includes("insalata") || dishNorm.includes("antipasti")) score += 7;
    else if (dishNorm.includes("bistecca") || dishNorm.includes("cacciagione")) score += 3;
    else score += 6;
  } else {
    if (dishNorm.includes("aperitivo") || dishNorm.includes("pesce crudo") || dishNorm.includes("ostriche") || dishNorm.includes("insalata")) score += 8;
    else if (dishNorm.includes("bistecca") || dishNorm.includes("brasato")) score += 2;
    else score += 5;
  }

  return Math.min(score, 20);
}

function scorePulizia(wine: Wine, dish: string): number {
  let score = 8;
  const dishNorm = normalizeText(dish);

  // Check non_abbina_con — penalize mismatches
  if (wine.non_abbina_con.some((food) => dishNorm.includes(normalizeText(food)))) {
    return 2;
  }

  // High acidity cleanses palate from fat/fried
  if ((wine.acidita === "alta" || wine.acidita === "altissima") &&
      (dishNorm.includes("fritt") || dishNorm.includes("gras") || dishNorm.includes("formaggi") || dishNorm.includes("salumi") || dishNorm.includes("carbonara"))) {
    score += 7;
  }

  // Bubbles cleanse palate
  if (wine.tipo === "Spumante" && (dishNorm.includes("fritt") || dishNorm.includes("gras") || dishNorm.includes("sushi") || dishNorm.includes("tempura"))) {
    score += 7;
  }

  // Tannins cleanse palate from protein/fat
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("formaggi stagionati") || dishNorm.includes("agnello"))) {
    score += 5;
  }

  // Low tannin + delicate food = clean match
  if ((wine.tannini === "assenti" || wine.tannini === "leggeri") &&
      (dishNorm.includes("pesce crudo") || dishNorm.includes("ostriche") || dishNorm.includes("ceviche") || dishNorm.includes("insalata"))) {
    score += 5;
  }

  return Math.min(score, 15);
}

function generateMeccanismoChimico(wine: Wine, dish: string): string {
  const parts: string[] = [];
  const dishNorm = normalizeText(dish);

  if ((wine.acidita === "alta" || wine.acidita === "altissima") &&
      (dishNorm.includes("gras") || dishNorm.includes("fritt") || dishNorm.includes("formaggi"))) {
    parts.push("L'acidita del vino sgrassa il palato, bilanciando la componente lipidica del piatto.");
  }
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("agnello"))) {
    parts.push("I tannini si legano alle proteine della carne, ammorbidendo l'astringenza.");
  }
  if (wine.residuo_zuccherino > 50 && (dishNorm.includes("dolc") || dishNorm.includes("dessert"))) {
    parts.push("Il residuo zuccherino bilancia la dolcezza del dessert.");
  }
  if (wine.tipo === "Spumante" && (dishNorm.includes("fritt") || dishNorm.includes("gras"))) {
    parts.push("Le bollicine puliscono il palato dalla componente untuosa.");
  }
  if (wine.corpo === "pieno" && (dishNorm.includes("brasato") || dishNorm.includes("bistecca"))) {
    parts.push("La struttura del vino regge l'intensita del piatto.");
  }
  if (wine.corpo === "leggero" && (dishNorm.includes("pesce") || dishNorm.includes("insalata"))) {
    parts.push("La leggerezza del vino non copre la delicatezza del piatto.");
  }
  if ((dishNorm.includes("piccant") || dishNorm.includes("speziat")) && wine.residuo_zuccherino > 5) {
    parts.push("Il residuo zuccherino attenua la piccantezza.");
  }
  if ((dishNorm.includes("funghi") || dishNorm.includes("tartufo")) && wine.profilo_aromatico.some((p) => p.toLowerCase().includes("terra") || p.toLowerCase().includes("sottobosco"))) {
    parts.push("Le note terrose del vino si fondono con i sentori dei funghi.");
  }

  if (parts.length === 0) {
    parts.push("L'equilibrio tra acidita, struttura e aromaticita crea armonia con il piatto.");
  }

  return parts.join(" ");
}

function generateSensazioneInBocca(wine: Wine): string {
  const parts: string[] = [];
  const alcolDesc = wine.alcol >= 14.5 ? "calore alcolico marcato" : wine.alcol >= 13 ? "corpo equilibrato" : wine.alcol >= 12 ? "freschezza e leggerezza" : "leggerezza e bevibilita";
  parts.push(`Alcol ${wine.alcol}%: ${alcolDesc}.`);
  const acidDesc = wine.acidita === "alta" || wine.acidita === "altissima" ? "acidita vivace che stimola salivazione" : wine.acidita === "media" ? "acidita equilibrata" : "acidita bassa, morbidezza gustativa";
  parts.push(`${acidDesc}, tannini ${wine.tannini}.`);
  const zuccheriDesc = wine.residuo_zuccherino > 50 ? "dolcezza residua" : wine.residuo_zuccherino > 10 ? "leggera dolcezza" : "secco e pulito";
  parts.push(`Corpo ${wine.corpo}, ${zuccheriDesc}.`);
  return parts.join(" ");
}

function generateConsigliCulinari(wine: Wine, dish: string, role?: UserRole): string {
  const dishNorm = normalizeText(dish);
  const pairings = wine.abbina_bene_con.slice(0, 4).join(", ");
  const notPairings = wine.non_abbina_con.slice(0, 2).join(", ");

  if (role === "ristoratore") {
    const margin = wine.fascia === "economico" ? 55 : wine.fascia === "standard" ? 45 : wine.fascia === "premium" ? 35 : 28;
    const serviceTemp = wine.tipo === "Spumante" ? "6-8 C" : wine.tipo === "Bianco" ? "10-12 C" : wine.tipo === "Rosso" ? "16-18 C" : "12-14 C";
    const positioning = wine.fascia === "lusso" ? "cru / riserva" : wine.fascia === "premium" ? "secondo calice" : "calice d'ingresso";
    return `Servizio a ${serviceTemp}. Abbinamenti consigliati in carta: ${pairings}. Da evitare: ${notPairings}. Margine target: ${margin}%. Posizionamento: ${positioning}.`;
  }

  // For private users: give practical, correct advice
  const tips: string[] = [];
  tips.push(`Oltre a "${dish}", prova con: ${pairings}.`);

  // Add specific advice based on wine characteristics
  if (wine.tipo === "Spumante") {
    tips.push("Ottimo anche come aperitivo o con antipasti di pesce.");
  }
  if (wine.residuo_zuccherino > 50) {
    tips.push("Serve con dolci non troppo zuccherini per non saturare il palato.");
  }
  if (wine.tannini === "potenti" || wine.tannini === "titanici") {
    tips.push(`Decanta 30-60 min prima del servizio per ammorbidire i tannini.`);
  }
  if (wine.acidita === "alta" && !dishNorm.includes("pesce")) {
    tips.push("L'acidita vivace lo rende versatile anche con piatti grassi o fritti.");
  }

  tips.push(`Evita: ${notPairings}.`);
  return tips.join(" ");
}

function generateMotivo(wine: Wine, dish: string, role?: UserRole): string {
  const dishNorm = normalizeText(dish);
  if (role === "ristoratore") {
    if (wine.abbina_bene_con.some((f) => dishNorm.includes(normalizeText(f)))) {
      return `Abbinamento confermato dal produttore. Inseribile in carta senza rischi.`;
    }
    return `Abbinamento per complementarita chimico-aromatica. Consigliato per menu degustazione.`;
  }
  if (wine.abbina_bene_con.some((f) => dishNorm.includes(normalizeText(f)))) {
    return `Abbinamento classico: il vino e esplicitamente indicato per questo tipo di piatto.`;
  }
  return `Abbinamento per complementarita: le caratteristiche del vino si armonizzano con il piatto.`;
}

function generatePercheDelVino(wine: Wine, _dish: string): string {
  const parts: string[] = [];

  if (wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") {
    parts.push(`I tannini si legano alle proteine della carne, ammorbidendo le fibre e riducendo l'astringenza.`);
  } else if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acidita sgrassa il palato e mantiene la freschezza tra un boccone e l'altro.`);
  } else {
    parts.push(`L'equilibrio tra acidita e struttura si integra con il piatto.`);
  }

  if (wine.tipo === "Spumante") {
    parts.push(`Le bollicine puliscono il palato e preparano al prossimo boccone.`);
  }

  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  parts.push(`Le note di ${aromatiche} si fondono con quelle del piatto.`);

  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`La struttura (${wine.alcol}% vol) regge l'intensita del piatto.`);
  } else {
    parts.push(`La leggerezza (${wine.alcol}% vol) non copre le sfumature del piatto.`);
  }

  return parts.join(" ");
}

function generateChimicaInBocca(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const parts: string[] = [];

  if ((wine.tannini === "strutturati" || wine.tannini === "potenti") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca"))) {
    parts.push(`I tannini si legano alle proteine salivari, riducendo l'astringenza.`);
  } else if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acido tartarico stimola le papille gustative e la salivazione.`);
  } else {
    parts.push(`L'etanolo e la glicerina migliorano il rilascio degli aromi.`);
  }

  if (wine.tipo === "Spumante") {
    parts.push(`L'anidride carbonica pulisce il palato amplificando la freschezza.`);
  }

  return parts.join(" ");
}

function generateMolecole(wine: Wine, dish: string): string[] {
  const dishNorm = normalizeText(dish);
  const molecole: string[] = [];

  if (wine.tipo === "Rosso") {
    molecole.push("procianidine", "catechine", "acido tartarico");
  } else if (wine.tipo === "Bianco") {
    molecole.push("acido tartarico", "acido malico", "linalolo", "glicerina");
  } else if (wine.tipo === "Spumante") {
    molecole.push("anidride carbonica", "acido tartarico", "mannoproteine");
  } else if (wine.tipo === "Rosato") {
    molecole.push("acido tartarico", "antociani", "linalolo");
  } else if (wine.tipo === "Dolce") {
    molecole.push("fruttosio", "glucosio", "acido tartarico");
  }

  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) molecole.push("PRPs salivari");
  if (dishNorm.includes("fritt") || dishNorm.includes("gras")) molecole.push("trigliceridi");
  if (dishNorm.includes("funghi") || dishNorm.includes("tartufo")) molecole.push("geosmina", "1-otten-3-olo");
  if (dishNorm.includes("piccant") || dishNorm.includes("speziat")) molecole.push("capsaicina");
  if (dishNorm.includes("dolc") || dishNorm.includes("dessert")) molecole.push("recettori T1R2/T1R3");

  for (const a of wine.profilo_aromatico.slice(0, 2)) {
    const al = a.toLowerCase();
    if (al.includes("vanigl")) molecole.push("vanillina");
    if (al.includes("legno") || al.includes("botte")) molecole.push("eugenolo", "furfurale");
    if (al.includes("frutta") || al.includes("ciliegia")) molecole.push("etil-butirrato");
    if (al.includes("agrumi")) molecole.push("limonene");
    if (al.includes("rosa") || al.includes("fiore")) molecole.push("geraniolo");
    if (al.includes("pepe") || al.includes("spezie")) molecole.push("guaiacolo");
    if (al.includes("terra") || al.includes("sottobosco")) molecole.push("geosmina");
  }

  return [...new Set(molecole)].slice(0, 8);
}

function generateTemperaturaServizio(wine: Wine): string {
  if (wine.tipo === "Spumante") return "6-8 C";
  if (wine.tipo === "Bianco") return wine.corpo === "pieno" ? "10-12 C" : "8-10 C";
  if (wine.tipo === "Rosso") return wine.corpo === "pieno" ? "16-18 C" : "14-16 C";
  if (wine.tipo === "Rosato") return "10-12 C";
  if (wine.tipo === "Dolce") return "8-10 C";
  return "12-14 C";
}

function generateTempoDecantazione(wine: Wine): string {
  if (wine.tipo !== "Rosso") return "non necessario";
  if (wine.tannini === "titanici" || wine.tannini === "potenti") return "60-90 min";
  if (wine.tannini === "strutturati") return "30-45 min";
  if (wine.tannini === "vellutati" || wine.tannini === "medi") return "15-20 min";
  return "non necessario";
}

function generateReazioneDigestiva(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const parts: string[] = [];

  if (wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") {
    parts.push(`I tannini rallentano moderatamente la digestione proteica.`);
  } else if (wine.tannini === "assenti" || wine.tannini === "leggeri") {
    parts.push(`I tannini ${wine.tannini} non interferiscono con la digestione.`);
  } else {
    parts.push(`I tannini ${wine.tannini} hanno un effetto moderato, compensato dall'acidita.`);
  }

  if (wine.alcol >= 14) {
    parts.push(`L'etanolo al ${wine.alcol}% rallenta lo svuotamento gastrico.`);
  } else if (wine.alcol >= 12) {
    parts.push(`L'etanolo al ${wine.alcol}% rallenta moderatamente lo svuotamento gastrico.`);
  } else {
    parts.push(`La bassa gradazione (${wine.alcol}%) minimizza il rallentamento gastrico.`);
  }

  if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acidita facilita la denaturazione delle proteine.`);
  }

  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) {
    parts.push(`I tannini si legano al ferro eme; l'etanolo migliora l'assorbimento delle vitamine liposolubili.`);
  } else if (dishNorm.includes("pesce")) {
    parts.push(`L'etanolo migliora l'assorbimento degli omega-3 del pesce.`);
  }

  return parts.join(" ");
}

function generateDiscorsoSommelier(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  const parts: string[] = [];

  parts.push(`${wine.nome} (${wine.regione}) con ${dish}.`);

  if ((wine.tannini === "strutturati" || wine.tannini === "potenti") && (dishNorm.includes("carne") || dishNorm.includes("bistecca"))) {
    parts.push(`I tannini si legano alle proteine della carne, ammorbidendo le fibre.`);
  } else if ((wine.acidita === "alta" || wine.acidita === "altissima") && (dishNorm.includes("gras") || dishNorm.includes("fritt"))) {
    parts.push(`L'acidita sgrassa il palato e mantiene la freschezza.`);
  } else {
    parts.push(`L'equilibrio tra acidita e struttura si integra con il piatto.`);
  }

  parts.push(`Note di ${aromatiche}.`);

  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`La struttura regge l'intensita del piatto.`);
  } else {
    parts.push(`La leggerezza non copre le sfumature del piatto.`);
  }

  return parts.join(" ");
}

function generateDiscorsoAppassionato(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  const parts: string[] = [];

  parts.push(`${wine.nome} con ${dish}: un incontro perfetto.`);

  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) {
    parts.push(`I tannini accarezzano le fibre della carne, ammorbidendole.`);
  } else if (dishNorm.includes("pesce")) {
    parts.push(`La freschezza del vino rinfresca il palato dopo ogni boccone di pesce.`);
  } else if (dishNorm.includes("formaggi")) {
    parts.push(`L'acidita del vino scioglie il grasso del formaggio, rendendolo piu rotondo.`);
  } else if (dishNorm.includes("dolc") || dishNorm.includes("dessert")) {
    parts.push(`Le due dolcezze si riconoscono senza sovrastarsi.`);
  } else {
    parts.push(`Vino e piatto si completano a vicenda.`);
  }

  parts.push(`Profuma di ${aromatiche}.`);

  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`Un vino con carattere, da pari a pari con il piatto.`);
  } else {
    parts.push(`Un vino elegante, che fa da cornice al piatto.`);
  }

  return parts.join(" ");
}

export function pairWineWithDish(wine: Wine, dish: string, role?: UserRole): PairingResult {
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
    consigli_culinari: generateConsigliCulinari(wine, dish, role),
    motivo_abbinamento: generateMotivo(wine, dish, role),
    perche_del_vino: generatePercheDelVino(wine, dish),
    discorso_sommelier: generateDiscorsoSommelier(wine, dish),
    discorso_appassionato: generateDiscorsoAppassionato(wine, dish),
    chimica_in_bocca: generateChimicaInBocca(wine, dish),
    molecole_protagoniste: generateMolecole(wine, dish),
    temperatura_servizio: generateTemperaturaServizio(wine),
    tempo_decantazione: generateTempoDecantazione(wine),
    reazione_digestiva: generateReazioneDigestiva(wine, dish),
  };
}

export function pairDishWithCatalog(
  catalog: Wine[],
  dish: string,
  filters?: { tipo?: string; fascia?: string; maxPrice?: number; maxAlcol?: number; corpo?: string; acidita?: string; tannini?: string },
  role?: UserRole
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
  if (filters?.maxAlcol !== undefined) {
    wines = wines.filter((w) => w.alcol <= filters.maxAlcol!);
  }
  if (filters?.corpo && filters.corpo !== "all") {
    wines = wines.filter((w) => w.corpo === filters.corpo);
  }
  if (filters?.acidita && filters.acidita !== "all") {
    wines = wines.filter((w) => w.acidita === filters.acidita);
  }
  if (filters?.tannini && filters.tannini !== "all") {
    wines = wines.filter((w) => w.tannini === filters.tannini);
  }

  const results = wines.map((w) => pairWineWithDish(w, dish, role));
  results.sort((a, b) => b.score.totale - a.score.totale);
  return results.slice(0, 12);
}

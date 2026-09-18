import type { Wine, PairingResult, UserRole } from "../types/wine";

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
    parts.push("L'acidità tartarica e malica del vino (pH 3.0-3.3) disgrega le micelle lipidiche del piatto, solubilizzando i trigliceridi e pulendo il palato tra un boccone e l'altro.");
  }
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("agnello"))) {
    parts.push("Le procianidine e catechine (tannini condensati) si legano alle glicoproteine salivari (PRPs) e alle proteine muscolari denaturate dalla cottura, ammorbidendo l'astringenza e intensificando il sapore della carne.");
  }
  if (wine.residuo_zuccherino > 50 && (dishNorm.includes("dolc") || dishNorm.includes("dessert"))) {
    parts.push("Il residuo zuccherino (saccarosio + fruttosio >50g/L) bilancia la dolcezza del dessert per competizione recettoriale, creando un'armonia di zuccheri senza che il vino risulti aspro.");
  }
  if (wine.tipo === "Spumante" && (dishNorm.includes("fritt") || dishNorm.includes("gras"))) {
    parts.push("L'anidride carbonica disciolta (4-6 bar) rilascia bollicine che puliscono meccanicamente il palato dall'unto della frittura, rinfrescando la bocca via stimolazione tattile dei recettori trigeminali.");
  }
  if (wine.corpo === "pieno" && (dishNorm.includes("brasato") || dishNorm.includes("ragù") || dishNorm.includes("bistecca"))) {
    parts.push("La struttura piena (alcol 13.5%+ e glicerina) regge l'intensità del piatto senza essere sopraffatta; l'etanolo amplifica i composti volatili di Maillard del brasato.");
  }
  if (wine.corpo === "leggero" && (dishNorm.includes("pesce") || dishNorm.includes("insalata"))) {
    parts.push("La leggerezza del vino (alcol 11-12%, corpo leggero) non copre la delicatezza del piatto; l'acidità vivace mantiene intatte le sfumature aromatiche delicate degli ingredienti freschi.");
  }
  if ((dishNorm.includes("piccant") || dishNorm.includes("speziat") || dishNorm.includes("curry")) && wine.residuo_zuccherino > 5) {
    parts.push("Il residuo zuccherino (>5g/L) attenua la percezione di capsaicina competendo con i recettori TRPV1, mentre l'etanolo al 12-13% evita di amplificare eccessivamente la piccantezza.");
  }
  if ((dishNorm.includes("funghi") || dishNorm.includes("tartufo")) && wine.profilo_aromatico.some((p) => p.includes("terra") || p.includes("sottobosco"))) {
    parts.push("I composti terrosi del vino (geosmina, composti azotati) trovano corrispondenza con i composti aromatici dei funghi (1-otten-3-olo, benzaldeide), creando risonanza olfattiva.");
  }

  if (parts.length === 0) {
    parts.push("L'equilibrio tra acidità tartarica, struttura glicerica e profilo aromatico di esteri e alcoli superiori crea un'armonia gustativa con il piatto via complementarità chimico-sensoriale.");
  }

  return parts.join(" ");
}

function generateSensazioneInBocca(wine: Wine): string {
  const parts: string[] = [];
  const alcolDesc = wine.alcol >= 14.5 ? "calore alcolico marcato e struttura glicerica" : wine.alcol >= 13 ? "corpo equilibrato con buona estrazione" : wine.alcol >= 12 ? "freschezza e leggerezza" : "leggerezza e bevibilità";
  parts.push(`Alcol ${wine.alcol}% conferisce ${alcolDesc}.`);
  const acidDesc = wine.acidita === "alta" || wine.acidita === "altissima" ? "acidità vivace (pH 3.0-3.2) che stimola salivazione" : wine.acidita === "media" ? "acidità equilibrata (pH 3.3-3.5)" : "acidità bassa, morbidezza gustativa";
  parts.push(`${acidDesc}, tannini ${wine.tannini}.`);
  const zuccheriDesc = wine.residuo_zuccherino > 50 ? "dolcezza residua marcata" : wine.residuo_zuccherino > 10 ? "leggera dolcezza residua" : "secco e pulito, finale teso";
  parts.push(`Corpo ${wine.corpo} con ${zuccheriDesc}.`);
  return parts.join(" ");
}

function generateConsigliCulinari(wine: Wine, dish: string, role?: UserRole): string {
  const pairings = wine.abbina_bene_con.slice(0, 4).join(", ");
  const notPairings = wine.non_abbina_con.slice(0, 2).join(", ");
  if (role === "ristoratore") {
    const margin = wine.fascia === "economico" ? 55 : wine.fascia === "standard" ? 45 : wine.fascia === "premium" ? 35 : 28;
    const serviceTemp = wine.tipo === "Spumante" ? "6-8°C in secchiello" : wine.tipo === "Bianco" ? "10-12°C" : wine.tipo === "Rosso" ? "16-18°C in caraffa" : "12-14°C";
    return `Per la sala: servizio a ${serviceTemp}. Abbinamento consigliato in carta con: ${pairings}. Da evitare in menu degustazione: ${notPairings}. Margine target suggerito: ${margin}%. Posizionamento ideale come calice di ${wine.fascia === "lusso" ? "riserva / cru" : wine.fascia === "premium" ? "secondo calice" : "calice d'ingresso"}.`;
  }
  return `Oltre a "${dish}", questo vino eccelle con: ${pairings}. Evita invece: ${notPairings}.`;
}

function generateMotivo(wine: Wine, dish: string, role?: UserRole): string {
  const dishNorm = normalizeText(dish);
  if (role === "ristoratore") {
    if (wine.abbina_bene_con.some((f) => dishNorm.includes(normalizeText(f)))) {
      return `Abbinamento confermato dal produttore: vino gia segnalato per "${dish}". Inseribile in carta senza rischi.`;
    }
    return `Abbinamento per complementarita chimico-aromatica: le caratteristiche del vino si armonizzano con il piatto. Consigliato per menu degustazione o calice volante.`;
  }
  if (wine.abbina_bene_con.some((f) => dishNorm.includes(normalizeText(f)))) {
    return `Abbinamento classico: il vino e esplicitamente indicato per "${dish}".`;
  }
  return `Abbinamento per complementarita chimico-aromatica: le caratteristiche del vino si armonizzano con il piatto.`;
}

function generatePercheDelVino(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const parts: string[] = [];

  // CHIMICA
  if ((wine.tannini === "strutturati" || wine.tannini === "potenti" || wine.tannini === "titanici") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca") || dishNorm.includes("agnello") || dishNorm.includes("brasato"))) {
    parts.push(`Le procianidine B1-B4 e le catechine del vino si legano alle proteine muscolari denaturate dalla cottura, creando un ponte chimico che ammorbidisce la carne e riduce l'astringenza tannica.`);
  } else if ((wine.acidita === "alta" || wine.acidita === "altissima") &&
      (dishNorm.includes("gras") || dishNorm.includes("fritt") || dishNorm.includes("formaggi"))) {
    parts.push(`L'acido tartarico (4-7 g/L, pH 3.0-3.3) disgrega le micelle lipidiche del piatto grasso, solubilizzando i trigliceridi e ripulendo il palato tramite stimolazione salivare.`);
  } else if (wine.residuo_zuccherino > 50 && (dishNorm.includes("dolc") || dishNorm.includes("dessert"))) {
    parts.push(`Il residuo zuccherino (fruttosio + glucosio >50 g/L) compete con gli zuccheri del dessert a livello recettoriale T1R2/T1R3, seguendo la regola del +10 g/L per evitare che il vino risulti aspro.`);
  } else {
    parts.push(`L'equilibrio tra acido tartarico, glicerina (5-12 g/L) ed etanolo crea un'ossatura sensoriale che si integra con il piatto via complementarita chimica.`);
  }

  // PULIZIA
  if (wine.tipo === "Spumante") {
    parts.push(`L'anidride carbonica (4-6 bar) pulisce meccanicamente il palato tra un boccone e l'altro, rinfrescando la bocca e preparandola al prossimo morso.`);
  } else if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acidita vivace stimola la salivazione parotidea, lavando il palato dai grassi e mantenendo la freschezza gustativa.`);
  } else {
    parts.push(`I tannini ${wine.tannini} e l'acidita ${wine.acidita} bilanciano la persistenza gustativa senza appesantire.`);
  }

  // AROMATICO
  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  parts.push(`I composti volatili (${aromatiche}) risonano olfattivamente con le note aromatiche del piatto, creando un'armonia profumata che amplifica la percezione gustativa.`);

  // STRUTTURA
  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`La struttura piena (alcol ${wine.alcol}%, glicerina, estratto secco) regge l'intensita del piatto senza essere sopraffatta.`);
  } else {
    parts.push(`La leggerezza del corpo (${wine.alcol}% alcol) non copre le sfumature delicate del piatto, mantenendo un'equilibrio elegante.`);
  }

  // IN BOCCA
  parts.push(`In bocca, l'etanolo solubilizza i composti aromatici liposolubili, l'acidita stimola la salivazione e i tannini creano una sensazione tattile che prepara il palato al prossimo boccone.`);

  return parts.join(" ");
}

function generateChimicaInBocca(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const parts: string[] = [];

  if ((wine.tannini === "strutturati" || wine.tannini === "potenti") &&
      (dishNorm.includes("carne") || dishNorm.includes("bistecca"))) {
    parts.push(`Le procianidine si legano alle PRPs (proline-rich proteins) della saliva, formando complessi che precipitano e riducono la sensazione di astringenza.`);
  } else if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acido tartarico e malico abbassano il pH del bollo alimentare, attivando le papille gustative e stimolando la salivazione parotidea.`);
  } else {
    parts.push(`L'etanolo e la glicerina aumentano la viscosita del fluido orale, migliorando il rilascio dei composti aromatici volatili verso il retronasale.`);
  }

  if (wine.tipo === "Spumante") {
    parts.push(`Le bollicine di CO2 rilasciano energia meccanica che disgrega il film lipidico sulla lingua, amplificando la percezione di freschezza.`);
  }

  return parts.join(" ");
}

function generateMolecole(wine: Wine, dish: string): string[] {
  const dishNorm = normalizeText(dish);
  const molecole: string[] = [];

  // Base molecules by wine type
  if (wine.tipo === "Rosso") {
    molecole.push("procianidine B1-B4", "catechine", "epicatechine", "acido tartarico");
  } else if (wine.tipo === "Bianco") {
    molecole.push("acido tartarico", "acido malico", "linalolo", "glicerina");
  } else if (wine.tipo === "Spumante") {
    molecole.push("anidride carbonica", "acido tartarico", "mannoproteine", "etil-acetato");
  } else if (wine.tipo === "Rosato") {
    molecole.push("acido tartarico", "antociani", "linalolo", "catechine");
  } else if (wine.tipo === "Dolce") {
    molecole.push("fruttosio", "glucosio", "sotolone", "acido tartarico");
  }

  // Add based on dish
  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) {
    molecole.push("PRPs salivari");
  }
  if (dishNorm.includes("fritt") || dishNorm.includes("gras")) {
    molecole.push("trigliceridi");
  }
  if (dishNorm.includes("funghi") || dishNorm.includes("tartufo")) {
    molecole.push("geosmina", "1-otten-3-olo");
  }
  if (dishNorm.includes("piccant") || dishNorm.includes("speziat")) {
    molecole.push("capsaicina", "recettori TRPV1");
  }
  if (dishNorm.includes("dolc") || dishNorm.includes("dessert")) {
    molecole.push("recettori T1R2/T1R3");
  }

  // Add aromatic compounds
  for (const a of wine.profilo_aromatico.slice(0, 2)) {
    const al = a.toLowerCase();
    if (al.includes("vanigl")) molecole.push("vanillina");
    if (al.includes("legno") || al.includes("botte")) molecole.push("eugenolo", "furfurale");
    if (al.includes("frutta") || al.includes("ciliegia")) molecole.push("etil-butirrato");
    if (al.includes("agrumi")) molecole.push("limonene");
    if (al.includes("rosa") || al.includes("fiore")) molecole.push("geraniolo", "nerolo");
    if (al.includes("pepe") || al.includes("spezie")) molecole.push("guaiacolo");
    if (al.includes("terra") || al.includes("sottobosco")) molecole.push("geosmina");
  }

  return [...new Set(molecole)].slice(0, 8);
}

function generateTemperaturaServizio(wine: Wine): string {
  if (wine.tipo === "Spumante") return "6-8°C";
  if (wine.tipo === "Bianco") return wine.corpo === "pieno" ? "10-12°C" : "8-10°C";
  if (wine.tipo === "Rosso") return wine.corpo === "pieno" ? "16-18°C" : "14-16°C";
  if (wine.tipo === "Rosato") return "10-12°C";
  if (wine.tipo === "Dolce") return "8-10°C";
  return "12-14°C";
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
    parts.push(`I tannini condensati (procianidine B1-B4, 200-800 mg/L) inibiscono parzialmente la pepsina gastrica e la lipasi pancreatica legandosi alle loro glicoproteine superficiali, rallentando la digestione proteica del ${dishNorm.includes("carne") ? "piatto di carne" : "piatto"} del 10-15%.`);
  } else if (wine.tannini === "assenti" || wine.tannini === "leggeri") {
    parts.push(`I tannini ${wine.tannini} non interferiscono significativamente con la pepsina gastrica ne con la lipasi pancreatica, permettendo una digestione proteica del piatto senza rallentamenti enzimatici.`);
  } else {
    parts.push(`I tannini ${wine.tannini} hanno un effetto moderato sulla pepsina gastrica: legandosi alle proteine alimentari prima dell'azione enzimatica, le rendono parzialmente indisponibili alla digestione, ma l'effetto e compensato dall'acidita del vino che attiva il pepsinogeno.`);
  }

  if (wine.alcol >= 14) {
    parts.push(`L'etanolo al ${wine.alcol}% rallenta lo svuotamento gastrico del 25-40% (effetto dose-dipendente sulla motilita antrale), prolungando il senso di sazieta ma richiedendo piu tempo per la digestione completa del piatto (3-4 ore vs 2-3 ore senza alcol).`);
  } else if (wine.alcol >= 12) {
    parts.push(`L'etanolo al ${wine.alcol}% rallenta moderatamente lo svuotamento gastrico del 10-20%, con un impatto digestivo contenuto che bilancia il piatto senza appesantire eccessivamente (2.5-3.5 ore di svuotamento).`);
  } else {
    parts.push(`La bassa gradazione alcolica (${wine.alcol}%) minimizza il rallentamento dello svuotamento gastrico (solo 5-10%), favorendo una digestione piu rapida del piatto (2-3 ore).`);
  }

  if (wine.acidita === "alta" || wine.acidita === "altissima") {
    parts.push(`L'acidita del vino (pH 3.0-3.3, acido tartarico 5-7 g/L) stimola la secrezione di acido cloridrico gastrico, attivando il pepsinogeno in pepsina attiva e facilitando la denaturazione delle proteine del piatto nello stomaco.`);
  } else if (wine.acidita === "media") {
    parts.push(`L'acidita media del vino (pH 3.3-3.5) supporta la fisiologia gastrica senza alterare significativamente il pH dello stomaco, mantenendo un ambiente digestivo equilibrato.`);
  } else {
    parts.push(`L'acidita bassa del vino (pH 3.6+) ha un impatto minimo sulla secrezione di HCl gastrico; su piatti grassi questo puo risultare in una digestione meno efficiente dei lipidi.`);
  }

  if (wine.tipo === "Spumante") {
    parts.push(`L'anidride carbonica (4-6 bar) distende le pareti gastriche aumentando la superficie di contatto tra vino e cibo, accelerando l'assorbimento dell'etanolo e dei composti aromatici del 15-20% rispetto a un vino fermo.`);
  }

  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) {
    parts.push(`I tannini formano complessi con il ferro eme della carne, riducendone l'assorbimento intestinale del 5-15%, mentre l'etanolo aumenta la solubilita delle vitamine liposolubili (A, D, E, K) migliorandone l'assorbimento a livello dell'ileo.`);
  } else if (dishNorm.includes("formaggi") || dishNorm.includes("formaggio")) {
    parts.push(`L'etanolo solubilizza i grassi del formaggio facilitando l'azione della lipasi gastrica e pancreatica, mentre i polifenoli modulano l'assorbimento del calcio caseico attraverso chelazione parziale.`);
  } else if (dishNorm.includes("pesce")) {
    parts.push(`L'etanolo aumenta la solubilita degli acidi grassi omega-3 del pesce (EPA, DHA) migliorandone l'assorbimento intestinale, mentre i polifenoli del vino proteggono questi acidi dall'ossidazione durante la digestione.`);
  } else if (dishNorm.includes("dolc") || dishNorm.includes("dessert")) {
    parts.push(`L'etanolo inibisce parzialmente l'alfa-amilasi salivare e pancreatica, rallentando la digestione degli zuccheri del dessert e attenuando il picco glicemico post-prandiale del 10-20%.`);
  } else {
    parts.push(`L'etanolo aumenta la solubilita dei composti liposolubili del piatto migliorandone l'assorbimento intestinale, mentre i polifenoli del vino esercitano un effetto prebiotico sulla microflora (Lactobacillus, Bifidobacterium).`);
  }

  if (wine.tipo === "Rosso") {
    parts.push(`I polifenoli del vino rosso (resveratrolo 0.5-2 mg/L, quercetina 5-15 mg/L, antociani 100-350 mg/L) esercitano un effetto prebiotico selettivo: inibiscono batteri patogeni (Helicobacter pylori, Clostridium) e favoriscono Lactobacillus e Bifidobacterium, migliorando la salute del microbiota intestinale post-prandiale.`);
  } else if (wine.tipo === "Bianco") {
    parts.push(`I polifenoli del vino bianco (acidi fenolici 50-100 mg/L, flavonoli 5-20 mg/L) hanno un effetto prebiotico piu blando rispetto ai rossi, ma supportano comunque la crescita di Lactobacillus intestinali con un effetto antiossidante sulla mucosa.`);
  }

  return parts.join(" ");
}

function generateDiscorsoSommelier(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  const parts: string[] = [];

  parts.push(`Signore e signori, permettete che vi presenti questo ${wine.nome} della ${wine.regione}.`);

  if ((wine.tannini === "strutturati" || wine.tannini === "potenti") && (dishNorm.includes("carne") || dishNorm.includes("bistecca"))) {
    parts.push(`Le procianidine B1-B4 e le catechine di questo ${wine.tipo.toLowerCase()} si legano alle proteine muscolari denaturate dalla cottura, creando un ponte chimico che ammorbidisce le fibre e riduce l'astringenza tannica al palato.`);
  } else if ((wine.acidita === "alta" || wine.acidita === "altissima") && (dishNorm.includes("gras") || dishNorm.includes("fritt") || dishNorm.includes("formaggi"))) {
    parts.push(`L'acido tartarico (4-7 g/L, pH 3.0-3.3) disgrega le micelle lipidiche del piatto, solubilizzando i trigliceridi e ripulendo il palato tramite stimolazione della salivazione parotidea.`);
  } else {
    parts.push(`L'equilibrio tra acido tartarico, glicerina (5-12 g/L) ed etanolo al ${wine.alcol}% crea un'ossatura sensoriale che si integra con il piatto via complementarita chimica.`);
  }

  parts.push(`Al naso si aprono note di ${aromatiche}, composti volatili che risonano olfattivamente con le note aromatiche del piatto amplificando la percezione gustativa.`);

  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`La struttura piena, sostenuta dall'alcol e dall'estratto secco, regge l'intensita del piatto senza essere sopraffatta.`);
  } else {
    parts.push(`La leggerezza del corpo non copre le sfumature delicate del piatto, mantenendo un'equilibrio elegante.`);
  }

  parts.push(`In bocca, l'etanolo solubilizza i composti aromatici liposolubili, l'acidita stimola la salivazione e i tannini creano una sensazione tattile che prepara il palato al prossimo boccone. Un abbinamento di grande finezza.`);

  return parts.join(" ");
}

function generateDiscorsoAppassionato(wine: Wine, dish: string): string {
  const dishNorm = normalizeText(dish);
  const aromatiche = wine.profilo_aromatico.slice(0, 3).join(", ").toLowerCase();
  const parts: string[] = [];

  parts.push(`Avete mai provato a versare un calice di ${wine.nome} e accostarlo a un piatto di ${dish}? E come vedere due persone che si incontrano e scoprono di parlarsi.`);

  if (dishNorm.includes("carne") || dishNorm.includes("bistecca")) {
    parts.push(`Il vino ha una struttura che abbraccia la carne come un abito su misura: i tannini accarezzano le fibre, le ammorbidiscono, le fanno sembrare piu tenere.`);
  } else if (dishNorm.includes("pesce")) {
    parts.push(`La freschezza di questo vino e come una brezza marina che solletica il palato dopo ogni boccone di pesce: pulisce, rinfresca, fa venire voglia di un altro sorso.`);
  } else if (dishNorm.includes("formaggi") || dishNorm.includes("formaggio")) {
    parts.push(`Il formaggio grasso e untuoso incontra l'acidita del vino e succede qualcosa di magico: il grasso si scioglie, il vino diventa piu rotondo, e in bocca resta solo armonia.`);
  } else if (dishNorm.includes("dolc") || dishNorm.includes("dessert")) {
    parts.push(`Il dolce incontra il vino e le due dolcezze si riconoscono, si abbracciano senza sovrastarsi: come due voci che cantano insieme la stessa melodia.`);
  } else {
    parts.push(`C'e una chimica segreta tra questo vino e il piatto: si completano, si esaltano a vicenda, come due colori che messi vicini diventano piu vividi.`);
  }

  parts.push(`Profuma di ${aromatiche} e quando lo assaggi senti che quel profumo torna, si mescola al sapore del cibo, e ti fa sorridere per come tutto sembra ovvio, come se fosse sempre dovuto essere cosi.`);

  if (wine.corpo === "pieno" || wine.corpo === "medio-pieno") {
    parts.push(`E un vino che ha carattere, che non si fa mettere in ombra dal piatto, ma sa stare li accanto con sicurezza, da pari a pari.`);
  } else {
    parts.push(`E un vino discreto, elegante, che non ruba la scena al piatto ma gli fa da cornice, come una luce morbida su un quadro.`);
  }

  parts.push(`Provateci: versate, assaggiate, e ditemi se non e vero che certi abbinamenti sembrano scritti nel destino.`);

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
  filters?: { tipo?: string; fascia?: string; maxPrice?: number },
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

  const results = wines.map((w) => pairWineWithDish(w, dish, role));
  results.sort((a, b) => b.score.totale - a.score.totale);
  return results.slice(0, 12);
}

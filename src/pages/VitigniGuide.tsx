import { Link } from "react-router-dom";
import { Grape, ArrowRight, MapPin, Wine as WineIcon, Mountain, Clock, Award, Layers, Wind, History, BookOpen } from "lucide-react";

interface Vitigno {
  nome: string;
  tipo: "Rosso" | "Bianco" | "Spumante" | "Dolce";
  denominazione: string;
  origine: string;
  superficie: string;
  altitudine: string;
  suoli: string;
  potenzialeInvecchiamento: string;
  descrizione: string;
  profilo: string[];
  abbinamenti: string[];
  cantine: string[];
  curiosita: string;
  disciplinare: string;
}

const vitigni: Vitigno[] = [
  {
    nome: "Pinot Nero",
    tipo: "Rosso",
    denominazione: "Oltrepò Pavese Pinot Nero DOC / Metodo Classico DOCG",
    origine: "Borgogna (Francia), importato in Oltrepò nel 1850 da Conte Vistarino",
    superficie: "~3.000 ettari — il 65% del Pinot Nero italiano",
    altitudine: "200-500 m slm, esposizione sud-est",
    suoli: "Calcarei marnosi, argillosi di origine marina (Pliocene), pH 7.5-8.0",
    potenzialeInvecchiamento: "5-8 anni in versione ferma; 3-10 anni per Metodo Classico",
    descrizione: "Il vitigno principe dell'Oltrepò Pavese. Arrivato qui nel 1850 per mano di Conte Vistarino, oggi e la varieta a bacca rossa piu coltivata del territorio. L'Oltrepò produce il 65% del Pinot Nero italiano, un primato nazionale. Si usa sia per vini rossi fermi che come base per Metodo Classico spumanti. I suoli calcarei marnosi e le escursioni termiche autunnali sono ideali per mantenere acidita e aromi delicati.",
    profilo: ["Frutti rossi", "Ciliegia", "Fragola", "Spezie", "Fungo", "Sottobosco"],
    abbinamenti: ["Risotto ai funghi", "Anatra", "Tartufo", "Salumi", "Formaggi medi"],
    cantine: ["Conte Vistarino", "Frecciarossa", "Monsupello", "Tenuta Mazzolino", "Tenuta Riccardi", "Torti"],
    curiosita: "L'Oltrepò Pavese e la zona con piu Pinot Nero d'Italia. Conte Vistarino fu il primo a piantarlo nel 1850, 30 anni prima che la Borgogna lo esportasse nel mondo.",
    disciplinare: "DOC: min. 85% Pinot Nero. Resa max 90 q/ha. Affinamento minimo 6 mesi. DOCG Metodo Classico: min. 70% Pinot Nero, 24 mesi sui lieviti.",
  },
  {
    nome: "Bonarda (Croatina)",
    tipo: "Rosso",
    denominazione: "Bonarda dell'Oltrepò Pavese DOC",
    origine: "Autoctono dell'Oltrepò Pavese (Croatina)",
    superficie: "~1.500 ettari",
    altitudine: "150-400 m slm",
    suoli: "Argillosi, calcarei, ben drenati",
    potenzialeInvecchiamento: "1-3 anni, da bere giovane",
    descrizione: "Vitigno autoctono dell'Oltrepò, storicamente il vino quotidiano del territorio. La Bonarda DOC e vinificata con almeno 85% di uva Croatina. Produce vini rossi freschi, fruttati, a basso tannino e alta bevibilita. Spesso vinificato in versione frizzante con metodo ancestrale (rifermentazione in bottiglia senza sboccatura), e il vino della tradizione contadina pavese.",
    profilo: ["Frutti neri", "Mora", "Floreale", "Fresco", "Frizzante"],
    abbinamenti: ["Salumi", "Pizza", "Pasta al pomodoro", "Formaggi freschi", "Cucina povera"],
    cantine: ["Cantine Giorgi", "Vercesi del Castellazzo", "Ballabio", "Le Fracce", "Bruno Verdi", "Poderi Rossini"],
    curiosita: "La Bonarda dell'Oltrepò e uno dei pochi vini italiani vinificati ancora in versione frizzante con metodo ancestrale, rifermentazione in bottiglia senza sboccatura.",
    disciplinare: "DOC: min. 85% Croatina. Resa max 110 q/ha. Possono concorrere Barbera e Uva Rara fino al 15%. Spesso frizzante naturale.",
  },
  {
    nome: "Buttafuoco",
    tipo: "Rosso",
    denominazione: "Buttafuoco dell'Oltrepò Pavese DOC / Buttafuoco Storico",
    origine: "Autoctono dell'Oltrepò Pavese, zona di Casteggio-Montù Beccaria",
    superficie: "~400 ettari (produzione limitata)",
    altitudine: "200-450 m slm, esposizione sud-ovest",
    suoli: "Argillosi calcarei con scheletro, ben drenati",
    potenzialeInvecchiamento: "5-10 anni; Storico anche 15+ anni",
    descrizione: "Il vino piu rappresentativo e storico dell'Oltrepò. Assemblaggio tradizionale di uve autoctone: Barbera, Croatina, Ughetta e Uva Rara. Il Buttafuoco Storico segue il disciplinare del 1907, uno dei piu antichi d'Italia. Solo 12 cantine lo producono, con rese per ettaro tra le piu basse del Paese. Vino strutturato, lungo affinamento, produzione limitata ad alta qualita.",
    profilo: ["Frutti rossi", "Spezie", "Cuoio", "Tabacco", "Strutturato"],
    abbinamenti: ["Brasato", "Cacciagione", "Ragu", "Formaggi stagionati", "Bistecca"],
    cantine: ["Monsupello", "Vercesi del Castellazzo", "Ballabio", "Terre d'Oltrepò", "Le Fracce", "Cantine Giorgi"],
    curiosita: "Il Buttafuoco Storico segue un disciplinare del 1907, uno dei piu antichi d'Italia. Solo 12 cantine lo producono, con rese per ettaro tra le piu basse del Paese.",
    disciplinare: "DOC: assemblaggio Croatina + Barbera + Uva Rara + Ughetta. Resa max 80 q/ha. Storico: disciplinare 1907, rese ancora piu basse, solo 12 cantine autorizzate.",
  },
  {
    nome: "Barbera",
    tipo: "Rosso",
    denominazione: "Barbera dell'Oltrepò Pavese DOC",
    origine: "Piemonte (Monferrato), diffusa in Oltrepò dal XIX secolo",
    superficie: "~1.200 ettari",
    altitudine: "150-400 m slm",
    suoli: "Argillosi calcarei, freschi",
    potenzialeInvecchiamento: "2-5 anni; in legno anche 7-8",
    descrizione: "Vitigno piemontese che in Oltrepò trova espressione fresca e fruttata. Alta acidita naturale, tannini moderati, colore intenso. Vinificato sia in versione giovane in acciaio che in legno per versioni piu strutturate. L'acidita vivace la rende versatile a tavola e ottima come aperitivo tradizionale pavese.",
    profilo: ["Ciliegia", "Prugna", "Frutti neri", "Fresco", "Acidita vivace"],
    abbinamenti: ["Pasta al ragu", "Pizza", "Salumi", "Formaggi medi", "Carne bianca"],
    cantine: ["Cantine Giorgi", "Conte Vistarino", "Tenuta Mazzolino", "Quaquarini", "Ca' di Frara", "La Versa"],
    curiosita: "La Barbera dell'Oltrepò ha acidita naturale cosi alta che tradizionalmente veniva bevuta come aperitivo, prima dei pasti, per stimolare l'appetito.",
    disciplinare: "DOC: min. 85% Barbera. Resa max 100 q/ha. Possono concorrere Croatina, Uva Rara, Pinot Nero fino al 15%.",
  },
  {
    nome: "Croatina",
    tipo: "Rosso",
    denominazione: "Componente di Buttafuoco DOC e Bonarda DOC",
    origine: "Autoctona della Lombardia sud-occidentale",
    superficie: "~800 ettari",
    altitudine: "150-400 m slm",
    suoli: "Argillosi, calcarei",
    potenzialeInvecchiamento: "2-4 anni in blend; raramente vinificata in purezza",
    descrizione: "Uva autoctona a bacca rossa, raramente vinificata in purezza. Componente fondamentale del Buttafuoco, dove aggiunge colore, tannino e struttura. Da colore intenso e frutto scuro, con note speziate se affinata in legno. Spesso confusa con la Bonarda, ma e un vitigno distinto.",
    profilo: ["Frutti neri", "Mora", "Pepe", "Colore intenso"],
    abbinamenti: ["Arrosti", "Stufati", "Formaggi stagionati"],
    cantine: ["Vercesi del Castellazzo", "Ballabio"],
    curiosita: "La Croatina e chiamata 'Bonarda' in alcune zone dell'Oltrepò, ma non e la stessa uva della Bonarda autoctona. Confusione storica che il disciplinare DOC ha chiarito solo nel 1984.",
    disciplinare: "Non ha una DOC propria. Usata come componente in Buttafuoco DOC (min. 25%) e Bonarda DOC (min. 85% come sinonimo di Croatina).",
  },
  {
    nome: "Ughetta di Canneto",
    tipo: "Rosso",
    denominazione: "Componente di Buttafuoco DOC",
    origine: "Autoctono di Canneto Pavese",
    superficie: "~200 ettari (rarissima)",
    altitudine: "250-400 m slm",
    suoli: "Argillosi calcarei, microzona di Canneto e Casteggio",
    potenzialeInvecchiamento: "2-5 anni in blend",
    descrizione: "Vitigno autoctono rarissimo, quasi estinto, coltivato solo nei comuni di Canneto Pavese e Casteggio. Componente minore del Buttafuoco, aggiunge freschezza e aromaticita. Poche cantine la vinificano in purezza. Meno di 200 ettari in tutto il mondo, tutti concentrati in due comuni dell'Oltrepò.",
    profilo: ["Floreale", "Frutti rossi", "Fresco", "Aromatico"],
    abbinamenti: ["Salumi", "Antipasti", "Pasta leggera"],
    cantine: ["Cantine Giorgi"],
    curiosita: "L'Ughetta di Canneto e tra i vitigni piu rari d'Italia: meno di 200 ettari in tutto il mondo, tutti concentrati in due comuni dell'Oltrepò.",
    disciplinare: "Componente minore del Buttafuoco DOC (fino al 10%). Non ha DOC propria. Recupero viticolo in corso da parte del Consorzio.",
  },
  {
    nome: "Uva Rara",
    tipo: "Rosso",
    denominazione: "Componente di Buttafuoco DOC e Bonarda DOC",
    origine: "Autoctona dell'Oltrepò Pavese",
    superficie: "~300 ettari",
    altitudine: "200-400 m slm",
    suoli: "Argillosi, freschi",
    potenzialeInvecchiamento: "1-3 anni, da bere giovane",
    descrizione: "Uva autoctona a bacca rossa dal nome curioso ('rara' perche storicamente poco diffusa). Componente del Buttafuoco e della Bonarda, aggiunge morbidezza e frutto rotondo. Vinificata raramente in purezza, ma alcune cantine sperimentano versioni monovarietali interessanti.",
    profilo: ["Frutti rossi", "Mora", "Morbido", "Leggero"],
    abbinamenti: ["Pasta", "White meat", "Antipasti"],
    cantine: ["Vercesi del Castellazzo", "Monsupello"],
    curiosita: "L'Uva Rara e chiamata anche 'Bonarda di Gattinara' in alcune zone del Piemonte, ma in Oltrepò e considerata uva autoctona distinta.",
    disciplinare: "Componente in Buttafuoco DOC (5-30%) e Bonarda DOC (fino al 15%). Non ha DOC propria.",
  },
  {
    nome: "Riesling",
    tipo: "Bianco",
    denominazione: "Riesling dell'Oltrepò Pavese DOC",
    origine: "Germania (Reno), importato in Oltrepò nell'Ottocento",
    superficie: "~300 ettari",
    altitudine: "250-500 m slm, esposizione est",
    suoli: "Calcarei marnosi, argillosi, pH 7.5-8.0",
    potenzialeInvecchiamento: "5-15 anni; sviluppa note di idrocarburo con l'eta",
    descrizione: "L'Oltrepò e una delle poche zone italiane dove il Riesling Renano attecchisce bene. Suoli calcarei e escursioni termiche danno vini minerali, freschi, con acidita vivace e aromi di mela verde e idrocarburo. Vinificato sia secco che con residuo zuccherino. L'unico Riesling Renano DOC d'Italia.",
    profilo: ["Mela verde", "Agrumi", "Minerale", "Idrocarburo", "Floreale"],
    abbinamenti: ["Pesce", "Crostacei", "Sushi", "Cucina asiatica", "Aperitivo"],
    cantine: ["Vercesi del Castellazzo", "Doria", "Travaglino", "Ruiz de Cardenas", "Cascina Gnocco", "Frecciarossa"],
    curiosita: "Il Riesling dell'Oltrepò e l'unico Riesling Renano DOC d'Italia. La zona e cosi adatta che alcuni esperti tedeschi lo considerano superiore a molti Rheingau di livello base.",
    disciplinare: "DOC: min. 85% Riesling Renano e/o Italico. Resa max 90 q/ha. Puo essere secco, amabile o dolce.",
  },
  {
    nome: "Cortese",
    tipo: "Bianco",
    denominazione: "Cortese dell'Oltrepò Pavese DOC",
    origine: "Piemonte (Gavi), diffusa in Oltrepò",
    superficie: "~500 ettari",
    altitudine: "150-350 m slm",
    suoli: "Calcarei, argillosi, freschi",
    potenzialeInvecchiamento: "1-3 anni, da bere giovane",
    descrizione: "Uva bianca piemontese che in Oltrepò produce vini freschi, leggeri, con acidita vivace e aromi di mela e fiori bianchi. Vino da pasto versatile, bevuto giovane, ottimo come aperitivo o con pesce. Costituisce oltre il 40% dei bianchi fermi del territorio. Meno famoso del cugino piemontese (Gavi DOCG) ma con rapporto qualita-prezzo nettamente superiore.",
    profilo: ["Mela", "Fiori bianchi", "Fresco", "Minerale", "Leggero"],
    abbinamenti: ["Pesce crudo", "Antipasti di mare", "Insalate", "Aperitivo"],
    cantine: ["Cantine Giorgi", "Doria", "La Versa", "Bruno Verdi", "Castello di Cigognola", "Scuropasso"],
    curiosita: "Il Cortese dell'Oltrepò costituisce oltre il 40% dei bianchi fermi del territorio. Meno famoso del cugino piemontese (Gavi DOCG) ma con rapporto qualita-prezzo nettamente superiore.",
    disciplinare: "DOC: min. 85% Cortese. Resa max 100 q/ha. Da bere giovane, entro 2 anni dalla vendemmia.",
  },
  {
    nome: "Moscato",
    tipo: "Dolce",
    denominazione: "Moscato dell'Oltrepò Pavese DOC",
    origine: "Mediterraneo orientale, diffuso in Oltrepò dal Medioevo",
    superficie: "~600 ettari",
    altitudine: "150-300 m slm",
    suoli: "Calcarei, sabbiosi, ben esposti",
    potenzialeInvecchiamento: "1-3 anni; versione passito anche 5-8",
    descrizione: "L'Oltrepò e la zona a vocazione moscata piu importante del Nord Italia. Moscato Bianco (Canelli) vinificato in versione dolce, frizzante e spumante. Aromi intensi di salvia, pesca, agrumi e fiori. Residuo zuccherino marcato, acidita equilibrata. La Versa e Ca' di Frara producono il 70% del Moscato dell'Oltrepò.",
    profilo: ["Salvia", "Pesca", "Fiori", "Agrumi", "Dolce"],
    abbinamenti: ["Dessert", "Torte", "Frutta", "Formaggi erborinati", "Aperitivo dolce"],
    cantine: ["Ca' di Frara", "La Versa", "Doria", "Ruiz de Cardenas"],
    curiosita: "La Versa e Ca' di Frara producono il 70% del Moscato dell'Oltrepò. Il Moscato dell'Oltrepò e tra i pochi vini dolci italiani esportati in Giappone, dove e considerato un vino da cerimonia.",
    disciplinare: "DOC: min. 85% Moscato Bianco. Resa max 100 q/ha. Frizzante, spumante o passito. Residuo zuccherino min. 50 g/L.",
  },
  {
    nome: "Chardonnay",
    tipo: "Bianco",
    denominazione: "Oltrepò Pavese Chardonnay DOC",
    origine: "Borgogna (Francia), importato in Oltrepò nel XX secolo",
    superficie: "~400 ettari",
    altitudine: "200-400 m slm",
    suoli: "Calcarei marnosi, argillosi",
    potenzialeInvecchiamento: "2-5 anni in acciaio; 5-10 anni in legno",
    descrizione: "Chardonnay in Oltrepò ha doppia anima: vinificato in acciaio per vini freschi e fruttati, o in legno per versioni strutturate da invecchiamento. Base importante per Metodo Classico spumanti insieme al Pinot Nero. Le cantine dell'Oltrepò sono tra le poche in Italia a usare Chardonnay coltivato a oltre 200m slm.",
    profilo: ["Mela", "Burro", "Vaniglia", "Fiori bianchi", "Minerale"],
    abbinamenti: ["Risotto", "Pesce al forno", "Pollo", "Formaggi freschi"],
    cantine: ["Tenuta Mazzolino", "Castello di Cigognola", "Andrea Picchioni", "Fiamberti", "Scuropasso"],
    curiosita: "Il Chardonnay dell'Oltrepò e la base bianca del Metodo Classico DOCG insieme al Pinot Nero. Le cantine dell'Oltrepò sono tra le poche in Italia a usare Chardonnay coltivato a oltre 200m slm.",
    disciplinare: "DOC: min. 85% Chardonnay. Resa max 90 q/ha. Base per Metodo Classico DOCG (min. 30% insieme a Pinot Nero).",
  },
  {
    nome: "Pinot Grigio",
    tipo: "Bianco",
    denominazione: "Pinot Grigio dell'Oltrepò Pavese DOC",
    origine: "Francia (Borgogna), mutazione del Pinot Nero",
    superficie: "~350 ettari",
    altitudine: "200-400 m slm",
    suoli: "Calcarei, argillosi, freschi",
    potenzialeInvecchiamento: "1-2 anni, da bere giovane",
    descrizione: "Il Pinot Grigio trova nell'Oltrepò un'espressione fresca e minerale, grazie ai suoli calcarei e alle escursioni termiche. Vinificato in acciaio per preservare la freschezza aromatica. Vino da pasto versatile, ottimo come aperitivo o con antipasti di pesce.",
    profilo: ["Mela verde", "Pera", "Fiori bianchi", "Minerale", "Leggero"],
    abbinamenti: ["Antipasti di pesce", "Risotto", "Formaggi freschi", "Aperitivo"],
    cantine: ["Andrea Picchioni", "Fiamberti", "Quaquarini", "Tenuta Mazzolino"],
    curiosita: "Il Pinot Grigio e una mutazione genetica del Pinot Nero: stesso vitigno, colore diverso. In Oltrepò coesistono entrambi, e alcune cantine li vinificano nello stesso vigneto.",
    disciplinare: "DOC: min. 85% Pinot Grigio. Resa max 100 q/ha. Da bere giovane, entro 2 anni.",
  },
  {
    nome: "Pinot Nero (Metodo Classico)",
    tipo: "Spumante",
    denominazione: "Oltrepò Pavese Metodo Classico DOCG / Cruasé DOCG",
    origine: "Borgogna (Francia), base spumantistica dal 1850",
    superficie: "~1.000 ettari destinati a spumante",
    altitudine: "250-500 m slm, esposizione sud-est",
    suoli: "Calcarei marnosi, pH 7.5-8.0, ideali per acidita e freschezza",
    potenzialeInvecchiamento: "3-10 anni sui lieviti; riserve anche 15+",
    descrizione: "L'Oltrepò Pavese e la capitale italiana del Metodo Classico da Pinot Nero. La DOCG richiede min. 70% Pinot Nero, 24 mesi sui lieviti. La Cruasé DOCG e la versione rose (min. 85% Pinot Nero in bianco). I suoli calcarei e l'altitudine garantiscono acidita e aromi eleganti. Tradizione spumantistica che risale al 1850 con Conte Vistarino.",
    profilo: ["Crosta di pane", "Frutta secca", "Agrumi", "Lievito fresco", "Elegante"],
    abbinamenti: ["Aperitivo", "Risotto ai frutti di mare", "Tempura", "Crudi di mare"],
    cantine: ["Frecciarossa", "Conte Vistarino", "Travaglino", "Cà Longa", "Il Montù", "Cascina Gnocco"],
    curiosita: "L'Oltrepò Pavese Metodo Classico DOCG e l'unico spumante DOCG in Italia a base di Pinot Nero in purezza (min. 70%). La tradizione spumantistica risale al 1850, prima di Franciacorta.",
    disciplinare: "DOCG: min. 70% Pinot Nero, 24 mesi sui lieviti (30 per riserva). Cruasé DOCG: min. 85% Pinot Nero in rose. Resa max 90 q/ha.",
  },
];

const tipoColors: Record<string, string> = {
  Rosso: "bg-bordeaux-800 text-gold-400",
  Bianco: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Spumante: "bg-gold-100 text-gold-700 border border-gold-300",
  Dolce: "bg-amber-100 text-amber-700 border border-amber-300",
};

export default function VitigniGuide() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Grape className="w-3.5 h-3.5" /> Cantina · Oltrepò Pavese
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Guida ai Vitigni dell'Oltrepò</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            L'Oltrepò Pavese coltiva 13 vitigni principali tra autoctoni e internazionali.
            Il territorio produce il 65% del Pinot Nero italiano, vanta vitigni rarissimi come l'Ughetta di Canneto,
            e ha una tradizione spumantistica che risale al 1850.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { num: "13", label: "Vitigni principali" },
            { num: "65%", label: "Pinot Nero d'Italia" },
            { num: "7", label: "DOC / DOCG" },
            { num: "1850", label: "Primo Pinot Nero" },
          ].map((s, i) => (
            <div key={i} className="bg-bordeaux-950 rounded-xl p-4 text-center">
              <p className="font-serif text-2xl text-gold-400">{s.num}</p>
              <p className="text-xs text-cream-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Terroir section */}
        <div className="mb-8 p-6 rounded-xl bg-cream-50 border border-cream-200">
          <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-600" /> Il Terroir dell'Oltrepò Pavese
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-bordeaux-50/50 border border-cream-200">
              <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" /> Geologia e Suoli
              </p>
              <p className="text-xs text-bordeaux-600 leading-relaxed">
                L'Oltrepò Pavese occupa la fascia collinare a sud del Po, tra i 150 e i 500 m slm.
                I suoli sono di origine marina pliocenica: calcarei marnosi, argillosi, con scheletro
                ghiaioso nelle zone piu alte. Il pH alcalino (7.5-8.0) e ideale per vitigni come
                Pinot Nero e Riesling, che trovano qui condizioni simili alla Borgogna e al Reno.
                La composizione mineralogica contribuisce alle note di mineralita e idrocarburo
                caratteristiche dei vini locali.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-50/50 border border-cream-200">
              <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" /> Clima e Microclima
              </p>
              <p className="text-xs text-bordeaux-600 leading-relaxed">
                Clima temperato continentale con influenza appenninica. Escursioni termiche
                di 15-20 gradi tra giorno e notte in settembre-ottobre, fondamentali per
                preservare acidita e aromi delicati nel Pinot Nero e nel Riesling.
                Ventilazione costante dalle valli appenniniche riduce la pressione fungina,
                permettendo conduzione biologica e biodinamica in molte cantine.
                Piovosita media 700-900 mm/anno, concentrata in primavera e autunno.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gold-50/50 border border-gold-200">
            <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Storia Vitivinicola
            </p>
            <p className="text-xs text-bordeaux-600 leading-relaxed">
              La viticoltura dell'Oltrepò risale all'epoca romana, ma la svolta moderna avviene nel 1850
              quando Conte Vistarino importa le prime barbatelle di Pinot Nero dalla Borgogna,
              30 anni prima che la Francia lo esportasse nel mondo. Nel 1907 nasce il disciplinare
              del Buttafuoco Storico, uno dei piu antichi d'Italia. Nel 2010 l'Oltrepò Pavese
              Metodo Classico ottiene la DOCG, coronando oltre 150 anni di tradizione spumantistica.
              Oggi il distretto conta oltre 3.000 ettari vitati, 12 cantine storiche e 7 denominazioni.
            </p>
          </div>
        </div>

        {/* Denominazioni overview */}
        <div className="mb-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h2 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-400" /> Denominazioni dell'Oltrepò
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { nome: "Oltrepò Pavese Metodo Classico DOCG", tipo: "Spumante", note: "Min. 70% Pinot Nero, 24 mesi sui lieviti. Unica DOCG spumantistica lombarda." },
              { nome: "Oltrepò Pavese Metodo Classico Cruasé DOCG", tipo: "Rosato", note: "Rose da Pinot Nero (min. 85%). Prima DOCG rose d'Italia." },
              { nome: "Bonarda dell'Oltrepò Pavese DOC", tipo: "Rosso", note: "Min. 85% Croatina. Spesso frizzante ancestrale." },
              { nome: "Buttafuoco dell'Oltrepò Pavese DOC", tipo: "Rosso", note: "Assemblaggio autoctono. Storico dal 1907." },
              { nome: "Barbera dell'Oltrepò Pavese DOC", tipo: "Rosso", note: "Min. 85% Barbera. Acidita vivace." },
              { nome: "Oltrepò Pavese Pinot Nero DOC", tipo: "Rosso", note: "Min. 85% Pinot Nero. 65% del Pinot Nero italiano." },
              { nome: "Riesling dell'Oltrepò Pavese DOC", tipo: "Bianco", note: "Unico Riesling Renano DOC d'Italia." },
              { nome: "Moscato dell'Oltrepò Pavese DOC", tipo: "Dolce", note: "Min. 85% Moscato Bianco. Frizzante, spumante o passito." },
              { nome: "Oltrepò Pavese Chardonnay DOC", tipo: "Bianco", note: "Base bianca per Metodo Classico DOCG." },
              { nome: "Oltrepò Pavese Cortese DOC", tipo: "Bianco", note: "Fresco, leggero, da bere giovane." },
              { nome: "Pinot Grigio dell'Oltrepò Pavese DOC", tipo: "Bianco", note: "Mutazione del Pinot Nero, fresco e minerale." },
              { nome: "Oltrepò Pavese Sangue di Giuda DOC", tipo: "Dolce", note: "Frizzante dolce da Croatina, Barbera, Uva Rara." },
            ].map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-bordeaux-800/50 border border-gold-700/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-400 text-bordeaux-950">{d.tipo}</span>
                  <p className="text-xs font-semibold text-cream-100">{d.nome}</p>
                </div>
                <p className="text-xs text-cream-300 leading-relaxed">{d.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vitigni cards */}
        <div className="space-y-4">
          {vitigni.map((v, i) => (
            <div key={i} className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-serif text-xl text-bordeaux-950">{v.nome}</h2>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColors[v.tipo]}`}>
                        {v.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-gold-600 font-medium">{v.denominazione}</p>
                  </div>
                </div>

                <p className="text-sm text-bordeaux-700 leading-relaxed mb-4">{v.descrizione}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Origine</p>
                      <p className="text-xs text-bordeaux-600">{v.origine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Grape className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Superficie</p>
                      <p className="text-xs text-bordeaux-600">{v.superficie}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mountain className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Altitudine</p>
                      <p className="text-xs text-bordeaux-600">{v.altitudine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Invecchiamento</p>
                      <p className="text-xs text-bordeaux-600">{v.potenzialeInvecchiamento}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-bordeaux-50/50 border border-cream-200">
                  <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mountain className="w-3 h-3" /> Suoli
                  </p>
                  <p className="text-xs text-bordeaux-600">{v.suoli}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Profilo aromatico</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.profilo.map((p, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-cream-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Abbinamenti</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.abbinamenti.map((a, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-cream-100 text-bordeaux-600">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Cantine che lo producono</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.cantine.map((c, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gold-50/50 border border-gold-200">
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Award className="w-3 h-3" /> Disciplinare
                    </p>
                    <p className="text-xs text-bordeaux-600">{v.disciplinare}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 py-3 bg-bordeaux-50 border-t border-cream-200">
                <p className="text-xs text-bordeaux-600 italic flex items-start gap-2">
                  <WineIcon className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                  {v.curiosita}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h3 className="font-serif text-xl text-cream-50 mb-2">Esplora i vini e le cantine</h3>
          <p className="text-sm text-cream-200 mb-4">Scopri i vini reali dell'Oltrepò Pavese e le cantine che li producono.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalog?regione=Oltrepò+Pavese" className="px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm text-center flex items-center justify-center gap-2">
              <WineIcon className="w-4 h-4" /> Vai al catalogo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cantine" className="px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm text-center border border-gold-700/30 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> Directory cantine <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

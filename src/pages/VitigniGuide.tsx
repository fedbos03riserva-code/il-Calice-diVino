import { Link } from "react-router-dom";
import { Grape, ArrowRight, MapPin, Wine as WineIcon } from "lucide-react";

interface Vitigno {
  nome: string;
  tipo: "Rosso" | "Bianco" | "Spumante" | "Dolce";
  denominazione: string;
  origine: string;
  superficie: string;
  descrizione: string;
  profilo: string[];
  abbinamenti: string[];
  cantine: string[];
  curiosita: string;
}

const vitigni: Vitigno[] = [
  {
    nome: "Pinot Nero",
    tipo: "Rosso",
    denominazione: "Pinot Nero dell'Oltrepò Pavese DOC / DOCG",
    origine: "Borgogna (Francia), importato in Oltrepò nel 1850 da Conte Vistarino",
    superficie: "~3.000 ettari — il 65% del Pinot Nero italiano",
    descrizione: "Il vitigno principe dell'Oltrepò Pavese. Arrivato qui nel 1850 per mano di Conte Vistarino, e oggi la varietá a bacca rossa piu coltivata del territorio. L'Oltrepò produce il 65% del Pinot Nero italiano, un primato nazionale. Si usa sia per vini rossi fermi che come base per Metodo Classico spumanti.",
    profilo: ["Frutti rossi", "Ciliegia", "Fragola", "Spezie", "Fungo", "Sottobosco"],
    abbinamenti: ["Risotto ai funghi", "Anatra", "Tartufo", "Salumi", "Formaggi medi"],
    cantine: ["Conte Vistarino", "Frecciarossa", "Monsupello", "Tenuta Mazzolino"],
    curiosita: "L'Oltrepò Pavese e la zona con piu Pinot Nero d'Italia. Conte Vistarino fu il primo a piantarlo nel 1850, 30 anni prima che la Borgogna lo esportasse nel mondo.",
  },
  {
    nome: "Bonarda",
    tipo: "Rosso",
    denominazione: "Bonarda dell'Oltrepò Pavese DOC",
    origine: "Autoctono dell'Oltrepò Pavese",
    superficie: "~1.500 ettari",
    descrizione: "Vitigno autoctono dell'Oltrepò, storicamente il vino quotidiano del territorio. Produce vini rossi freschi, fruttati, a basso tannino e alta bevibilitá. Spesso vinificato in versione frizzante, e il vino della tradizione contadina pavese.",
    profilo: ["Frutti neri", "Morà", "Floreale", "Fresco", "Frizzante"],
    abbinamenti: ["Salumi", "Pizza", "Pasta al pomodoro", "Formaggi freschi", "Cucina povera"],
    cantine: ["Cantine Giorgi", "Vercesi del Castellazzo", "Ballabio"],
    curiosita: "La Bonarda dell'Oltrepò e uno dei pochi vini italiani vinificati ancora in versione frizzante con metodo ancestrale, rifermentazione in bottiglia senza sboccatura.",
  },
  {
    nome: "Buttafuoco",
    tipo: "Rosso",
    denominazione: "Buttafuoco dell'Oltrepò Pavese DOC",
    origine: "Autoctono dell'Oltrepò Pavese, zona di Casteggio-Montù Beccaria",
    superficie: "~400 ettari (produzione limitata)",
    descrizione: "Il vino piú rappresentativo e storico dell'Oltrepò. Assemblaggio tradizionale di uve autoctone (Barbera, Croatina, Ughetta, Bonarda). Il Buttafuoco Storico segue il disciplinare del 1907. Vino strutturato, lungo affinamento, produzione limitata ad alta qualitá.",
    profilo: ["Frutti rossi", "Spezie", "Cuoio", "Tabacco", "Strutturato"],
    abbinamenti: ["Brasato", "Cacciagione", "Ragù", "Formaggi stagionati", "Bistecca"],
    cantine: ["Monsupello", "Vercesi del Castellazzo", "Ballabio"],
    curiosita: "Il Buttafuoco Storico segue un disciplinare del 1907, uno dei piú antichi d'Italia. Solo 12 cantine lo producono, con rese per ettaro tra le piú basse del Paese.",
  },
  {
    nome: "Barbera",
    tipo: "Rosso",
    denominazione: "Barbera dell'Oltrepò Pavese DOC",
    origine: "Piemonte, diffusa in Oltrepò dal XIX secolo",
    superficie: "~1.200 ettari",
    descrizione: "Vitigno piemontese che in Oltrepò trova espressione fresca e fruttata. Alta aciditá, tannini moderati, colore intenso. Vinificato sia in versione giovane che in legno per versioni piú strutturate.",
    profilo: ["Ciliegia", "Prugna", "Frutti neri", "Fresco", "Aciditá vivace"],
    abbinamenti: ["Pasta al ragù", "Pizza", "Salumi", "Formaggi medi", "Carne bianca"],
    cantine: ["Cantine Giorgi", "Conte Vistarino", "Tenuta Mazzolino"],
    curiosita: "La Barbera dell'Oltrepò ha aciditá naturale cosí alta che tradizionalmente veniva bevuta come aperitivo, prima dei pasti, per stimolare l'appetito.",
  },
  {
    nome: "Croatina",
    tipo: "Rosso",
    denominazione: "Componente di Buttafuoco DOC e Bonarda DOC",
    origine: "Autoctono della Lombardia sud-occidentale",
    superficie: "~800 ettari",
    descrizione: "Uva autoctona a bacca rossa, raramente vinificata in purezza. Componente fondamentale del Buttafuoco, dove aggiunge colore, tannino e struttura. Da colore intenso e frutto scuro, con note speziate se affinata in legno.",
    profilo: ["Frutti neri", "Morá", "Pepe", "Colore intenso"],
    abbinamenti: ["Arrosti", "Stufati", "Formaggi stagionati"],
    cantine: ["Vercesi del Castellazzo", "Ballabio"],
    curiosita: "La Croatina e chiamata 'Bonarda' in alcune zone dell'Oltrepò, ma non é la stessa uva della Bonarda autoctona. Confusione storica che il disciplinare DOC ha chiarito solo nel 1984.",
  },
  {
    nome: "Ughetta di Canneto",
    tipo: "Rosso",
    denominazione: "Componente di Buttafuoco DOC",
    origine: "Autoctono di Canneto Pavese",
    superficie: "~200 ettari (rarissima)",
    descrizione: "Vitigno autoctono rarissimo, quasi estinto, coltivato solo nei comuni di Canneto Pavese e Casteggio. Componente minore del Buttafuoco, aggiunge freschezza e aromaticitá. Poche cantine la vinificano in purezza.",
    profilo: ["Floreale", "Frutti rossi", "Fresco", "Aromatico"],
    abbinamenti: ["Salumi", "Antipasti", "Pasta leggera"],
    cantine: ["Cantine Giorgi"],
    curiosita: "L'Ughetta di Canneto é tra i vitigni piú rari d'Italia: meno di 200 ettari in tutto il mondo, tutti concentrati in due comuni dell'Oltrepò.",
  },
  {
    nome: "Riesling",
    tipo: "Bianco",
    denominazione: "Riesling dell'Oltrepò Pavese DOC",
    origine: "Germania (Reno), importato in Oltrepò nell'Ottocento",
    superficie: "~300 ettari",
    descrizione: "L'Oltrepò é una delle poche zone italiane dove il Riesling Renano attecchisce bene. Suoli calcarei e escursioni termiche danno vini minerali, freschi, con aciditá vivace e aromi di mela verde e idrocarburo. Vinificato sia secco che con residuo zuccherino.",
    profilo: ["Mela verde", "Agrumi", "Minerale", "Idrocarburo", "Floreale"],
    abbinamenti: ["Pesce", "Crostacei", "Sushi", "Cucina asiatica", "Aperitivo"],
    cantine: ["Vercesi del Castellazzo", "Doria"],
    curiosita: "Il Riesling dell'Oltrepò é l'unico Riesling Renano DOC d'Italia. La zona é cosí adatta che alcuni esperti tedeschi lo considerano superiore a molti Rheingau di livello base.",
  },
  {
    nome: "Cortese",
    tipo: "Bianco",
    denominazione: "Cortese dell'Oltrepò Pavese DOC",
    origine: "Piemonte (Gavi), diffusa in Oltrepò",
    superficie: "~500 ettari",
    descrizione: "Uva bianca piemontese che in Oltrepò produce vini freschi, leggeri, con aciditá vivace e aromi di mela e fiori bianchi. Vino da pasto versatile, bevuto giovane, ottimo come aperitivo o con pesce.",
    profilo: ["Mela", "Fiori bianchi", "Fresco", "Minerale", "Leggero"],
    abbinamenti: ["Pesce crudo", "Antipasti di mare", "Insalate", "Aperitivo"],
    cantine: ["Cantine Giorgi", "Doria", "La Versa"],
    curiosita: "Il Cortese dell'Oltrepò costituisce oltre il 40% dei bianchi fermi del territorio. Meno famoso del cugino piemontese (Gavi DOCG) ma con rapporto qualitá-prezzo nettamente superiore.",
  },
  {
    nome: "Moscato",
    tipo: "Dolce",
    denominazione: "Moscato dell'Oltrepò Pavese DOC",
    origine: "Mediterraneo orientale, diffuso in Oltrepò dal Medioevo",
    superficie: "~600 ettari",
    descrizione: "L'Oltrepò é la zona a vocazione moscata piú importante del Nord Italia. Moscato Bianco (Canelli) vinificato in versione dolce, frizzante e spumante. Aromi intensi di salvia, pesca, agrumi e fiori. Residuo zuccherino marcato, aciditá equilibrata.",
    profilo: ["Salvia", "Pesca", "Fiori", "Agrumi", "Dolce"],
    abbinamenti: ["Dessert", "Torte", "Frutta", "Formaggi erborinati", "Aperitivo dolce"],
    cantine: ["Ca' di Frara", "La Versa"],
    curiosita: "La Versa e Ca' di Frara producono il 70% del Moscato dell'Oltrepò. Il Moscato dell'Oltrepò é tra i pochi vini dolci italiani esportati in Giappone, dove é considerato un vino da cerimonia.",
  },
  {
    nome: "Chardonnay",
    tipo: "Bianco",
    denominazione: "Chardonnay dell'Oltrepò Pavese DOC",
    origine: "Borgogna (Francia), importato in Oltrepò nel XX secolo",
    superficie: "~400 ettari",
    descrizione: "Chardonnay in Oltrepò ha doppia anima: vinificato in acciaio per vini freschi e fruttati, o in legno per versioni strutturate da invecchiamento. Base importante per Metodo Classico spumanti insieme al Pinot Nero.",
    profilo: ["Mela", "Burro", "Vaniglia", "Fiori bianchi", "Minerale"],
    abbinamenti: ["Risotto", "Pesce al forno", "Pollo", "Formaggi freschi"],
    cantine: ["Tenuta Mazzolino", "Castello di Cigognola"],
    curiosita: "Il Chardonnay dell'Oltrepò é la base bianca del Metodo Classico DOCG insieme al Pinot Nero. Le cantine dell'Oltrepò sono tra le poche in Italia a usare Chardonnay coltivato a oltre 200m slm.",
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
            L'Oltrepò Pavese coltiva 10 vitigni principali tra autoctoni e internazionali.
            Il territorio produce il 65% del Pinot Nero italiano, vanta vitigni rarissimi come l'Ughetta di Canneto,
            e ha una tradizione spumantistica che risale al 1850.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { num: "10", label: "Vitigni principali" },
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
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Origine</p>
                    <p className="text-xs text-bordeaux-600">{v.origine}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">Superficie</p>
                    <p className="text-xs text-bordeaux-600">{v.superficie}</p>
                  </div>
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

import { Link } from "react-router-dom";
import { ArrowRight, Grape, MapPin, Mountain, Clock, BookOpen, Landmark, Scroll, Wheat, Wine as WineIcon, Waves, Sun, Calendar, Sparkles } from "lucide-react";

const epoche = [
  {
    periodo: "Età Romana",
    icon: Scroll,
    titolo: "I primi vigneti (I sec. a.C. - V sec. d.C.)",
    testo: "I Romani introdussero la viticoltura sistematica nell'Oltrepò Pavese, sfruttando le colline calcaree a sud del Po. Plinio il Vecchio cita i vini della zona di Pavia nelle sue cronache. I suoli marnosi di origine marina pliocenica, ideali per la vite, erano gia noti agli agronomi romani che li preferivano alle pianure alluvionali.",
  },
  {
    periodo: "Medioevo",
    icon: BookOpen,
    titolo: "Monasteri e viticoltura monastica (V - XV sec.)",
    testo: "I monaci benedettini e cistercensi mantennero viva la tradizione viticola durante i secoli bui. L'Abbazia di Santa Maria della Versa, fondata nel XII secolo, divenne centro di diffusione del Moscato. Il nome 'Oltrepò' ('oltre il Po') appare per la prima volta in documenti del 1164, quando Federico Barbarossa concesse privilegi alla zona.",
  },
  {
    periodo: "1850",
    icon: WineIcon,
    titolo: "Conte Vistarino e l'arrivo del Pinot Nero",
    testo: "Pietro Vistarino, nobile di Casteggio, importò le prime barbatelle di Pinot Nero dalla Borgogna nel 1850, 30 anni prima che la Borgogna stessa lo esportasse nel mondo. Sperimentò anche il Metodo Classico (champenoise) con uve Pinot Nero, facendo dell'Oltrepò la culla italiana dello spumante classico. Oggi l'Oltrepò produce il 65% del Pinot Nero italiano.",
  },
  {
    periodo: "1907",
    icon: Scroll,
    titolo: "Il disciplinare del Buttafuoco Storico",
    testo: "Il Buttafuoco, vino rosso da assemblaggio di uve autoctone (Barbera, Croatina, Uva Rara, Ughetta), ricevette uno dei primi disciplinari d'Italia nel 1907. Solo 12 cantine sono autorizzate a produrre il Buttafuoco Storico, con rese per ettaro tra le piu basse del Paese. Un patrimonio enologico unico.",
  },
  {
    periodo: "1984-2010",
    icon: Landmark,
    titolo: "Le DOC e DOCG",
    testo: "L'Oltrepò Pavese ottiene la DOC nel 1984. Nel 2010 arriva la DOCG per il Metodo Classico (Oltrepò Pavese Metodo Classico DOCG e Cruasé DOCG), prima e unica DOCG italiana a base di Pinot Nero in purezza (min. 70%). Oggi il territorio vanta 7 DOC/DOCG su 13 vitigni principali.",
  },
  {
    periodo: "Oggi",
    icon: Sun,
    titolo: "Capitale del Pinot Nero e del Metodo Classico",
    testo: "Con oltre 3.000 ettari di Pinot Nero, l'Oltrepò e la zona con piu Pinot Nero d'Italia e una delle capitali europee del Metodo Classico. 12 cantine reali, 225 vini catalogati, export in 15+ paesi. La denominazione Cruasé DOCG (rose a base Pinot Nero) e unica al mondo.",
  },
];

const luoghiStorici = [
  { nome: "Casteggio", ruolo: "Culla del Pinot Nero — qui Conte Vistarino piantò le prime barbatelle nel 1850", icon: Mountain },
  { nome: "Santa Maria della Versa", ruolo: "Centro storico del Moscato e sede dell'omonima abbazia benedettina (XII sec.)", icon: BookOpen },
  { nome: "Canneto Pavese", ruolo: "Microzona dell'Ughetta, vitigno rarissimo con meno di 200 ettari al mondo", icon: Grape },
  { nome: "Montù Beccaria", ruolo: "Zona storica del Buttafuoco, suoli calcarei con scheletro", icon: Mountain },
  { nome: "Varzi", ruolo: "Estremo sud dell'Oltrepò, vini di altura, suoli argillosi", icon: Mountain },
  { nome: "Broni-Stradella", ruolo: "Cuore commerciale e logistico, storicamente punto di transito tra Pianura Padana e Appennino", icon: Landmark },
];

const eventi = [
  { titolo: "Vendemmia del Pinot Nero", data: "20 Settembre 2026", luogo: "Casteggio", desc: "Partecipa alla vendemmia del Pinot Nero nei vigneti storici di Conte Vistarino, seguita da degustazione dei mosti." },
  { titolo: "Festa del Buttafuoco Storico", data: "5-6 Ottobre 2026", luogo: "Montù Beccaria", desc: "Due giorni dedicati al Buttafuoco Storico: degustazioni delle 12 cantine autorizzate, abbinamenti con cucina locale." },
  { titolo: "Metodo Classico: Disgorgamento Live", data: "12 Ottobre 2026", luogo: "Santa Maria della Versa", desc: "Dimostrazione di disgorgamento à la volée con degustazione di Cruasé DOCG e Metodo Classico in cantine sotterranee." },
  { titolo: "Moscato & Dolcezza", data: "19 Ottobre 2026", luogo: "Santa Maria della Versa", desc: "Evento dedicato al Moscato DOC: abbinamenti con dessert, formaggi erborinati e pasticceria locale." },
  { titolo: "Notte del Riesling", data: "26 Ottobre 2026", luogo: "Godiasco", desc: "Degustazione verticale di Riesling dell'Oltrepò e confronto con Riesling tedeschi e alsaziani. Cantina Beria e Cabanon." },
  { titolo: "Open Cellars Weekend", data: "9-10 Novembre 2026", luogo: "Tutto il territorio", desc: "14 cantine aprono le porte per visite guidate, degustazioni e incontri con i produttori." },
];

const vitigni = [
  { nome: "Pinot Nero", tipo: "Uva nera", ruolo: "Vitigno simbolo dell'Oltrepò: 3.000 ettari, 65% del Pinot Nero italiano. Base del Metodo Classico DOCG.", colore: "#9b1238" },
  { nome: "Croatina", tipo: "Uva nera", ruolo: "Autoctono, base del Bonarda e del Buttafuoco. Tannini morbidi, colore intenso, frutto di prugna.", colore: "#6b0f2a" },
  { nome: "Barbera", tipo: "Uva nera", ruolo: "Acidità vivace, colore rubino. Usata in blend per Buttafuoco e Sangue di Giuda.", colore: "#a02040" },
  { nome: "Uva Rara", tipo: "Uva nera", ruolo: "Autoctona rara, componente del Buttafuoco. Profumi floreali, tannini setosi.", colore: "#7a1530" },
  { nome: "Ughetta di Canneto", tipo: "Uva nera", ruolo: "Vitigno rarissimo: meno di 200 ettari al mondo, solo a Canneto Pavese. Spezie e pepe nero.", colore: "#4a0a1f" },
  { nome: "Riesling", tipo: "Uva bianca", ruolo: "Coltivato sui suoli marnosi dell'Oltrepò. Mineralità, idrocarburo, acidità brillante.", colore: "#c9a227" },
  { nome: "Cortese", tipo: "Uva bianca", ruolo: "Bianco fresco e minerale, ideale per aperitivi e pesce. DOC Oltrepò Pavese.", colore: "#d4b830" },
  { nome: "Moscato", tipo: "Uva bianca", ruolo: "Centro storico a Santa Maria della Versa. Aromatico, fiori d'acacia, pesca.", colore: "#e6c84c" },
  { nome: "Chardonnay", tipo: "Uva bianca", ruolo: "Usato in blend per Metodo Classico e in purezza. Suoli calcarei dell'Oltrepò.", colore: "#e0cc40" },
  { nome: "Sangue di Giuda", tipo: "Uva nera", ruolo: "Vino dolce frizzante, naturale o forzato. Croatina e Barbera. Raro e tradizionale.", colore: "#8b0a2a" },
  { nome: "Bonarda", tipo: "Uva nera", ruolo: "Vino frizzante secco, Croatina in purezza. Il vino quotidiano dell'Oltrepò.", colore: "#9b1238" },
  { nome: "Buttafuoco", tipo: "Assemblaggio", ruolo: "Blend di Croatina, Barbera, Uva Rara, Ughetta. Solo 12 cantine per lo Storico.", colore: "#7a1020" },
  { nome: "Cruasé", tipo: "Metodo Classico", ruolo: "DOCG rosé a base Pinot Nero (min 70%). Unica al mondo, colore rosa intenso.", colore: "#c9607a" },
];

export default function Territorio() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> Cantina · Oltrepò Pavese
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">Storia del Territorio</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            Duemila anni di viticoltura lungo le colline a sud del Po. Dai Romani ai monaci benedettini,
            da Conte Vistarino alle DOCG moderne: l'Oltrepò Pavese e uno dei territori vitivinicoli
            piu antichi e ricchi d'Italia, con una storia che si intreccia con quella del Pinot Nero
            e del Metodo Classico italiano.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { num: "2000+", label: "Anni di storia" },
            { num: "1850", label: "Primo Pinot Nero" },
            { num: "7", label: "DOC / DOCG" },
            { num: "14", label: "Cantine storiche" },
          ].map((s, i) => (
            <div key={i} className="bg-bordeaux-950 rounded-xl p-4 text-center">
              <p className="font-serif text-2xl text-gold-400">{s.num}</p>
              <p className="text-xs text-cream-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h2 className="font-serif text-xl text-gold-400 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Il Territorio
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" /> Geografia
              </p>
              <p className="text-xs text-cream-200 leading-relaxed">
                L'Oltrepò Pavese occupa la fascia collinare a sud del fiume Po, nella provincia di Pavia (Lombardia).
                Si estende per circa 1.100 km² tra la Pianura Padana e il primo Appennino ligure.
                Altitudini tra 150 e 500 m slm, con esposizioni prevalenti sud-est e sud-ovest.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" /> Il fiume Po
              </p>
              <p className="text-xs text-cream-200 leading-relaxed">
                Il nome 'Oltrepò' significa letteralmente 'oltre il Po': il territorio si trova sulla sponda
                opposta rispetto alla città di Pavia. Il fiume modella il microclima, creando inversioni
                termiche e umidita che favoriscono la freschezza aromatica dei vini.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5" /> Suoli
              </p>
              <p className="text-xs text-cream-200 leading-relaxed">
                Suoli di origine marina pliocenica: calcarei marnosi, argillosi, con scheletro ghiaioso
                nelle zone piu alte. pH alcalino 7.5-8.0, ideale per Pinot Nero e Riesling.
                Mineralita e note di idrocarburo caratteristiche.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" /> Clima
              </p>
              <p className="text-xs text-cream-200 leading-relaxed">
                Clima temperato continentale con influenza appenninica. Escursioni termiche di 15-20°C
                tra giorno e notte in settembre-ottobre. Piovosita 700-900 mm/anno.
                Ventilazione costante che riduce la pressione fungina.
              </p>
            </div>
          </div>
        </div>

        <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold-600" /> Linea del Tempo
        </h2>
        <div className="space-y-4 mb-10">
          {epoche.map((e, i) => (
            <div key={i} className="p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center shrink-0">
                  <e.icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">{e.periodo}</span>
                  </div>
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-2">{e.titolo}</h3>
                  <p className="text-sm text-bordeaux-600 leading-relaxed text-pretty">{e.testo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-600" /> Luoghi Storici
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {luoghiStorici.map((l, i) => (
            <div key={i} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
              <div className="flex items-start gap-3">
                <l.icon className="w-5 h-5 text-bordeaux-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif text-base text-bordeaux-950">{l.nome}</p>
                  <p className="text-xs text-bordeaux-600 mt-1 leading-relaxed">{l.ruolo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-600" /> Eventi del Territorio
        </h2>
        <div className="space-y-3 mb-10">
          {eventi.map((e, i) => (
            <div key={i} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">{e.data}</span>
                    <span className="text-xs text-bordeaux-400">· {e.luogo}</span>
                  </div>
                  <h3 className="font-serif text-base text-bordeaux-950 mb-1">{e.titolo}</h3>
                  <p className="text-xs text-bordeaux-600 leading-relaxed">{e.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
          <Grape className="w-5 h-5 text-gold-600" /> Vitigni del Territorio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {vitigni.map((v, i) => (
            <div key={i} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: v.colore }}>
                  <Grape className="w-4 h-4 text-cream-50" />
                </div>
                <div>
                  <p className="font-serif text-base text-bordeaux-950">{v.nome}</p>
                  <p className="text-[10px] text-bordeaux-400 uppercase tracking-wider">{v.tipo}</p>
                </div>
              </div>
              <p className="text-xs text-bordeaux-600 leading-relaxed">{v.ruolo}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-bordeaux-50 to-gold-50 border border-gold-200">
          <h2 className="font-serif text-xl text-bordeaux-950 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-600" /> Esplora i vitigni del territorio
          </h2>
          <p className="text-sm text-bordeaux-600 mb-4">Scopri i 13 vitigni principali coltivati nell'Oltrepò Pavese, dal Pinot Nero all'Ughetta di Canneto.</p>
          <Link to="/vitigni" className="inline-flex items-center gap-2 text-sm font-medium text-bordeaux-800 hover:text-gold-600 transition-colors">
            Guida ai vitigni <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

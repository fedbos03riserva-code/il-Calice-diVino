import { useState } from "react";
import { FileText, Download, TrendingUp, Users, Wine, DollarSign, Target, Zap, Calendar, Check, BarChart3, FlaskConical, Globe2, MapPin, Mail, Phone, Link2, Lock } from "lucide-react";

const BP_PASSWORD = "BF45invest2026";

export default function BusinessPlan() {
  const [downloading, setDownloading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === BP_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-cream-50 border border-cream-300 shadow-lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <Lock className="w-8 h-8 text-gold-600" />
            </div>
            <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">Business Plan — Riservato</h1>
            <p className="text-sm text-bordeaux-600">Inserisci la password per accedere al documento.</p>
          </div>
          <form onSubmit={handlePwSubmit}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 mb-3"
            />
            {pwError && <p className="text-xs text-red-600 mb-3">Password non corretta.</p>}
            <button type="submit" className="w-full px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors">
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setDownloading(true);
    window.print();
    setTimeout(() => setDownloading(false), 1000);
  };

  const statCards = [
    { icon: Wine, label: "Vini in catalogo", value: "729", sub: "di cui 111 Oltrepò Pavese" },
    { icon: Users, label: "Consumatori vino (IT)", value: "24M", sub: "mercato target B2C" },
    { icon: DollarSign, label: "Export vino IT→JP", value: "€128M", sub: "2024, +12% YoY" },
    { icon: TrendingUp, label: "Wine-tech globale", value: "$2.1B", sub: "2025, CAGR 18.4%" },
  ];

  const territoryStats = [
    { value: "3.000", unit: "ettari", label: "di vigneti coltivati" },
    { value: "65%", unit: "", label: "del vino lombardo" },
    { value: "#1", unit: "Italia", label: "superficie Pinot Nero" },
    { value: "3ª", unit: "Europa", label: "Metodo Classico dopo Champagne e Borgogna" },
    { value: "7", unit: "DOC/DOCG", label: "denominazioni riconosciute" },
    { value: "15+", unit: "paesi", label: "destinazioni export attive" },
  ];

  const denominations = [
    { name: "Oltrepò Pavese Metodo Classico DOCG", type: "DOCG", wines: "Spumante bianco/rosé", grape: "Pinot Nero min. 70%", export: "Giappone, Germania, USA" },
    { name: "Oltrepò Pavese Pinot Nero DOC", type: "DOC", wines: "Rosso", grape: "Pinot Nero 100%", export: "Germania, UK, Svizzera" },
    { name: "Bonarda dell'Oltrepò Pavese DOC", type: "DOC", wines: "Rosso frizzante", grape: "Croatina min. 85%", export: "USA, Svizzera" },
    { name: "Buttafuoco dell'Oltrepò Pavese DOC", type: "DOC", wines: "Rosso fermo", grape: "Croatina, Barbera, Uva Rara, Ughetta", export: "Germania, Belgio" },
    { name: "Sangue di Giuda dell'Oltrepò Pavese DOC", type: "DOC", wines: "Rosso dolce frizzante", grape: "Croatina, Barbera, Uva Rara", export: "USA, Taiwan" },
    { name: "Riesling dell'Oltrepò Pavese DOC", type: "DOC", wines: "Bianco", grape: "Riesling Renano/Italico", export: "Germania, Danimarca" },
    { name: "Moscato dell'Oltrepò Pavese DOC", type: "DOC", wines: "Dolce", grape: "Moscato Bianco", export: "Giappone, Taiwan, Svezia" },
  ];

  const revenueStreams = [
    { name: "B2B SaaS — Ristoranti", desc: "Abbonamenti mensili: Essenziale €49, Professionale €99, Signature €199. Dashboard, QR Menu, Wine Lab, formazione staff.", share: "35%", arr: "€420K" },
    { name: "Export Hub — RFQ & cantine", desc: "Commissione su RFQ chiuse (5-8% del valore ordine), listing cantine premium (€490/anno), catalogo export multilingue.", share: "25%", arr: "€300K" },
    { name: "B2C Premium", desc: "Abbonamenti appassionati: Free, Plus €9/mese, Connoisseur €19/mese. Quiz, Wine Lab, consulenza AI illimitata.", share: "20%", arr: "€240K" },
    { name: "E-commerce vini", desc: "Vendita diretta dal catalogo (margine 15-25%). Dropshipping con cantine partner Oltrepò.", share: "12%", arr: "€144K" },
    { name: "Consulenza & eventi", desc: "Sessioni con sommelier (da €199), eventi Oltrepò Pavese, fiere export, sponsorizzazioni.", share: "8%", arr: "€96K" },
  ];

  const milestones = [
    { phase: "Q4 2025", title: "MVP & soft launch", desc: "Catalogo 729 vini (111 Oltrepò), motore IRC funzionante, 6 lingue (IT/EN/FR/ES/DE/JP). Directory 12 cantine, form RFQ, sito responsive. Primi 500 utenti." },
    { phase: "Q1 2026", title: "Export Hub live", desc: "Onboarding 30 cantine Oltrepò, primi RFQ reali da buyer DE/JP/USA. Partnership Consorzio Tutela Vini Oltrepò Pavese. Presenza ProWein Düsseldorf." },
    { phase: "Q2 2026", title: "B2B scaling", desc: "50 ristoranti pilota, QR Menu attivi, 2.000 utenti B2C. Integrazione Stripe per pagamenti reali. Vinitaly Verona. Primi €15K MRR." },
    { phase: "Q3 2026", title: "Monetizzazione", desc: "5.000 utenti B2C, 200 locali B2B, 10 cantine premium listing. Wine & Gourmet Japan Tokyo. €50K MRR, break-even sui costi variabili." },
    { phase: "Q4 2026", title: "Espansione", desc: "Estensione a Franciacorta e Prosecco. 15.000 utenti, 500 locali, €150K MRR. App mobile (iOS/Android). Primi ordini export >€100K." },
    { phase: "Q1-Q2 2027", title: "Serie A", desc: "€1.5M raise a valutazione €8-12M. Espansione Europa (FR, DE, ES). Team 15 persone. €300K MRR." },
  ];

  const competitors = [
    { name: "Vivino", strength: "Community 60M utenti, recensioni", weakness: "Niente abbinamenti scientifici, no B2B, no export hub" },
    { name: "Wine-Searcher", strength: "Database prezzi globale", weakness: "Solo ricerca prezzi, no consulenza, no abbinamenti" },
    { name: "VINOAPP", strength: "Abbinamenti base in IT", weakness: "No motore molecolare, no export, no multilingua" },
    { name: "TradeGecko/Tradeshift", strength: "B2B trade platform", weakness: "Niente vino, niente abbinamenti, no consumer" },
  ];

  const team = [
    { role: "CEO / Founder", desc: "Visione prodotto, partnerships cantine e Consorzio, strategia go-to-market e export" },
    { role: "CTO", desc: "Architettura, motore IRC, AI/ML, scaling infrastruttura cloud, sicurezza dati" },
    { role: "Head of Wine & Territory", desc: "Sommelier AIS certificato, relazioni produttori Oltrepò, selezione vini, fiere" },
    { role: "Head of Export & B2B", desc: "Acquisizione ristoranti, onboarding cantine, gestione RFQ, customer success" },
    { role: "Consulente enologico", desc: "Professore universitario enologia, validazione scientifica motore IRC" },
  ];

  const ask = [
    { label: "Round", value: "Pre-seed / Seed" },
    { label: "Importo richiesto", value: "€ 500.000" },
    { label: "Valutazione pre-money", value: "€ 3.000.000" },
    { label: "Runway", value: "18 mesi (fino a Q1 2027)" },
    { label: "Sviluppo prodotto & AI", value: "35% (€175K)" },
    { label: "Sales, marketing & fiere", value: "30% (€150K)" },
    { label: "Catalogo, cantine & export", value: "20% (€100K)" },
    { label: "Operativo, legale & conformità", value: "15% (€75K)" },
  ];

  const contacts = [
    { icon: Mail, label: "Email investitori", value: "invest@bf45wine.com" },
    { icon: Phone, label: "Telefono", value: "+39 0385 000 000" },
    { icon: MapPin, label: "Sede", value: "Pavia, Oltrepò Pavese, Italia" },
    { icon: Link2, label: "LinkedIn", value: "linkedin.com/company/bf45wine" },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .bp-page { page-break-after: always; }
          .bp-nobreak { page-break-inside: avoid; }
          body { background: white !important; }
          .bp-card { border: 1px solid #ddd !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="no-print sticky top-16 z-40 bg-bordeaux-950 border-b border-gold-700/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-400" />
            <span className="text-sm text-cream-200 font-medium">Business Plan — B&F 45</span>
          </div>
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm disabled:opacity-50">
            <Download className="w-4 h-4" /> {downloading ? "Preparazione..." : "Scarica PDF"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12 print:py-8">

        {/* COVER PAGE */}
        <div className="bp-page mb-16">
          <div className="text-center pt-16 pb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Wine className="w-12 h-12 text-bordeaux-800" />
              <span className="font-serif text-4xl font-bold text-bordeaux-950">B<span className="text-gold-600">&amp;</span>F <span className="text-gold-600">45</span></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950 mb-3">Business Plan</h1>
            <p className="text-lg text-bordeaux-600 mb-2">Intelligent Wine Pairing & Export Hub</p>
            <p className="text-sm text-bordeaux-500 mb-10">Documento riservato — destinato a investitori · Settembre 2026 · v2.0</p>

            <div className="max-w-3xl mx-auto p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200 text-left mb-8">
              <p className="text-sm font-serif text-bordeaux-950 mb-3 leading-relaxed">
                Il portale di riferimento per l'export dei vini dell'Oltrepò Pavese
              </p>
              <p className="text-xs text-bordeaux-600 leading-relaxed">
                L'Oltrepò Pavese è il cuore vitivinicolo della Lombardia: 3.000 ettari di vigneti, 7 denominazioni DOC/DOCG,
                65% del vino lombardo, la maggiore superficie a Pinot Nero in Italia, terza regione europea per Metodo Classico
                dopo Champagne e Borgogna. La viticoltura qui ha origine preromane; nel 1850 il Conte Vistarino introdusse il
                Pinot Nero, facendo dell'Oltrepò la culla italiana del Metodo Classico. Oggi le cantine esportano in 15+ paesi,
                ma manca un portale digitale che le metta in contatto diretto con buyer internazionali. B&F 45 colma questo vuoto:
                motore di abbinamento AI, directory export-ready, sistema RFQ multilingue, materiali B2B per fiere internazionali.
              </p>
            </div>

            <div className="inline-block px-6 py-3 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-sm text-bordeaux-700"><strong>Data:</strong> Settembre 2026</p>
              <p className="text-sm text-bordeaux-700"><strong>Versione:</strong> 2.0</p>
              <p className="text-sm text-bordeaux-700"><strong>Round:</strong> Pre-seed / Seed · €500K</p>
            </div>
          </div>
        </div>

        {/* IL TERRITORIO */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gold-600" /> L'Oltrepò Pavese
          </h2>
          <div className="space-y-4 text-sm text-bordeaux-800 leading-relaxed mb-6">
            <p>
              L'Oltrepò Pavese è una zona collinare a sud di Pavia, al confine con Emilia-Romagna e Piemonte.
              Le colline calcaree, l'esposizione sud-est e il microclima la rendono una delle zone vitivinicole
              più vocate d'Italia. La vite qui si coltiva da prima dei Romani: ritrovamenti archeologici
              documentano anfore vinarie del II secolo a.C.
            </p>
            <p>
              Nel <strong>1850</strong>, il Conte Augusto Giorgi di Vistarino piantò i primi cloni di Pinot Nero
              in Italia, importati direttamente dalla Borgogna. L'esperimento riuscì: il Pinot Nero trovò
              nell'Oltrepò un terroir perfetto, e da qui nacque il <strong>Metodo Classico italiano</strong>,
              molto prima di Franciacorta. Oggi l'Oltrepò Pavese è la <strong>terza regione europea per Metodo
              Classico dopo Champagne e Borgogna</strong>, e la <strong>prima in Italia per superficie a Pinot Nero</strong>.
            </p>
            <p>
              Il territorio conta <strong>~1.500 cantine</strong> attive, di cui oltre 200 imbottigliatrici,
              per una produzione di circa <strong>500.000 ettolitri/anno</strong> — il 65% di tutto il vino lombardo.
              Le denominazioni DOC/DOCG sono 7, con vitigni autoctoni unici: Croatina (Bonarda), Uva Rara, Ughetta,
              oltre a Pinot Nero, Barbera, Riesling, Moscato e Cortese.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {territoryStats.map((s) => (
              <div key={s.label} className="bp-card bp-nobreak p-4 rounded-xl bg-bordeaux-950 text-cream-100 text-center">
                <p className="font-serif text-3xl text-gold-400">{s.value}</p>
                <p className="text-xs text-cream-300">{s.unit}</p>
                <p className="text-xs text-cream-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-4">Denominazioni DOC/DOCG e export</h3>
            <div className="space-y-2">
              {denominations.map((d) => (
                <div key={d.name} className="grid grid-cols-12 gap-2 text-xs pb-2 border-b border-cream-200 last:border-0 items-center">
                  <div className="col-span-12 md:col-span-4 font-semibold text-bordeaux-950">{d.name}</div>
                  <div className="col-span-3 md:col-span-2">
                    <span className="px-2 py-0.5 rounded-full bg-bordeaux-700 text-cream-50 text-[10px]">{d.type}</span>
                  </div>
                  <div className="col-span-4 md:col-span-3 text-bordeaux-600">{d.grape}</div>
                  <div className="col-span-5 md:col-span-3 text-bordeaux-500 flex items-center gap-1">
                    <Globe2 className="w-3 h-3" /> {d.export}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IL MOTORE AI */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-gold-600" /> Il Motore IRC
          </h2>
          <div className="space-y-4 text-sm text-bordeaux-800 leading-relaxed mb-6">
            <p>
              Il <strong>motore IRC (Indice di Risonanza Chimica)</strong> è il cuore proprietario di B&F 45.
              E un algoritmo di scoring che analizza le caratteristiche chimico-fisiche di un vino e le confronta
              con quelle sensoriali di un piatto, producendo un punteggio di abbinamento da 0 a 100.
            </p>
            <p>
              <strong>Come funziona:</strong> ogni vino del catalogo ha una scheda tecnica con 7 parametri
              (acidita, tannini, corpo, gradazione alcolica, residuo zuccherino, profilo aromatico, tipo).
              Quando l'utente inserisce un piatto, il motore analizza 4 dimensioni:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-bordeaux-800 text-gold-400 font-bold flex items-center justify-center text-sm">40</span>
                <h3 className="font-serif text-base text-bordeaux-950">Chimica (0-40)</h3>
              </div>
              <p className="text-xs text-bordeaux-600">Matching acidita-piatto, tannini-proteine, zuccheri-dolcezza. La componente piu pesante: l'acidita del vino deve bilanciare il grasso del piatto, i tannini legano le proteine della carne, gli zuccheri bilanciano i dessert.</p>
            </div>
            <div className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-bordeaux-800 text-gold-400 font-bold flex items-center justify-center text-sm">25</span>
                <h3 className="font-serif text-base text-bordeaux-950">Aromatico (0-25)</h3>
              </div>
              <p className="text-xs text-bordeaux-600">Complementarieta dei profili aromatici: piatti erbacei con vini erbacei, piatti speziati con vini speziati, pesce con note minerali/citrus, funghi con note terrose.</p>
            </div>
            <div className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-bordeaux-800 text-gold-400 font-bold flex items-center justify-center text-sm">20</span>
                <h3 className="font-serif text-base text-bordeaux-950">Struttura (0-20)</h3>
              </div>
              <p className="text-xs text-bordeaux-600">Corpo del vino vs intensita del piatto. Un Brasato richiede un corpo pieno, un'insalata un corpo leggero. La gradazione alcolica modula il calore percepito.</p>
            </div>
            <div className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-bordeaux-800 text-gold-400 font-bold flex items-center justify-center text-sm">15</span>
                <h3 className="font-serif text-base text-bordeaux-950">Pulizia palato (0-15)</h3>
              </div>
              <p className="text-xs text-bordeaux-600">Capacita del vino di pulire il palato tra un boccone e l'altro: acidita per i grassi, bollicine per le fritture, tannini per le proteine. Penalizza abbinamenti sconsigliati.</p>
            </div>
          </div>

          <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-3">Roadmap tecnica del motore</h3>
            <div className="space-y-3 text-sm text-bordeaux-800">
              <div className="flex gap-3">
                <span className="text-gold-600 font-bold shrink-0">v1.0</span>
                <span><strong>Rules-based scoring</strong> (già in produzione): 7 parametri vino, 4 dimensioni, 12 keyword categories per piatto. 729 vini scored in &lt;50ms.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-600 font-bold shrink-0">v2.0</span>
                <span><strong>ML enhancement</strong> (Q1 2026): addestramento su 10.000+ abbinamenti validati da sommelier AIS. Modello di regressione per affinare i pesi delle 4 dimensioni in base al tipo di cucina.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-600 font-bold shrink-0">v3.0</span>
                <span><strong>LLM integration</strong> (Q3 2026): GPT-4 per interpretare piatti a testo libero ("risotto allo zafferano con pollo e verdure"), estrarre ingredienti e mapparli alle keyword del motore.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-600 font-bold shrink-0">v4.0</span>
                <span><strong>Personalizzazione</strong> (Q4 2026): il motore impara dalle preferenze dell'utente (quiz del gusto, storico ricerche, recensioni) e personalizza i punteggi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-gold-600" /> Executive Summary
          </h2>
          <div className="space-y-4 text-sm text-bordeaux-800 leading-relaxed">
            <p>
              <strong>B&F 45</strong> e una piattaforma wine-tech con un doppio asset: il <strong>motore di abbinamento IRC</strong>
              (scienza molecolare per abbinare vini e piatti con precisione misurabile) e l'<strong>Export Hub dell'Oltrepò Pavese</strong>
              (directory cantine, form RFQ multilingue, materiali B2B per fiere internazionali).
            </p>
            <p>
              Il catalogo conta <strong>729 vini</strong>, di cui <strong>111 dell'Oltrepò Pavese</strong> — la piu grande
              selezione dedicata a questo territorio. 12 cantine reali in directory con filtri export (certificazioni,
              MOQ, FOB, incoterms, lingue team). 6 lingue: IT, EN, FR, ES, DE, JP.
            </p>
            <p>
              Il modello unisce <strong>SaaS B2B</strong> (ristoranti: €49-€199/mese), <strong>Export Hub</strong>
              (commissioni RFQ + listing cantine), <strong>freemium B2C</strong> (€0-€19/mese), e-commerce e consulenza.
              Il mercato wine-tech globale e <strong>$2.1B nel 2025</strong> (CAGR 18.4%). L'export vino IT→JP vale
              <strong> €128M</strong> (+12% YoY), con crescente domanda di vini autoctoni italiani.
            </p>
            <p>
              <strong>Chiediamo €500.000</strong> per 18 mesi di runway. Obiettivi: 15.000 utenti B2C, 500 locali B2B,
              30 cantine in directory, €150K MRR entro fine 2026. Break-even Q4 2027.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {statCards.map((s) => (
              <div key={s.label} className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
                <s.icon className="w-6 h-6 text-gold-600 mb-2" />
                <p className="font-serif text-2xl text-bordeaux-950">{s.value}</p>
                <p className="text-xs font-medium text-bordeaux-700">{s.label}</p>
                <p className="text-xs text-bordeaux-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROBLEM & SOLUTION */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-gold-600" /> Problema & Soluzione
          </h2>
          <div className="space-y-6">
            <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-3">Il problema</h3>
              <ul className="space-y-2 text-sm text-bordeaux-800">
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>Il 68% dei consumatori sceglie il vino per prezzo o etichetta, non per abbinamento. Risultato: esperienze deludenti.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>I ristoranti hanno carte vini generiche, mal abbinamate al menu, con margini bassi e personale non formato.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>Le cantine dell'Oltrepò Pavese producono vini eccellenti ma faticano a raggiungere buyer internazionali: mancano strumenti digitali export-ready.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>Le app esistenti (Vivino, Wine-Searcher) offrono recensioni e prezzi, ma nessuna fa abbinamenti scientifici o gestisce RFQ export.</span></li>
              </ul>
            </div>
            <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-3">La soluzione: B&F 45</h3>
              <ul className="space-y-2 text-sm text-bordeaux-800">
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Motore IRC:</strong> punteggio 0-100 basato su 4 dimensioni chimico-sensoriali. Funziona in tempo reale su 729 vini.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Export Hub:</strong> directory cantine con filtri export, form RFQ multilingue, badge "Export Ready", materiali B2B per fiere.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Focus Oltrepò Pavese:</strong> 111 vini, 12 cantine reali, 7 denominazioni DOC/DOCG. Primo portale dedicato a questo territorio.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>B2B SaaS:</strong> dashboard ristoranti, QR Menu con abbinamenti AI, Wine Lab per varianti di ricetta, formazione staff.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>6 lingue:</strong> IT, EN, FR, ES, DE, JP — pronto per export in Europa e Asia.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* MERCATO */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-gold-600" /> Mercato
          </h2>
          <div className="space-y-6">
            <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-4">Dimensioni del mercato</h3>
              <div className="space-y-3 text-sm text-bordeaux-800">
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Mercato globale del vino</span>
                  <span className="font-semibold text-bordeaux-950">$340B (2025)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Mercato wine-tech globale</span>
                  <span className="font-semibold text-bordeaux-950">$2.1B (2025, CAGR 18.4%)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Export vino Italia (totale)</span>
                  <span className="font-semibold text-bordeaux-950">€7.8B (2024)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Export vino IT → Giappone</span>
                  <span className="font-semibold text-bordeaux-950">€128M (2024, +12% YoY)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Export vino IT → Germania</span>
                  <span className="font-semibold text-bordeaux-950">€1.1B (2024, #1 mercato)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Mercato vino Italia (domestico)</span>
                  <span className="font-semibold text-bordeaux-950">€9.5B (2025)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Ristoranti in Italia</span>
                  <span className="font-semibold text-bordeaux-950">~230.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cantine Oltrepò Pavese attive</span>
                  <span className="font-semibold text-bordeaux-950">~1.500 (200+ imbottigliatrici)</span>
                </div>
              </div>
            </div>

            <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-4">Competizione</h3>
              <div className="space-y-3">
                {competitors.map((c) => (
                  <div key={c.name} className="grid grid-cols-3 gap-4 text-sm pb-3 border-b border-cream-200 last:border-0">
                    <div className="font-semibold text-bordeaux-950">{c.name}</div>
                    <div className="text-bordeaux-700"><span className="text-xs text-bordeaux-500 block">Forza</span>{c.strength}</div>
                    <div className="text-bordeaux-700"><span className="text-xs text-bordeaux-500 block">Debolezza</span>{c.weakness}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                <p className="text-sm text-bordeaux-800"><strong>Vantaggio competitivo:</strong> unico con motore molecolare IRC + export hub territoriale + modello B2B+B2C integrato + 6 lingue. Nessun competitor unisce abbinamento scientifico e export B2B.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BUSINESS MODEL */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-gold-600" /> Modello di Business
          </h2>
          <div className="space-y-4">
            {revenueStreams.map((r) => (
              <div key={r.name} className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-bordeaux-800 flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg font-bold text-gold-400">{r.share}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base text-bordeaux-950">{r.name}</h3>
                  <p className="text-sm text-bordeaux-600">{r.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-bordeaux-400">ARR target</p>
                  <p className="font-serif text-lg text-bordeaux-950">{r.arr}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-3">Proiezioni MRR (18 mesi)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-bordeaux-500">Q1 2026</p><p className="font-serif text-xl text-bordeaux-950">€8K</p></div>
              <div><p className="text-xs text-bordeaux-500">Q2 2026</p><p className="font-serif text-xl text-bordeaux-950">€25K</p></div>
              <div><p className="text-xs text-bordeaux-500">Q3 2026</p><p className="font-serif text-xl text-bordeaux-950">€50K</p></div>
              <div><p className="text-xs text-bordeaux-500">Q4 2026</p><p className="font-serif text-xl text-bordeaux-950">€150K</p></div>
            </div>
            <p className="text-xs text-bordeaux-500 mt-3">Break-even previsto: Q4 2027. Margine lordo: 72% SaaS, 25% export hub, 18% e-commerce. CAC stimato: €12 B2C, €180 B2B. LTV: €45 B2C, €2.400 B2B.</p>
          </div>
        </div>

        {/* ROADMAP */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gold-600" /> Roadmap
          </h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={m.phase} className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300 flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-bordeaux-800 flex items-center justify-center text-gold-400 font-bold text-sm">{i + 1}</div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-full bg-cream-300 mt-2" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider">{m.phase}</p>
                  <h3 className="font-serif text-base text-bordeaux-950 mt-0.5">{m.title}</h3>
                  <p className="text-sm text-bordeaux-600 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div className="bp-page mb-16">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-600" /> Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((m) => (
              <div key={m.role} className="bp-card bp-nobreak p-5 rounded-xl bg-cream-50 border border-cream-300">
                <h3 className="font-serif text-base text-bordeaux-950">{m.role}</h3>
                <p className="text-sm text-bordeaux-600 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* THE ASK & CONTACTS */}
        <div className="bp-page mb-8">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-600" /> La richiesta
          </h2>
          <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-950 text-cream-100 mb-6">
            <div className="space-y-3">
              {ask.map((a) => (
                <div key={a.label} className="flex justify-between items-center pb-3 border-b border-gold-700/20 last:border-0">
                  <span className="text-sm text-cream-300">{a.label}</span>
                  <span className="font-serif text-base text-gold-400">{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300 mb-6">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-4">Come contattarci</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <c.icon className="w-5 h-5 text-gold-600 shrink-0" />
                  <div>
                    <p className="text-xs text-bordeaux-500">{c.label}</p>
                    <p className="text-sm font-medium text-bordeaux-950">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200 mb-6">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-3">Strategia di contatto investitori</h3>
            <ul className="space-y-2 text-sm text-bordeaux-800">
              <li className="flex gap-2"><span className="text-gold-600 shrink-0">1.</span> <span><strong>Angel list e VC italiani:</strong> CDP Venture Capital (Milano), Primo Ventures, United Ventures, P101 Ventures. Pitch deck + questo business plan.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 shrink-0">2.</span> <span><strong>Acceleratori:</strong> Techstars Food & Beverage, Y Combinator (batch 2026), LUMENT (Cassa Depositi e Prestiti).</span></li>
              <li className="flex gap-2"><span className="text-gold-600 shrink-0">3.</span> <span><strong>Consorzio e territorio:</strong> Consorzio Tutela Vini Oltrepò Pavese, Camera di Commercio Pavia, Regione Lombardia (bandi wine-tech).</span></li>
              <li className="flex gap-2"><span className="text-gold-600 shrink-0">4.</span> <span><strong>Export & Giappone:</strong> ICE-Agency Tokyo, JETRO Milano, fiera Wine & Gourmet Japan (ottobre 2026).</span></li>
              <li className="flex gap-2"><span className="text-gold-600 shrink-0">5.</span> <span><strong>Network:</strong> LinkedIn outreach a partner VC, partecipazione a Vinitaly e ProWein per incontri B2B con investitori del settore wine.</span></li>
            </ul>
          </div>

          <div className="text-center pt-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Wine className="w-6 h-6 text-bordeaux-800" />
              <span className="font-serif text-xl font-bold text-bordeaux-950">B<span className="text-gold-600">&amp;</span>F <span className="text-gold-600">45</span></span>
            </div>
            <p className="text-xs text-bordeaux-500">La scienza del vino, al servizio del gusto e del territorio.</p>
            <p className="text-xs text-bordeaux-400 mt-2">Documento riservato — non distribuire senza autorizzazione</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { FileText, Download, TrendingUp, Users, Wine, DollarSign, Target, Zap, Calendar, Check, BarChart3 } from "lucide-react";

export default function BusinessPlan() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    window.print();
    setTimeout(() => setDownloading(false), 1000);
  };

  const statCards = [
    { icon: Wine, label: "Vini in catalogo", value: "729", sub: "di cui 111 Oltrepò Pavese" },
    { icon: Users, label: "Mercato potenziale (IT)", value: "24M", sub: "consumatori di vino" },
    { icon: DollarSign, label: "Mercato globale vino", value: "$340B", sub: "2025, CAGR 5.8%" },
    { icon: TrendingUp, label: "Mercato wine-tech", value: "$2.1B", sub: "2025, CAGR 18.4%" },
  ];

  const revenueStreams = [
    { name: "B2C Premium", desc: "Abbonamenti mensili per appassionati (Free, Plus €9, Connoisseur €19)", share: "30%" },
    { name: "B2B SaaS", desc: "Abbonamenti mensili per ristoranti (Essenziale €49, Professionale €99, Signature €199)", share: "45%" },
    { name: "Consulenza umana", desc: "Sessioni con sommelier esperto a partire da €199", share: "10%" },
    { name: "E-commerce vini", desc: "Vendita diretta vini dal catalogo (margine 15-25%)", share: "10%" },
    { name: "Eventi & fiere", desc: "Organizzazione eventi Oltrepò Pavese, sponsorizzazioni cantine", share: "5%" },
  ];

  const milestones = [
    { phase: "Q1 2026", title: "MVP & lancio", desc: "Catalogo 700+ vini, motore IRC funzionante, 5 lingue, app web responsive. Primi 500 utenti registrati." },
    { phase: "Q2 2026", title: "B2B onboarding", desc: "Dashboard ristoranti, QR Menu, 50 locali pilota nell'Oltrepò Pavese. Partnership con Consorzio Tutela Vini Oltrepò Pavese." },
    { phase: "Q3 2026", title: "Crescita & monetizzazione", desc: "5.000 utenti B2C, 200 locali B2B, primi €50K MRR. Integrazione pagamento reale (Stripe)." },
    { phase: "Q4 2026", title: "Espansione territoriale", desc: "Estensione a Franciacorta, Prosecco, Chianti. 15.000 utenti, 500 locali, €150K MRR." },
    { phase: "Q1-Q2 2027", title: "Serie A", desc: "€1.5M raise a valutazione €8-10M. Espansione Europa (FR, DE, ES). App mobile nativa." },
  ];

  const competitors = [
    { name: "Vivino", strength: "Community & recensioni", weakness: "Niente abbinamenti scientifici, no B2B" },
    { name: "Wine-Searcher", strength: "Database prezzi globale", weakness: "Solo ricerca, no consulenza, no B2B" },
    { name: "Sommelier apps", strength: "Consigli generali", weakness: "Niente motore molecolare, no catalogo vendibile" },
  ];

  const team = [
    { role: "CEO / Founder", desc: "Visione prodotto, partnerships cantine, strategia go-to-market" },
    { role: "CTO", desc: "Architettura, motore IRC, AI/ML, scaling infrastruttura" },
    { role: "Head of Wine", desc: "Sommelier certificato, selezione vini, relazioni produttori" },
    { role: "Head of B2B Sales", desc: "Acquisizione ristoranti, onboarding, customer success" },
  ];

  const ask = [
    { label: "Round", value: "Pre-seed / Seed" },
    { label: "Importo richiesto", value: "€ 500.000" },
    { label: "Valutazione pre-money", value: "€ 3.000.000" },
    { label: "Runway", value: "18 mesi" },
    { label: "Uso fondi — Sviluppo prodotto", value: "40% (€200K)" },
    { label: "Uso fondi — Sales & marketing", value: "35% (€175K)" },
    { label: "Uso fondi — Catalogo & inventory", value: "15% (€75K)" },
    { label: "Uso fondi — Operativo & legale", value: "10% (€50K)" },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Print-only styles */}
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
          <div className="text-center pt-20 pb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Wine className="w-12 h-12 text-bordeaux-800" />
              <span className="font-serif text-4xl font-bold text-bordeaux-950">B<span className="text-gold-600">&amp;</span>F <span className="text-gold-600">45</span></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950 mb-4">Business Plan</h1>
            <p className="text-lg text-bordeaux-600 mb-2">Intelligent Wine Pairing & Curated Cellar</p>
            <p className="text-sm text-bordeaux-500 mb-12">Documento riservato — destinato a investitori</p>
            <div className="inline-block px-6 py-3 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
              <p className="text-sm text-bordeaux-700"><strong>Data:</strong> Settembre 2026</p>
              <p className="text-sm text-bordeaux-700"><strong>Versione:</strong> 1.0</p>
              <p className="text-sm text-bordeaux-700"><strong>Round:</strong> Pre-seed / Seed</p>
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
              <strong>B&F 45</strong> e una piattaforma wine-tech che combina scienza molecolare e intelligenza artificiale
              per abbinare vini e piatti con precisione misurabile. Il motore proprietario IRC (Indice di Risonanza Chimica)
              analizza acidita, tannini, corpo e profilo aromatico di ogni vino e li confronta con le caratteristiche
              chimico-sensoriali del piatto, producendo un punteggio di abbinamento da 0 a 100.
            </p>
            <p>
              Il catalogo conta <strong>729 vini</strong>, di cui <strong>111 dell'Oltrepò Pavese</strong> — la piu grande
              selezione dedicata a questo territorio su qualsiasi piattaforma. L'Oltrepò Pavese e il primo territorio
              verticale: Bonarda, Buttafuoco, Sangue di Giuda, Pinot Nero, Metodo Classico DOCG, Riesling, Barbera, Moscato.
            </p>
            <p>
              Il modello di business e <strong>freemium B2C + SaaS B2B</strong>: abbonamenti mensili per appassionati
              (da €0 a €19/mese) e per ristoranti (da €49 a €199/mese), con revenue addizionali da consulenza umana,
              e-commerce vini ed eventi. Il mercato wine-tech globale e stimato in <strong>$2.1B nel 2025</strong> con
              un CAGR del 18.4%.
            </p>
            <p>
              <strong>Chiediamo €500.000</strong> in round pre-seed/seed per 18 mesi di runway, con l'obiettivo di
              raggiungere 15.000 utenti B2C e 500 locali B2B entro fine 2026, e €150K MRR.
            </p>
          </div>

          {/* Key stats */}
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
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>Il consumatore medio non sa quale vino abbinare a un piatto: il 68% sceglie per prezzo o etichetta, non per abbinamento.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>I ristoranti hanno carte vini generiche, mal abbinamate al menu, con margini bassi e personale non formato.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>I piccoli territori vitivinicoli (come l'Oltrepò Pavese) faticano a emergere: mancano strumenti digitali per promuovere le loro denominazioni.</span></li>
                <li className="flex gap-2"><span className="text-gold-600 shrink-0">•</span> <span>Le app esistenti (Vivino, Wine-Searcher) offrono recensioni e prezzi, ma nessuna fa abbinamenti scientifici.</span></li>
              </ul>
            </div>
            <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-3">La soluzione: B&F 45</h3>
              <ul className="space-y-2 text-sm text-bordeaux-800">
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Motore IRC:</strong> analisi chimico-molecolare che produce un punteggio 0-100 per ogni abbinamento vino-piatto, basato su 4 componenti (aromatica, struttura, pulizia palato, meccanismo chimico).</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Catalogo curato:</strong> 729 vini con schede tecniche complete (gradazione, acidita, tannini, corpo, residuo zuccherino, profilo aromatico, abbinamenti consigliati).</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Focus territoriale:</strong> 111 vini dell'Oltrepò Pavese, prima piattaforma a dedicare una selezione cosi ampia a questo territorio.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>B2B SaaS:</strong> dashboard ristoranti, QR Menu con abbinamenti AI, Wine Lab per testare varianti di ricetta, formazione staff.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>5 lingue:</strong> italiano, inglese, francese, spagnolo, tedesco — pronto per il mercato europeo.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* MARKET */}
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
                  <span>Mercato wine-tech</span>
                  <span className="font-semibold text-bordeaux-950">$2.1B (2025, CAGR 18.4%)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Mercato vino Italia</span>
                  <span className="font-semibold text-bordeaux-950">€9.5B (2025)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                  <span>Ristoranti in Italia</span>
                  <span className="font-semibold text-bordeaux-950">~230.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Oltrepò Pavese: cantine attive</span>
                  <span className="font-semibold text-bordeaux-950">~1.500</span>
                </div>
              </div>
            </div>

            <div className="bp-card bp-nobreak p-6 rounded-xl bg-cream-50 border border-cream-300">
              <h3 className="font-serif text-lg text-bordeaux-900 mb-4">Competizione</h3>
              <div className="space-y-3">
                {competitors.map((c) => (
                  <div key={c.name} className="grid grid-cols-3 gap-4 text-sm pb-3 border-b border-cream-200 last:border-0">
                    <div className="font-semibold text-bordeaux-950">{c.name}</div>
                    <div className="text-bordeaux-700"><span className="text-xs text-bordeaux-500 block">Punto di forza</span>{c.strength}</div>
                    <div className="text-bordeaux-700"><span className="text-xs text-bordeaux-500 block">Debolezza</span>{c.weakness}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                <p className="text-sm text-bordeaux-800"><strong>Vantaggio competitivo B&F 45:</strong> unico con motore molecolare IRC, focus territoriale Oltrepò Pavese, modello B2B+B2C integrato, 5 lingue.</p>
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
                <div>
                  <h3 className="font-serif text-base text-bordeaux-950">{r.name}</h3>
                  <p className="text-sm text-bordeaux-600">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <h3 className="font-serif text-lg text-bordeaux-900 mb-3">Proiezioni finanziarie (18 mesi)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-bordeaux-500">MRR Q2 2026</p><p className="font-serif text-xl text-bordeaux-950">€15K</p></div>
              <div><p className="text-xs text-bordeaux-500">MRR Q3 2026</p><p className="font-serif text-xl text-bordeaux-950">€50K</p></div>
              <div><p className="text-xs text-bordeaux-500">MRR Q4 2026</p><p className="font-serif text-xl text-bordeaux-950">€150K</p></div>
              <div><p className="text-xs text-bordeaux-500">MRR Q2 2027</p><p className="font-serif text-xl text-bordeaux-950">€300K</p></div>
            </div>
            <p className="text-xs text-bordeaux-500 mt-3">Break-even previsto: Q4 2027. Margine lordo stimato 72% su SaaS, 18% su e-commerce.</p>
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

        {/* THE ASK */}
        <div className="bp-page mb-8">
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-600" /> La richiesta
          </h2>
          <div className="bp-card bp-nobreak p-6 rounded-xl bg-bordeaux-950 text-cream-100">
            <div className="space-y-3">
              {ask.map((a) => (
                <div key={a.label} className="flex justify-between items-center pb-3 border-b border-gold-700/20 last:border-0">
                  <span className="text-sm text-cream-300">{a.label}</span>
                  <span className="font-serif text-base text-gold-400">{a.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gold-700/30">
              <p className="text-sm text-cream-300">
                <strong className="text-gold-400">Contatti:</strong> invest@bf45wine.com · +39 02 0000 0000 · Pavia, Italia
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <Wine className="w-6 h-6 text-bordeaux-800" />
              <span className="font-serif text-xl font-bold text-bordeaux-950">B<span className="text-gold-600">&amp;</span>F <span className="text-gold-600">45</span></span>
            </div>
            <p className="text-xs text-bordeaux-500">La scienza del vino, al servizio del gusto.</p>
            <p className="text-xs text-bordeaux-400 mt-2">Documento riservato — non distribuire senza autorizzazione</p>
          </div>
        </div>
      </div>
    </div>
  );
}

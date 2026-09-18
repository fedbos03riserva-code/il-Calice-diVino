import { Link } from "react-router-dom";
import { Zap, FileText, Building2, Map as MapIcon, Package, FileSpreadsheet, ArrowRight, Sparkles, Brain } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ExportGuide() {
  const { t } = useApp();

  const functions = [
    {
      icon: Zap,
      to: "/ai-matching",
      title: "AI Matching Cantine",
      what: "Il buyer descrive cosa cerca (tipo di vino, volume, mercato di destinazione, budget) e l'AI trova le cantine dell'Oltrepò Pavese piu adatte, con un punteggio di compatibilita.",
      why: "Un buyer estero non conosce le cantine locali. L'AI legge la richiesta in linguaggio naturale e abbinamento le cantine per capacita produttiva, certificazioni, MOQ, FOB e incoterms. Riduce il tempo da settimane di ricerca a pochi secondi, e suggerisce cantine che il buyer non avrebbe considerato.",
      badge: "AI",
    },
    {
      icon: FileText,
      to: "/rfq",
      title: "RFQ — Request for Quotation",
      what: "Form strutturato per inviare una richiesta di preventivo formale a una o piu cantine: paese di destinazione, volume, tipologia, budget, incoterm, note.",
      why: "Il RFQ standardizza le richieste. Le cantine ricevono tutti i dati necessari per quotare senza scambi email lunghi. Ogni richiesta viene salvata nel database e tracciata, cosi nessuna opportunita di export viene persa.",
    },
    {
      icon: Building2,
      to: "/cantine",
      title: "Directory Cantine",
      what: "Elenco completo delle cantine dell'Oltrepò Pavese con filtri per certificazioni, lingue parlate dal team, export readiness. Scheda dettagliata con ettari, capacita, denominazioni, MOQ, FOB, paesi serviti, QR code scaricabile.",
      why: "Il buyer puo esplorare autonomamente le cantine, filtrare per cio che gli serve (es. solo cantine bio che parlano inglese e gia esportano in USA) e contattarle direttamente. La directory e lo showcase del territorio: piu cantine sono visibili, piu opportunita di export si creano.",
    },
    {
      icon: MapIcon,
      to: "/mappa",
      title: "Mappa Interattiva",
      what: "Mappa geolocalizzata delle cantine con filtri per denominazione, tipo di vino, export readiness. Mostra eventi in corso nelle cantine.",
      why: "La mappa da subito il senso del territorio: dove sono le cantine, quanto sono vicine tra loro, quali sono pronte per l'export. Per un buyer che visita la zona e essenziale per pianificare visite. Gli eventi segnalano occasioni di incontro dal vivo.",
    },
    {
      icon: Package,
      to: "/export-process",
      title: "Processo Export",
      what: "Guida passo-passo al processo di export, separata in due percorsi: uno per il buyer estero e uno per le cantine. Quattro step ciascuno con link diretti alle funzioni.",
      why: "L'export del vino ha regole precise: incoterms, certificazioni, documenti doganali, logistica. Molti buyer e cantine non conoscono il processo. Questa pagina lo spiega in modo semplice e rimanda agli strumenti giusti al momento giusto, riducendo gli errori e gli abbandoni.",
    },
    {
      icon: FileSpreadsheet,
      to: "/materiali-b2b",
      title: "Materiali B2B",
      what: "Cataloghi scaricabili in 4 lingue (IT, EN, DE, JP), calendario fiere internazionali (ProWein, Vinitaly, Wine & Gourmet Japan, SIAL Paris), e dati del territorio.",
      why: "Il buyer ha bisogno di materiale pronto da mostrare al suo team o ai distributori. I cataloghi multilingua rimuovono la barriera linguistica. Il calendario fiere indica dove le cantine possono incontrare buyer nuovi. I dati del territorio (65% Pinot Nero, #1 in Italia, 7 DOC/DOCG) sono argomenti di vendita concreti.",
    },
  ];

  const flowSteps = [
    t("exportGuide.flow1"), t("exportGuide.flow2"), t("exportGuide.flow3"),
    t("exportGuide.flow4"), t("exportGuide.flow5"), t("exportGuide.flow6"),
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs tracking-[0.25em] uppercase text-gold-600">Export</p>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-bordeaux-50 border border-bordeaux-200 text-bordeaux-600">
              <Brain className="w-3 h-3" /> AI Integration
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">{t("exportGuide.title")}</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            {t("exportGuide.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {functions.map((fn, i) => (
            <div key={i} className="bg-cream-50 rounded-xl border border-cream-200 p-6 hover:border-gold-300 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center shrink-0">
                  <fn.icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-serif text-xl text-bordeaux-950">{fn.title}</h2>
                    {fn.badge && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-gold-100 border border-gold-300 text-gold-700 font-semibold">
                        <Sparkles className="w-2.5 h-2.5" /> {fn.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Cosa fa</p>
                      <p className="text-sm text-bordeaux-700 leading-relaxed">{fn.what}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">Perche esiste</p>
                      <p className="text-sm text-bordeaux-700 leading-relaxed">{fn.why}</p>
                    </div>
                  </div>
                  <Link to={fn.to} className="inline-flex items-center gap-1 text-sm text-bordeaux-700 hover:text-gold-600 font-medium mt-4 group">
                    Apri <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h3 className="font-serif text-xl text-cream-50 mb-4">{t("exportGuide.flowTitle")}</h3>
          <div className="space-y-2">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gold-400 text-bordeaux-950 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-cream-200">{step}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to="/ai-matching" className="px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> {t("exportGuide.ctaStart")}
            </Link>
            <Link to="/export-process" className="px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm text-center border border-gold-700/30">
              {t("exportGuide.ctaProcess")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

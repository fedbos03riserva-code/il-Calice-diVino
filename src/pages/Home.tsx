import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, Sparkles, Store, Wine as WineIcon, Upload, RefreshCw, Lightbulb, Quote, Briefcase, Map as MapIcon, Package, FileSpreadsheet, Zap, FlaskConical, Search, Building2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadWineCatalog();
  }, []);

  const cartaSteps = [
    { icon: Upload, title: t("home.carta.step1"), desc: t("home.carta.step1.desc") },
    { icon: RefreshCw, title: t("home.carta.step2"), desc: t("home.carta.step2.desc") },
    { icon: Lightbulb, title: t("home.carta.step3"), desc: t("home.carta.step3.desc") },
  ];

  const testimonials = [
    { text: t("home.testimonials.1"), venue: t("home.testimonials.1.venue") },
    { text: t("home.testimonials.2"), venue: t("home.testimonials.2.venue") },
    { text: t("home.testimonials.3"), venue: t("home.testimonials.3.venue") },
  ];

  const b2cTags = [t("nav.quiz"), t("nav.winelab"), t("nav.catalog"), t("nav.reverse")];
  const b2bTags = [t("b2b.feature.carta"), t("nav.winelab"), t("b2b.feature.formazione"), t("b2b.feature.vendita")];

  return (
    <div className="min-h-screen">
      {/* Hero — focus Oltrepò */}
      <section className="relative overflow-hidden bg-bordeaux-950 text-cream-50">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(200,157,46,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(155,18,56,0.4) 0%, transparent 50%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="animate-fade-in-up">
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">{t("hero.subtitle")}</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-balance">
              {t("home.hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-8 text-pretty">
              {t("home.hero.motto")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <button onClick={() => navigate("/abbinamenti")}
              className="px-6 py-4 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2 group">
              <Search className="w-4 h-4" />
              {t("abbinamenti.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate("/catalog?regione=Oltrepò+Pavese")}
              className="px-6 py-4 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors flex items-center justify-center gap-2 border border-gold-700/30">
              <WineIcon className="w-4 h-4 text-gold-400" />
              {t("home.oltrepo.cta")}
            </button>
          </div>
        </div>
      </section>

      {/* Audience badges */}
      <section className="bg-cream-50 border-b border-cream-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button onClick={() => navigate("/abbinamenti")} className="flex items-center gap-3 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200 hover:border-gold-300 transition-colors text-left group">
              <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
                <WineIcon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-serif text-sm text-bordeaux-950">{t("home.audience.privato.title")}</p>
                <p className="text-xs text-bordeaux-500">{t("home.audience.privato.desc")}</p>
              </div>
            </button>
            <button onClick={() => navigate("/b2b")} className="flex items-center gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200 hover:border-gold-400 transition-colors text-left group">
              <div className="w-10 h-10 rounded-lg bg-gold-600 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-cream-50" />
              </div>
              <div>
                <p className="font-serif text-sm text-bordeaux-950">{t("home.audience.business.title")}</p>
                <p className="text-xs text-bordeaux-500">{t("home.audience.business.desc")}</p>
              </div>
            </button>
            <button onClick={() => navigate("/gestione-cantina")} className="flex items-center gap-3 p-4 rounded-xl bg-cream-100 border border-cream-300 hover:border-gold-400 transition-colors text-left group">
              <div className="w-10 h-10 rounded-lg bg-bordeaux-950 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-serif text-sm text-bordeaux-950">{t("home.audience.cantina.title")}</p>
                <p className="text-xs text-bordeaux-500">{t("home.audience.cantina.desc")}</p>
              </div>
            </button>
            <button onClick={() => navigate("/rfq")} className="flex items-center gap-3 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200 hover:border-gold-400 transition-colors text-left group">
              <div className="w-10 h-10 rounded-lg bg-bordeaux-700 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-serif text-sm text-bordeaux-950">{t("home.audience.export.title")}</p>
                <p className="text-xs text-bordeaux-500">{t("home.audience.export.desc")}</p>
              </div>
            </button>
          </div>
        </div>
      </section>
      <section className="bg-gold-50 border-y border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bordeaux-950 flex items-center justify-center shrink-0">
                <WineIcon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-serif text-lg text-bordeaux-950">{t("home.oltrepo.firstMap")}</p>
                <p className="text-xs text-bordeaux-600">{t("home.oltrepo.firstMapDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/catalog?regione=Oltrepò+Pavese")} className="text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors flex items-center gap-1.5">
                {t("home.oltrepo.cta")} <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => navigate("/mappa")} className="text-xs px-4 py-2 rounded-lg bg-cream-50 border border-cream-300 text-bordeaux-700 font-medium hover:border-gold-400 transition-colors flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5" /> {t("nav.map")}
              </button>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 rounded-lg bg-[#0A66C2] text-white font-medium hover:bg-[#004182] transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Oltrepò Pavese highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bordeaux-900 via-bordeaux-950 to-bordeaux-900 text-cream-100 p-8 md:p-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(200,157,46,0.4) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(200,157,46,0.2) 0%, transparent 40%)" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-3">{t("home.oltrepo.badge")}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-4">{t("home.oltrepo.title")}</h2>
              <p className="text-sm md:text-base text-cream-200 leading-relaxed">{t("home.oltrepo.desc")}</p>
              <button onClick={() => navigate("/catalog?regione=Oltrepò+Pavese")}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors group">
                {t("home.oltrepo.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6 shrink-0">
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-gold-400">225</p>
                <p className="text-xs text-cream-300 mt-1">{t("home.oltrepo.stat1")}</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-gold-400">DOCG</p>
                <p className="text-xs text-cream-300 mt-1">{t("home.oltrepo.stat2")}</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-gold-400">5</p>
                <p className="text-xs text-cream-300 mt-1">{t("home.oltrepo.stat3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Oltrepò Pavese */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("home.oltrepo.badge")}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("home.whyOltrepo.title")}</h2>
          <p className="text-sm text-bordeaux-600 max-w-2xl mx-auto mt-3">{t("home.whyOltrepo.desc")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 text-center">
            <p className="font-serif text-4xl text-gold-400">{t("home.whyOltrepo.stat1Val")}</p>
            <p className="text-xs text-cream-300 mt-1">{t("home.whyOltrepo.stat1")}</p>
          </div>
          <div className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 text-center">
            <p className="font-serif text-4xl text-gold-400">{t("home.whyOltrepo.stat2Val")}</p>
            <p className="text-xs text-cream-300 mt-1">{t("home.whyOltrepo.stat2")}</p>
          </div>
          <div className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 text-center">
            <p className="font-serif text-4xl text-gold-400">{t("home.whyOltrepo.stat3Val")}</p>
            <p className="text-xs text-cream-300 mt-1">{t("home.whyOltrepo.stat3")}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
          <h3 className="font-serif text-lg text-bordeaux-950 mb-2">{t("home.whyOltrepo.history")}</h3>
          <p className="text-sm text-bordeaux-600 leading-relaxed">{t("home.whyOltrepo.history.desc")}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => navigate("/cantine")} className="inline-flex items-center gap-1 text-sm text-bordeaux-700 hover:text-gold-600 font-medium">
              {t("nav.directory")} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/catalog?regione=Oltrepò+Pavese")} className="inline-flex items-center gap-1 text-sm text-bordeaux-700 hover:text-gold-600 font-medium">
              {t("home.oltrepo.cta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Carta vini viva - 3 steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("home.carta.title")}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("home.carta.howitworks")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cartaSteps.map((step, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-bordeaux-800 to-bordeaux-950 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-gold-400" />
              </div>
              <div className="text-xs text-gold-600 font-semibold mb-2">0{i + 1}</div>
              <h3 className="font-serif text-lg font-semibold text-bordeaux-950 mb-2">{step.title}</h3>
              <p className="text-sm text-bordeaux-600 text-pretty leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engine explanation */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-6 h-6 text-gold-400" />
            <h2 className="font-serif text-2xl text-cream-50">Punteggio IRC</h2>
          </div>
          <p className="text-sm text-cream-200 mb-4 text-pretty leading-relaxed">
            Ogni vino riceve un punteggio su 100 basato su 4 componentati. Il sistema analizza le interazioni chimiche molecolari tra vino e cibo per calcolare quanto bene si abbinano.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-serif font-bold text-gold-400">0-40</span>
                <p className="text-xs text-gold-400 font-semibold">{t("results.chem")}</p>
              </div>
              <p className="text-xs text-cream-300 mt-1">Interazioni chimiche primarie: tannini-proteine, acidita-grassi, zuccheri-dolcezza, CO2-unti</p>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-serif font-bold text-gold-400">0-25</span>
                <p className="text-xs text-gold-400 font-semibold">{t("results.aroma")}</p>
              </div>
              <p className="text-xs text-cream-300 mt-1">Corrispondenza dei composti volatili del vino con quelli del piatto (terpeni, esteri, aldeidi)</p>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-serif font-bold text-gold-400">0-20</span>
                <p className="text-xs text-gold-400 font-semibold">{t("results.structure")}</p>
              </div>
              <p className="text-xs text-cream-300 mt-1">Coerenza corpo-alcol-intensita: il vino regge o bilancia il piatto senza essere sopraffatto</p>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-serif font-bold text-gold-400">0-15</span>
                <p className="text-xs text-gold-400 font-semibold">{t("results.cleanse")}</p>
              </div>
              <p className="text-xs text-cream-300 mt-1">Capacita del vino di pulire il palato tra un boccone e l'altro (acidita, CO2, tannini)</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-bordeaux-800/30 border border-gold-700/20">
            <p className="text-xs text-cream-200 leading-relaxed">
              <span className="font-semibold text-gold-400">In modalita PRO</span> il motore AI genera due discorsi narrativi per ogni vino: uno in stile sommelier professionale (tecnico, preciso) e uno in stile appassionato (emozionale, vivido), piu l'analisi della reazione digestiva, temperatura di servizio e tempo di decantazione.
            </p>
          </div>
          <button onClick={() => navigate("/abbinamenti")} className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors group">
            {t("abbinamenti.cta")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("home.testimonials.title")}</p>
          <h2 className="font-serif text-2xl md:text-3xl text-bordeaux-950">{t("home.testimonials.title")}</h2>
          <p className="text-xs text-bordeaux-400 mt-1">{t("home.testimonials.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-cream-100 border border-cream-200 relative">
              <Quote className="w-6 h-6 text-gold-400 mb-3" />
              <p className="text-sm text-bordeaux-700 leading-relaxed italic">"{item.text}"</p>
              <p className="text-xs text-bordeaux-500 mt-3 font-medium">— {item.venue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Export hub links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => navigate("/ai-matching")} className="p-4 rounded-xl bg-bordeaux-950 border border-gold-500 hover:border-gold-400 transition-colors text-left group">
            <Zap className="w-5 h-5 text-gold-400 mb-2" />
            <p className="font-serif text-sm text-cream-50">{t("nav.aiMatching")}</p>
            <p className="text-xs text-cream-300">AI per buyer esteri</p>
          </button>
          <button onClick={() => navigate("/mappa")} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left group">
            <MapIcon className="w-5 h-5 text-gold-600 mb-2" />
            <p className="font-serif text-sm text-bordeaux-950">{t("nav.map")}</p>
            <p className="text-xs text-bordeaux-500">Cantine geolocalizzate</p>
          </button>
          <button onClick={() => navigate("/export-process")} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left group">
            <Package className="w-5 h-5 text-gold-600 mb-2" />
            <p className="font-serif text-sm text-bordeaux-950">{t("nav.exportProcess")}</p>
            <p className="text-xs text-bordeaux-500">Processo in 4 step</p>
          </button>
          <button onClick={() => navigate("/materiali-b2b")} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left group">
            <FileSpreadsheet className="w-5 h-5 text-gold-600 mb-2" />
            <p className="font-serif text-sm text-bordeaux-950">{t("nav.materials")}</p>
            <p className="text-xs text-bordeaux-500">Cataloghi e fiere</p>
          </button>
          <button onClick={() => navigate("/business-plan")} className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left group">
            <Briefcase className="w-5 h-5 text-gold-600 mb-2" />
            <p className="font-serif text-sm text-bordeaux-950">{t("nav.businessPlan")}</p>
            <p className="text-xs text-bordeaux-500">Per investitori</p>
          </button>
        </div>
      </section>

      {/* B2C + B2B CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button onClick={() => navigate("/abbinamenti")}
            className="text-left p-8 rounded-2xl bg-gradient-to-br from-bordeaux-800 to-bordeaux-950 text-cream-100 hover:from-bordeaux-700 hover:to-bordeaux-900 transition-all group border border-gold-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400 flex items-center justify-center">
                <WineIcon className="w-6 h-6 text-bordeaux-950" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-400">{t("home.b2c.title")}</p>
                <h3 className="font-serif text-2xl text-cream-50">{t("home.b2c.heading")}</h3>
              </div>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">{t("home.b2c.desc")}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {b2cTags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-800/60 text-cream-200 border border-gold-700/20">{tag}</span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm text-gold-400 mt-5 group-hover:text-gold-300">
              {t("home.b2c.cta")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button onClick={() => navigate("/b2b")}
            className="text-left p-8 rounded-2xl bg-gradient-to-br from-gold-700 to-gold-800 text-cream-100 hover:from-gold-600 hover:to-gold-700 transition-all group border border-gold-400/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cream-50 flex items-center justify-center">
                <Store className="w-6 h-6 text-gold-700" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream-200">{t("home.b2b.title")}</p>
                <h3 className="font-serif text-2xl text-cream-50">{t("home.b2b.heading")}</h3>
              </div>
            </div>
            <p className="text-sm text-cream-100 leading-relaxed">{t("home.b2b.desc")}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {b2bTags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-cream-50/20 text-cream-100">{tag}</span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm text-cream-50 mt-5 group-hover:text-gold-200">
              {t("home.b2b.cta")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Export for wineries / exporters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-bordeaux-800 flex items-center justify-center">
              <Package className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-600">{t("home.export.badge")}</p>
              <h3 className="font-serif text-2xl text-bordeaux-950">{t("home.export.title")}</h3>
            </div>
          </div>
          <p className="text-sm text-bordeaux-700 leading-relaxed max-w-3xl">{t("home.export.desc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <button onClick={() => navigate("/rfq")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <FileSpreadsheet className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h4 className="font-serif text-base text-bordeaux-950">{t("home.export.rfq")}</h4>
              <p className="text-xs text-bordeaux-500 mt-1">{t("home.export.rfqDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.scopri")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/export-guide")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Building2 className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h4 className="font-serif text-base text-bordeaux-950">{t("home.export.guide")}</h4>
              <p className="text-xs text-bordeaux-500 mt-1">{t("home.export.guideDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.scopri")} <ArrowRight className="w-3 h-3" /></span>
            </button>
            <button onClick={() => navigate("/export-process")} className="text-left p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors group">
              <Zap className="w-6 h-6 text-bordeaux-700 mb-2" />
              <h4 className="font-serif text-base text-bordeaux-950">{t("home.export.process")}</h4>
              <p className="text-xs text-bordeaux-500 mt-1">{t("home.export.processDesc")}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.scopri")} <ArrowRight className="w-3 h-3" /></span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate("/abbinamenti")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Search className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("abbinamenti.heading")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("abbinamenti.subheading")}</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.prova")} <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/quiz")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Sparkles className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("home.feature.quiz")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("home.feature.quiz.desc")}</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.prova")} <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/reverse")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <ChefHat className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("home.feature.reverse")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("home.feature.reverse.desc")}</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.scopri")} <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/premium")} className="text-left p-6 rounded-xl bg-gold-50 border border-gold-200 hover:border-gold-400 transition-colors group">
            <Sparkles className="w-8 h-8 text-gold-600 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("home.feature.premium")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("home.feature.premium.desc")}</p>
            <span className="flex items-center gap-1 text-xs text-gold-600 mt-3 group-hover:text-gold-700 transition-colors">{t("home.feature.premium.cta")} <ArrowRight className="w-3 h-3" /></span>
          </button>
        </div>
      </section>
    </div>
  );
}

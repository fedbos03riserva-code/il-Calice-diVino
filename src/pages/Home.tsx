import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FlaskConical, BarChart3, ShoppingCart, ArrowRight, Beaker, ChefHat, Sparkles, Store, Wine as WineIcon, Upload, RefreshCw, Lightbulb, Quote } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import type { Wine } from "../types/wine";
import WineCard from "../components/WineCard";

const PREMIUM_DISHES = [
  "bistecca alla fiorentina",
  "risotto ai funghi porcini",
  "ostriche e caviale",
  "tagliatelle al tartufo bianco",
  "agnello al forno con erbe",
  "salmone affumicato",
  "foie gras con miele",
  "parmigiana di melanzane",
  "osso buco alla gremolada",
  "brasato al Barolo",
];

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [dish, setDish] = useState("");
  const [featured, setFeatured] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWineCatalog().then((catalog) => {
      const picks: Wine[] = [];
      const lusso = catalog.filter((w) => w.fascia === "lusso");
      const premium = catalog.filter((w) => w.fascia === "premium");
      const standard = catalog.filter((w) => w.fascia === "standard");
      const economico = catalog.filter((w) => w.fascia === "economico");
      if (lusso[0]) picks.push(lusso[0]);
      if (lusso[2]) picks.push(lusso[2]);
      if (premium[0]) picks.push(premium[0]);
      if (premium[3]) picks.push(premium[3]);
      if (standard[0]) picks.push(standard[0]);
      if (economico[0]) picks.push(economico[0]);
      setFeatured(picks.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dish.trim()) navigate(`/results?dish=${encodeURIComponent(dish.trim())}`);
  };

  const steps = [
    { icon: Search, title: t("section.howitworks.1"), desc: t("section.howitworks.1.desc") },
    { icon: FlaskConical, title: t("section.howitworks.2"), desc: t("section.howitworks.2.desc") },
    { icon: BarChart3, title: t("section.howitworks.3"), desc: t("section.howitworks.3.desc") },
    { icon: ShoppingCart, title: t("section.howitworks.4"), desc: t("section.howitworks.4.desc") },
  ];

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-bordeaux-950 text-cream-50">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(200,157,46,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(155,18,56,0.4) 0%, transparent 50%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="animate-fade-in-up">
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">{t("hero.subtitle")}</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-balance">
              {t("home.hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-10 text-pretty">
              {t("home.hero.tagline")}
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
                <input type="text" value={dish} onChange={(e) => setDish(e.target.value)}
                  placeholder={t("hero.search.placeholder")}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream-50 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm md:text-base" />
              </div>
              <button type="submit"
                className="px-6 py-4 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2 group">
                {t("hero.search.button")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {PREMIUM_DISHES.map((s) => (
              <button key={s} onClick={() => navigate(`/results?dish=${encodeURIComponent(s)}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-800/50 text-cream-200 hover:bg-gold-700 hover:text-cream-50 transition-colors border border-bordeaux-700">
                {s}
              </button>
            ))}
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

      {/* How it works - pairing engine */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="font-serif text-3xl md:text-4xl text-center text-bordeaux-950 mb-12">
          {t("section.howitworks")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i}
              className="text-center p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bordeaux-800 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-gold-400" />
              </div>
              <div className="text-xs text-gold-600 font-semibold mb-2">0{i + 1}</div>
              <h3 className="font-serif text-lg font-semibold text-bordeaux-950 mb-2">{step.title}</h3>
              <p className="text-sm text-bordeaux-600 text-pretty">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engine explanation */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-6 h-6 text-gold-400" />
            <h2 className="font-serif text-2xl text-cream-50">Il motore IRC</h2>
          </div>
          <p className="text-sm text-cream-200 mb-4 text-pretty leading-relaxed">
            {t("results.mechanism")} — {t("results.sensation")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">{t("results.chem")}</p>
              <p className="text-xs text-cream-300 mt-1">{t("section.howitworks.2.desc")}</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">{t("results.aroma")}</p>
              <p className="text-xs text-cream-300 mt-1">{t("results.reason")}</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">{t("results.structure")}</p>
              <p className="text-xs text-cream-300 mt-1">{t("section.howitworks.3.desc")}</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">{t("results.cleanse")}</p>
              <p className="text-xs text-cream-300 mt-1">{t("results.culinary")}</p>
            </div>
          </div>
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
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-semibold uppercase tracking-wider">{t("home.testimonials.badge")}</span>
              <Quote className="w-6 h-6 text-gold-400 mb-3" />
              <p className="text-sm text-bordeaux-700 leading-relaxed italic">"{item.text}"</p>
              <p className="text-xs text-bordeaux-500 mt-3 font-medium">— {item.venue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* B2C + B2B CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button onClick={() => navigate("/catalog")}
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

      {/* Feature links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate("/quiz")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Sparkles className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("home.feature.quiz")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("home.feature.quiz.desc")}</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.prova")} <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/wine-lab")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Beaker className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">{t("home.feature.lab")}</h3>
            <p className="text-sm text-bordeaux-600 mt-1">{t("home.feature.lab.desc")}</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{t("home.feature.esplora")} <ArrowRight className="w-3 h-3" /></span>
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

      {/* Featured wines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("hero.featured.title")}</h2>
            <p className="text-bordeaux-600 mt-1">{t("hero.featured.subtitle")}</p>
          </div>
          <button onClick={() => navigate("/catalog")}
            className="text-sm text-bordeaux-700 hover:text-gold-600 flex items-center gap-1 group">
            {t("nav.catalog")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-cream-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featured.map((wine) => (
              <WineCard key={wine.id} wine={wine} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

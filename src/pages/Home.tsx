import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FlaskConical, BarChart3, ShoppingCart, ArrowRight, Beaker, ChefHat, Sparkles, Store } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import type { Wine } from "../types/wine";
import WineCard from "../components/WineCard";

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [dish, setDish] = useState("");
  const [featured, setFeatured] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWineCatalog().then((catalog) => {
      // Pick a diverse selection: 1 luxury, 2 premium, 2 standard, 1 economico
      const picks: Wine[] = [];
      const lusso = catalog.filter((w) => w.fascia === "lusso");
      const premium = catalog.filter((w) => w.fascia === "premium");
      const standard = catalog.filter((w) => w.fascia === "standard");
      const economico = catalog.filter((w) => w.fascia === "economico");
      if (lusso[0]) picks.push(lusso[0]);
      if (premium[0]) picks.push(premium[0]);
      if (premium[3]) picks.push(premium[3]);
      if (standard[0]) picks.push(standard[0]);
      if (standard[5]) picks.push(standard[5]);
      if (economico[0]) picks.push(economico[0]);
      setFeatured(picks.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dish.trim()) {
      navigate(`/results?dish=${encodeURIComponent(dish.trim())}`);
    }
  };

  const steps = [
    { icon: Search, title: t("section.howitworks.1"), desc: t("section.howitworks.1.desc") },
    { icon: FlaskConical, title: t("section.howitworks.2"), desc: t("section.howitworks.2.desc") },
    { icon: BarChart3, title: t("section.howitworks.3"), desc: t("section.howitworks.3.desc") },
    { icon: ShoppingCart, title: t("section.howitworks.4"), desc: t("section.howitworks.4.desc") },
  ];

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
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-10 text-pretty">
              {t("hero.tagline")}
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
                <input
                  type="text"
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder={t("hero.search.placeholder")}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream-50 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2 group"
              >
                {t("hero.search.button")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {["bistecca alla fiorentina", "risotto ai funghi", "ostriche", "pasta al ragù", "salmone alla griglia"].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/results?dish=${encodeURIComponent(s)}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-800/50 text-cream-200 hover:bg-bordeaux-700 hover:text-gold-400 transition-colors border border-bordeaux-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="font-serif text-3xl md:text-4xl text-center text-bordeaux-950 mb-12">
          {t("section.howitworks")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
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
            Ogni vino riceve un punteggio da 0 a 100 basato su 4 componenti che analizzano l'abbinamento a livello molecolare:
            l'acidità taglia il grasso e rinfresca il palato, i tannini si legano alle proteine della carne,
            la struttura deve bilanciare l'intensità del piatto, e l'armonia aromatica completa l'esperienza.
            Non è gusto personale — è chimica del gusto.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">Chimica</p>
              <p className="text-xs text-cream-300 mt-1">Acidità, tannini, zuccheri: le reazioni molecolari che determinano l'equilibrio in bocca.</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">Aromatico</p>
              <p className="text-xs text-cream-300 mt-1">Il profilo olfattivo del vino deve completare — non coprire — gli aromi del piatto.</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">Struttura</p>
              <p className="text-xs text-cream-300 mt-1">Corpo e alcol devono reggere il peso del piatto senza sovrastarlo né sparire.</p>
            </div>
            <div className="p-3 rounded-lg bg-bordeaux-800/50">
              <p className="text-xs text-gold-400 font-semibold">Pulizia</p>
              <p className="text-xs text-cream-300 mt-1">La capacità del vino di sgrassare e rinfrescare il palato tra un morso e l'altro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => navigate("/quiz")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Sparkles className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Quiz del gusto</h3>
            <p className="text-sm text-bordeaux-600 mt-1">5 domande per trovare il tuo vino ideale</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">Prova <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/wine-lab")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <Beaker className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Wine Lab</h3>
            <p className="text-sm text-bordeaux-600 mt-1">Modifica il piatto e guarda come cambia l'abbinamento</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">Esplora <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/reverse")} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
            <ChefHat className="w-8 h-8 text-bordeaux-700 mb-3" />
            <h3 className="font-serif text-lg text-bordeaux-950">Consigli culinari</h3>
            <p className="text-sm text-bordeaux-600 mt-1">Dal vino al piatto: reverse engineering del gusto</p>
            <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">Scopri <ArrowRight className="w-3 h-3" /></span>
          </button>
        </div>
      </section>

      {/* B2B + Premium CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => navigate("/b2b")} className="text-left p-6 rounded-xl bg-bordeaux-900 text-cream-100 hover:bg-bordeaux-800 transition-colors group">
            <Store className="w-8 h-8 text-gold-400 mb-3" />
            <h3 className="font-serif text-lg text-cream-50">Per ristoratori</h3>
            <p className="text-sm text-cream-300 mt-1">Gestione carta vini, consulenza AI, formazione staff</p>
            <span className="flex items-center gap-1 text-xs text-gold-400 mt-3 group-hover:text-gold-300">Richiedi demo <ArrowRight className="w-3 h-3" /></span>
          </button>
          <button onClick={() => navigate("/premium")} className="text-left p-6 rounded-xl bg-gold-700 text-cream-100 hover:bg-gold-600 transition-colors group">
            <Sparkles className="w-8 h-8 text-gold-200 mb-3" />
            <h3 className="font-serif text-lg text-cream-50">BF45 Premium</h3>
            <p className="text-sm text-cream-300 mt-1">Consulenze illimitate a 4.90€/mese + 14 giorni gratis</p>
            <span className="flex items-center gap-1 text-xs text-gold-200 mt-3 group-hover:text-gold-100">Iscriviti <ArrowRight className="w-3 h-3" /></span>
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
          <button
            onClick={() => navigate("/catalog")}
            className="text-sm text-bordeaux-700 hover:text-gold-600 flex items-center gap-1 group"
          >
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FlaskConical, BarChart3, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import type { Wine } from "../types/wine";
import WineCard from "../components/WineCard";

export default function Home() {
  const { t, addToCart } = useApp();
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

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, Eye, Utensils, Lightbulb, Plus, Heart, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { PairingResult } from "../types/wine";
import IRCBar from "../components/IRCBar";

export default function Results() {
  const { t, addToCart, toggleSaveWine, isSaved, addSearchHistory, getWineRating } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dish = searchParams.get("dish") || "";

  const [results, setResults] = useState<PairingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      const res = pairDishWithCatalog(cat, dish);
      setResults(res);
      setLoading(false);
      addSearchHistory({ piatto: dish, filtri: {}, resultsCount: res.length });
    });
  }, [dish]);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-gold-600";
    if (score >= 40) return "text-bordeaux-600";
    return "text-bordeaux-400";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-cream-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-bordeaux-800" />
        </button>
        <div>
          <p className="text-sm text-bordeaux-600">{t("results.title")}</p>
          <h1 className="font-serif text-2xl md:text-3xl text-bordeaux-950 capitalize">&ldquo;{dish}&rdquo;</h1>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-bordeaux-600 text-lg">{t("results.empty")}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
          >
            {t("results.back")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div
              key={r.wine.id}
              className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden hover:border-gold-300 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${Math.min(idx * 0.05, 0.4)}s` }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Wine info */}
                <div className="md:w-72 p-5 border-b md:border-b-0 md:border-r border-cream-200 bg-cream-100">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bordeaux-950 text-cream-100">
                      #{idx + 1}
                    </span>
                    <span className={`text-2xl font-serif font-bold ${scoreColor(r.score.totale)}`}>
                      {r.score.totale}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-bordeaux-950 leading-tight">
                    <Link to={`/wine/${r.wine.id}`} className="hover:text-bordeaux-700 transition-colors">{r.wine.nome}</Link>
                  </h3>
                  <p className="text-xs text-bordeaux-600 mt-1">
                    {r.wine.regione} &middot; {r.wine.continente}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {(() => { const { avg, count } = getWineRating(r.wine.id); return count > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                        <span className="text-xs text-bordeaux-600">{avg} ({count})</span>
                      </div>
                    ) : null; })()}
                  </div>
                  <p className="text-xs text-bordeaux-500 mt-1">{r.wine.uva}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-bordeaux-700 text-cream-50">
                      {t(`type.${r.wine.tipo}`)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-600 text-cream-50">
                      {t(`price.${r.wine.fascia}`)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-serif font-semibold text-bordeaux-800">
                      &euro;{r.wine.prezzo.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSaveWine(r.wine)}
                        className="p-2 rounded-lg bg-cream-200 hover:bg-cream-300 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isSaved(r.wine.id) ? "fill-bordeaux-600 text-bordeaux-600" : "text-bordeaux-400"}`} />
                      </button>
                      <button
                        onClick={() => addToCart(r.wine)}
                        className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {t("results.addtocart")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score + details */}
                <div className="flex-1 p-5">
                  {/* IRC bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <IRCBar label={t("results.chem")} value={r.score.chimica} max={40} color="bg-bordeaux-600" />
                    <IRCBar label={t("results.aroma")} value={r.score.aromatico} max={25} color="bg-gold-500" />
                    <IRCBar label={t("results.structure")} value={r.score.struttura} max={20} color="bg-bordeaux-400" />
                    <IRCBar label={t("results.cleanse")} value={r.score.pulizia} max={15} color="bg-gold-400" />
                  </div>

                  {/* Expandable details */}
                  <button
                    onClick={() => setExpanded(expanded === r.wine.id ? null : r.wine.id)}
                    className="text-sm text-bordeaux-700 hover:text-gold-600 flex items-center gap-1"
                  >
                    {expanded === r.wine.id ? "Nascondi dettagli" : "Mostra dettagli"}
                  </button>

                  {expanded === r.wine.id && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      <div className="flex gap-2">
                        <FlaskConical className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-bordeaux-700">{t("results.mechanism")}</p>
                          <p className="text-sm text-bordeaux-600 text-pretty">{r.meccanismo_chimico}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Eye className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-bordeaux-700">{t("results.sensation")}</p>
                          <p className="text-sm text-bordeaux-600 text-pretty">{r.sensazione_in_bocca}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Utensils className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-bordeaux-700">{t("results.culinary")}</p>
                          <p className="text-sm text-bordeaux-600 text-pretty">{r.consigli_culinari}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Lightbulb className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-bordeaux-700">{t("results.reason")}</p>
                          <p className="text-sm text-bordeaux-600 text-pretty">{r.motivo_abbinamento}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

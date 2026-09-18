import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, Eye, Utensils, Lightbulb, Plus, Heart, Star, Globe2, Sparkles, Lock, KeyRound, X, Briefcase, TrendingUp, Thermometer } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import { getAIPairing, validateCode, getStoredCode, setStoredCode, type AIPairingResult } from "../lib/aiPairing";
import type { PairingResult } from "../types/wine";
import IRCBar from "../components/IRCBar";

const FOREIGN_DISHES = ["sushi", "sashimi", "tempura", "ramen", "curry", "tikka masala", "bratwurst", "sauerkraut", "fondue", "raclette", "paella", "tapas", "ceviche", "tacos", "pho", "dim sum", "pad thai", "bibimbap", "kimchi", "wagyu", "teriyaki", "goulash", "schnitzel", "pastrami", "bagel", "fish and chips", "shepherd's pie", "beef wellington"];

function isForeignDish(dish: string): boolean {
  const lower = dish.toLowerCase();
  return FOREIGN_DISHES.some((f) => lower.includes(f));
}

export default function Results() {
  const { t, addToCart, toggleSaveWine, isSaved, addSearchHistory, getWineRating, user } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dish = searchParams.get("dish") || "";
  const businessMode = searchParams.get("mode") === "business";

  const [results, setResults] = useState<PairingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [analysis, setAnalysis] = useState<AIPairingResult["analisi_piatto"] | null>(null);
  const [consiglio, setConsiglio] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [hasCode, setHasCode] = useState<boolean>(!!getStoredCode());

  useEffect(() => {
    loadWineCatalog().then(async (cat) => {
      const storedCode = getStoredCode();
      if (storedCode && hasCode) {
        const result = await getAIPairing(dish, cat, "it", storedCode);
        setResults(result.results);
        setIsAI(result.ai);
        if (result.analysis) setAnalysis(result.analysis);
        if (result.consiglio) setConsiglio(result.consiglio);
        addSearchHistory({ piatto: dish, filtri: {}, resultsCount: result.results.length });
      } else {
        const res = pairDishWithCatalog(cat, dish, undefined, businessMode ? "ristoratore" : user?.role);
        setResults(res);
        setIsAI(false);
        addSearchHistory({ piatto: dish, filtri: {}, resultsCount: res.length });
      }
      setLoading(false);
    });
  }, [dish]);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    const result = await validateCode(codeInput);
    if (!result.valid) {
      setCodeError(result.error || "Codice non valido");
      return;
    }
    setStoredCode(codeInput.trim().toUpperCase());
    setHasCode(true);
    setShowCodeModal(false);
    setLoading(true);
    loadWineCatalog().then(async (cat) => {
      const aiResult = await getAIPairing(dish, cat, "it", codeInput.trim().toUpperCase());
      setResults(aiResult.results);
      setIsAI(aiResult.ai);
      if (aiResult.analysis) setAnalysis(aiResult.analysis);
      if (aiResult.consiglio) setConsiglio(aiResult.consiglio);
      setLoading(false);
    });
  };

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
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-bordeaux-800" />
        </button>
        <div>
          <p className="text-sm text-bordeaux-600">{t("results.title")}</p>
          <h1 className="font-serif text-2xl md:text-3xl text-bordeaux-950 capitalize">&ldquo;{dish}&rdquo;</h1>
        </div>
      </div>

      {/* AI badge + code prompt */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        {businessMode && (
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-gold-400 text-bordeaux-950 font-semibold">
            <Briefcase className="w-3.5 h-3.5" /> Modalita Business
          </div>
        )}
        {isAI ? (
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-bordeaux-950 text-gold-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> {t("results.aiBadge")}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-cream-200 text-bordeaux-600 font-medium">
            <FlaskConical className="w-3.5 h-3.5" /> {t("results.localBadge")}
          </div>
        )}
        <p className="text-xs text-bordeaux-400 max-w-xl">
          {isAI ? t("results.aiBadgeDesc") : t("results.localBadgeDesc")}
        </p>
        {!isAI && (
          <button onClick={() => setShowCodeModal(true)} className="text-xs px-3 py-1.5 rounded-full bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" /> {t("results.unlockAI")}
          </button>
        )}
      </div>

      {/* AI analysis panel */}
      {isAI && analysis && (
        <div className="mb-6 p-5 rounded-xl bg-bordeaux-950 text-cream-50">
          <h2 className="font-serif text-lg text-gold-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {t("results.dishAnalysis")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
            <div><p className="text-cream-300">Grassi</p><p className="text-cream-50">{analysis.grassi}</p></div>
            <div><p className="text-cream-300">Proteine</p><p className="text-cream-50">{analysis.proteine}</p></div>
            <div><p className="text-cream-300">Acidi</p><p className="text-cream-50">{analysis.acidi}</p></div>
            <div><p className="text-cream-300">Piccantezza</p><p className="text-cream-50">{analysis.piccantezza}</p></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div><p className="text-cream-300">Umami</p><p className="text-cream-50">{analysis.umami}</p></div>
            <div><p className="text-cream-300">Tendenza dolce</p><p className="text-cream-50">{analysis.tendenza_dolce}</p></div>
            <div><p className="text-cream-300">Complessità</p><p className="text-cream-50">{analysis.complessita}</p></div>
          </div>
          {analysis.sfida_abbinamento && (
            <p className="text-xs text-gold-400 mt-3 italic">{analysis.sfida_abbinamento}</p>
          )}
          {consiglio && (
            <p className="text-sm text-cream-200 mt-3 pt-3 border-t border-gold-700/30">{consiglio}</p>
          )}
        </div>
      )}

      {/* Code modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-bordeaux-950/60 flex items-center justify-center z-50 p-4" onClick={() => setShowCodeModal(false)}>
          <div className="bg-cream-50 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-bordeaux-950 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold-600" /> {t("results.codeTitle")}
              </h2>
              <button onClick={() => setShowCodeModal(false)} className="p-1 rounded-lg hover:bg-cream-200">
                <X className="w-5 h-5 text-bordeaux-600" />
              </button>
            </div>
            <p className="text-sm text-bordeaux-600 mb-4">{t("results.codeDesc")}</p>
            <form onSubmit={handleCodeSubmit}>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="BF45DEMO"
                className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400 mb-3"
              />
              {codeError && <p className="text-xs text-red-600 mb-3">{codeError}</p>}
              <button type="submit" className="w-full px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors">
                {t("results.codeUnlock")}
              </button>
            </form>
            <p className="text-xs text-bordeaux-400 mt-3 text-center">{t("results.codeHint")}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-bordeaux-600 text-lg">{t("results.empty")}</p>
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
            {t("results.back")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div key={r.wine.id} className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden hover:border-gold-300 transition-colors animate-fade-in-up" style={{ animationDelay: `${Math.min(idx * 0.05, 0.4)}s` }}>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 p-5 border-b md:border-b-0 md:border-r border-cream-200 bg-cream-100">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bordeaux-950 text-cream-100">#{idx + 1}</span>
                    <span className={`text-2xl font-serif font-bold ${scoreColor(r.score.totale)}`}>{r.score.totale}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-bordeaux-950 leading-tight">
                    <Link to={`/wine/${r.wine.id}`} className="hover:text-bordeaux-700 transition-colors">{r.wine.nome}</Link>
                  </h3>
                  <p className="text-xs text-bordeaux-600 mt-1">{r.wine.regione} &middot; {r.wine.continente}</p>
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
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-bordeaux-700 text-cream-50">{t(`type.${r.wine.tipo}`)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-600 text-cream-50">{t(`price.${r.wine.fascia}`)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-serif font-semibold text-bordeaux-800">&euro;{r.wine.prezzo.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleSaveWine(r.wine)} className="p-2 rounded-lg bg-cream-200 hover:bg-cream-300 transition-colors">
                        <Heart className={`w-4 h-4 ${isSaved(r.wine.id) ? "fill-bordeaux-600 text-bordeaux-600" : "text-bordeaux-400"}`} />
                      </button>
                      <button onClick={() => addToCart(r.wine)} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
                        <Plus className="w-3 h-3" />{t("results.addtocart")}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <IRCBar label={t("results.chem")} value={r.score.chimica} max={40} color="bg-bordeaux-600" />
                    <IRCBar label={t("results.aroma")} value={r.score.aromatico} max={25} color="bg-gold-500" />
                    <IRCBar label={t("results.structure")} value={r.score.struttura} max={20} color="bg-bordeaux-400" />
                    <IRCBar label={t("results.cleanse")} value={r.score.pulizia} max={15} color="bg-gold-400" />
                  </div>
                  <button onClick={() => setExpanded(expanded === r.wine.id ? null : r.wine.id)} className="text-sm text-bordeaux-700 hover:text-gold-600 flex items-center gap-1">
                    {expanded === r.wine.id ? "Nascondi dettagli" : "Mostra dettagli"}
                  </button>
                  {expanded === r.wine.id && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      <div className="flex gap-2"><FlaskConical className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-bordeaux-700">{t("results.mechanism")}</p><p className="text-sm text-bordeaux-600 text-pretty">{r.meccanismo_chimico}</p></div></div>
                      <div className="flex gap-2"><Eye className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-bordeaux-700">{t("results.sensation")}</p><p className="text-sm text-bordeaux-600 text-pretty">{r.sensazione_in_bocca}</p></div></div>
                      <div className="flex gap-2"><Utensils className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-bordeaux-700">{t("results.culinary")}</p><p className="text-sm text-bordeaux-600 text-pretty">{r.consigli_culinari}</p></div></div>
                      <div className="flex gap-2"><Lightbulb className="w-4 h-4 text-bordeaux-600 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-bordeaux-700">{t("results.reason")}</p><p className="text-sm text-bordeaux-600 text-pretty">{r.motivo_abbinamento}</p></div></div>
                      {businessMode && (
                        <div className="mt-4 p-4 rounded-lg bg-bordeaux-50 border border-bordeaux-200 space-y-2">
                          <p className="text-xs font-semibold text-bordeaux-800 uppercase tracking-wider flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Dati per la carta</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-bordeaux-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Prezzo in carta</p>
                              <p className="font-semibold text-bordeaux-950">EUR {(() => { const m = r.wine.fascia === "economico" ? 60 : r.wine.fascia === "standard" ? 50 : r.wine.fascia === "premium" ? 40 : 35; return (r.wine.prezzo / (1 - m / 100)).toFixed(2); })()}</p>
                            </div>
                            <div>
                              <p className="text-bordeaux-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Margine suggerito</p>
                              <p className="font-semibold text-bordeaux-950">{r.wine.fascia === "economico" ? "60%" : r.wine.fascia === "standard" ? "50%" : r.wine.fascia === "premium" ? "40%" : "35%"}</p>
                            </div>
                            <div>
                              <p className="text-bordeaux-500 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Servizio</p>
                              <p className="font-semibold text-bordeaux-950">{r.wine.tipo === "Spumante" ? "6-8 C" : r.wine.tipo === "Bianco" ? "10-12 C" : r.wine.tipo === "Rosso" ? "16-18 C" : "12-14 C"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-bordeaux-600 pt-2 border-t border-bordeaux-200">{r.consigli_culinari}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {isForeignDish(dish) && r.wine.regione === "Oltrepò Pavese" && (
                    <div className="mt-4 p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200 flex items-center gap-3">
                      <Globe2 className="w-5 h-5 text-bordeaux-700 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-bordeaux-700">{t("results.exportCta")}</p>
                        <p className="text-xs text-bordeaux-500">{t("results.exportCtaDesc")}</p>
                      </div>
                      <Link to="/rfq" className="text-xs px-3 py-2 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors whitespace-nowrap">{t("nav.rfq")}</Link>
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

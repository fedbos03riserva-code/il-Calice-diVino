import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, FileText, Check, X, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { wineries } from "../data/wineryDirectory";
import { matchWineries, type WineryMatch as WineryMatchResult, type BuyerQuery } from "../lib/wineryMatcher";

const EXAMPLES = [
  "Cerco un Pinot Nero metodo classico, 5000 bottiglie, per il mercato giappone, budget medio",
  "Bonarda bio per Germania, 2000 bottiglie, FOB",
  "Buttafuoco Storico premium per USA, 1000 bt, certificazione bio",
  "Moscato dolce per Taiwan, CIF, 3000 bt",
];

export default function WineryMatchPage() {
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WineryMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      const buyerQuery: BuyerQuery = { description: query };
      const matched = matchWineries(buyerQuery, wineries);
      setResults(matched);
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Matching
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">{t("match.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl mx-auto">{t("match.subtitle")}</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleMatch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("match.placeholder")}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream-50 border border-cream-300 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-4 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t("match.button")}
            </button>
          </div>
        </form>

        {/* Example queries */}
        {!searched && !loading && (
          <div className="mb-8">
            <p className="text-xs text-bordeaux-500 mb-3">{t("match.examples")}</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  className="text-xs px-3 py-2 rounded-lg bg-cream-50 border border-cream-200 text-bordeaux-700 hover:border-gold-300 hover:text-bordeaux-950 transition-colors text-left"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-bordeaux-600 mx-auto mb-4" />
            <p className="text-sm text-bordeaux-500">{t("match.analyzing")}</p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-bordeaux-600">
                {t("match.resultsCount")}: <span className="font-semibold text-bordeaux-950">{results.length}</span>
              </p>
              <button
                onClick={() => {
                  setSearched(false);
                  setQuery("");
                }}
                className="text-xs text-bordeaux-500 hover:text-bordeaux-700"
              >
                {t("match.newSearch")}
              </button>
            </div>

            {results.length === 0 ? (
              <p className="text-center py-12 text-bordeaux-500">{t("match.noResults")}</p>
            ) : (
              results.map((m, idx) => (
                <div
                  key={m.winery.id}
                  className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden hover:border-gold-300 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Score */}
                    <div className="md:w-32 bg-bordeaux-950 text-cream-50 p-5 flex flex-col items-center justify-center">
                      <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">{t("match.score")}</p>
                      <p className="font-serif text-4xl text-gold-400">{m.score}%</p>
                      <p className="text-xs text-cream-300 mt-1">
                        {m.score >= 70 ? t("match.high") : m.score >= 40 ? t("match.medium") : t("match.low")}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-bordeaux-950">
                            <Link to={`/cantine?winery=${m.winery.id}`} className="hover:text-bordeaux-700">
                              {m.winery.nome}
                            </Link>
                          </h3>
                          <p className="text-xs text-bordeaux-500">
                            {m.winery.comune} ({m.winery.provincia}) · {m.winery.ettari} ha · {m.winery.capacitaProduttiva.toLocaleString()} hl/anno
                          </p>
                        </div>
                        {m.winery.exportReady && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-green-600 text-cream-50 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Export Ready
                          </span>
                        )}
                      </div>

                      {/* Reasons */}
                      <div className="space-y-1 mb-4">
                        {m.reasons.map((reason, i) => (
                          <p key={i} className="text-xs text-bordeaux-600 flex items-start gap-1.5">
                            {reason.includes("non") || reason.includes("limitata") || reason.includes("sopra") ? (
                              <X className="w-3 h-3 text-bordeaux-400 shrink-0 mt-0.5" />
                            ) : (
                              <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                            )}
                            {reason}
                          </p>
                        ))}
                      </div>

                      {/* Key data */}
                      <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                        <div>
                          <p className="text-bordeaux-400">MOQ</p>
                          <p className="font-semibold text-bordeaux-700">{m.winery.moq} bt</p>
                        </div>
                        <div>
                          <p className="text-bordeaux-400">FOB</p>
                          <p className="font-semibold text-bordeaux-700">€{m.winery.prezzoFOB.toFixed(2)}/bt</p>
                        </div>
                        <div>
                          <p className="text-bordeaux-400">{t("match.incoterms")}</p>
                          <p className="font-semibold text-bordeaux-700 text-xs">{m.winery.incoterms.join(", ")}</p>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2">
                        <Link
                          to={`/rfq?cantina=${m.winery.id}`}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> {t("match.sendRfq")}
                        </Link>
                        <Link
                          to={`/wine-sheet/${m.winery.id}`}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-cream-200 text-bordeaux-700 font-medium hover:bg-cream-300 transition-colors"
                        >
                          {t("match.techSheet")} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Filter, X, Globe2, Check, Wine, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";
import { wineries, type Winery } from "../data/wineryDirectory";

const DENOMINATIONS = [
  "Metodo Classico DOCG",
  "Pinot Nero DOC",
  "Bonarda DOC",
  "Buttafuoco DOC",
  "Sangue di Giuda DOC",
  "Riesling DOC",
  "Moscato DOC",
];

const WINE_TYPES = ["Rosso", "Bianco", "Spumante", "Rosato", "Dolce"];

const LIVE_EVENTS: { wineryId: string; title: string; date: string }[] = [
  { wineryId: "WIN001", title: "Open Cellars Weekend", date: "14-15 Sett" },
  { wineryId: "WIN004", title: "Pinot Nero Harvest Tour", date: "21 Sett" },
  { wineryId: "WIN005", title: "Metodo Classico Disgorgamento", date: "28 Sett" },
  { wineryId: "WIN012", title: "Moscato & Dessert Tasting", date: "5 Ott" },
];

export default function WineMap() {
  const { t } = useApp();
  const [filterDenom, setFilterDenom] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterExport, setFilterExport] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [selected, setSelected] = useState<Winery | null>(null);

  const filtered = useMemo(() => {
    return wineries.filter((w) => {
      if (filterDenom !== "all" && !w.denominazioni.includes(filterDenom)) return false;
      if (filterType !== "all" && !w.tipologie.includes(filterType)) return false;
      if (filterExport && !w.exportReady) return false;
      return true;
    });
  }, [filterDenom, filterType, filterExport]);

  const liveEventMap = useMemo(() => {
    const map: Record<string, typeof LIVE_EVENTS> = {};
    LIVE_EVENTS.forEach((e) => {
      if (!map[e.wineryId]) map[e.wineryId] = [];
      map[e.wineryId].push(e);
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("nav.business")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{t("map.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">{t("map.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="bg-cream-50 rounded-xl border border-cream-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-bordeaux-400" />
          <select value={filterDenom} onChange={(e) => setFilterDenom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option value="all">{t("map.filter.denom.all")}</option>
            {DENOMINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option value="all">{t("map.filter.type.all")}</option>
            {WINE_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={() => setFilterExport(!filterExport)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterExport ? "bg-green-600 text-cream-50" : "bg-cream-200 text-bordeaux-700"}`}>
            {filterExport ? <Check className="w-4 h-4 inline mr-1" /> : null} Export Ready
          </button>
          <button onClick={() => setShowLive(!showLive)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${showLive ? "bg-bordeaux-800 text-cream-50" : "bg-cream-200 text-bordeaux-700"}`}>
            <Calendar className="w-4 h-4" /> {t("map.live")}
          </button>
          <span className="text-xs text-bordeaux-500 ml-auto">{filtered.length} {t("map.wineries")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Map */}
          <div className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-200 p-4 relative">
            <svg viewBox="0 0 100 80" className="w-full h-auto" style={{ minHeight: "400px" }}>
              {/* Hills background */}
              <defs>
                <linearGradient id="terrain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b7355" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#5c4a32" stopOpacity="0.25" />
                </linearGradient>
                <radialGradient id="vineyard">
                  <stop offset="0%" stopColor="#7c9050" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7c9050" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="100" height="80" fill="url(#terrain)" rx="8" />
              {/* Vineyard areas */}
              <ellipse cx="45" cy="40" rx="35" ry="25" fill="url(#vineyard)" />
              {/* Rivers - Po and Staffora approximations */}
              <path d="M 0 72 Q 30 68 50 70 T 100 74" fill="none" stroke="#6b8db5" strokeWidth="0.8" opacity="0.4" />
              <path d="M 55 0 Q 52 20 48 35 T 42 55" fill="none" stroke="#6b8db5" strokeWidth="0.5" opacity="0.3" />
              {/* Region labels */}
              <text x="15" y="15" fontSize="2.5" fill="#9b1238" opacity="0.4" fontWeight="600">OLTREPÒ PAVESE</text>
              <text x="75" y="75" fontSize="1.8" fill="#6b8db5" opacity="0.5">Fiume Po</text>
              {/* Winery pins */}
              {filtered.map((w) => {
                const hasLive = showLive && liveEventMap[w.id];
                return (
                  <g key={w.id} onClick={() => setSelected(w)} style={{ cursor: "pointer" }}>
                    {hasLive && (
                      <circle cx={w.coordinate.x} cy={w.coordinate.y} r="5" fill="#9b1238" opacity="0.2">
                        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={w.coordinate.x} cy={w.coordinate.y} r="2.2"
                      fill={w.exportReady ? "#9b1238" : "#8b7355"}
                      stroke="#f5e6c8" strokeWidth="0.6" className="hover:opacity-80 transition-opacity" />
                    {hasLive && (
                      <circle cx={w.coordinate.x + 3} cy={w.coordinate.y - 3} r="1.5" fill="#c89d2e">
                        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
              {/* Comune labels near pins */}
              {filtered.map((w) => (
                <text key={w.id + "-label"} x={w.coordinate.x + 2.5} y={w.coordinate.y - 1.5}
                  fontSize="1.4" fill="#5c4a32" opacity="0.7" fontWeight="500">
                  {w.comune}
                </text>
              ))}
            </svg>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-bordeaux-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-bordeaux-700 inline-block" /> Export Ready
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8b7355] inline-block" /> Non esporta
              </span>
              {showLive && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gold-500 inline-block animate-pulse" /> Evento in corso
                </span>
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-3">
            {selected ? (
              <div className="bg-cream-50 rounded-xl border border-gold-300 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-lg text-bordeaux-950">{selected.nome}</h3>
                    <p className="text-xs text-bordeaux-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {selected.comune} ({selected.provincia})</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-bordeaux-400 hover:text-bordeaux-700"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-bordeaux-600 mb-3">{selected.descrizione}</p>
                {selected.exportReady && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold mb-3">
                    <Check className="w-3 h-3" /> Export Ready
                  </span>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {selected.denominazioni.map((d) => <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-bordeaux-100 text-bordeaux-700">{d}</span>)}
                </div>
                {selected.esporta && (
                  <div className="mb-3">
                    <p className="text-[10px] text-bordeaux-400 mb-1 flex items-center gap-1"><Globe2 className="w-3 h-3" /> {t("directory.markets")}</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.paesiServiti.map((p) => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-gold-100 text-gold-700">{p}</span>)}
                    </div>
                  </div>
                )}
                {showLive && liveEventMap[selected.id] && (
                  <div className="p-2 rounded-lg bg-bordeaux-50 border border-bordeaux-200 mb-3">
                    <p className="text-[10px] font-semibold text-bordeaux-700 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3" /> {t("map.liveEvent")}</p>
                    {liveEventMap[selected.id].map((e) => (
                      <p key={e.title} className="text-xs text-bordeaux-600">{e.title} — {e.date}</p>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Link to={`/cantine`} className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
                    {t("directory.sendRfq")}
                  </Link>
                  <Link to={`/wine-sheet/${selected.id}`} className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-cream-200 text-bordeaux-700 hover:bg-cream-300 transition-colors">
                    {t("map.techSheet")}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-cream-50 rounded-xl border border-cream-200 p-5 text-center">
                <Wine className="w-8 h-8 text-bordeaux-300 mx-auto mb-2" />
                <p className="text-sm text-bordeaux-500">{t("map.clickPin")}</p>
              </div>
            )}

            {/* Live events list */}
            {showLive && (
              <div className="bg-bordeaux-50 rounded-xl border border-bordeaux-200 p-4">
                <p className="text-xs font-semibold text-bordeaux-700 flex items-center gap-1.5 mb-3">
                  <Calendar className="w-4 h-4 text-gold-600" /> {t("map.liveEvents")}
                </p>
                <div className="space-y-2">
                  {LIVE_EVENTS.map((e) => {
                    const w = wineries.find((x) => x.id === e.wineryId);
                    return (
                      <div key={e.title} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse shrink-0" />
                        <button onClick={() => w && setSelected(w)} className="text-left hover:text-gold-600 transition-colors">
                          <span className="font-medium text-bordeaux-700">{e.title}</span>
                          <span className="text-bordeaux-400"> — {w?.nome}, {e.date}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

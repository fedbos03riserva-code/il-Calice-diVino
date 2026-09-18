import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowDownWideNarrow } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog, filterWines, getUniqueRegions, getWineTypes } from "../data/wineCatalog";
import type { Wine } from "../types/wine";
import WineCard from "../components/WineCard";

const FASCIE: { value: string; label: string; range: string }[] = [
  { value: "all", label: "Tutte", range: "" },
  { value: "economico", label: "Economico", range: "€8–15" },
  { value: "standard", label: "Standard", range: "€15–30" },
  { value: "premium", label: "Premium", range: "€30–70" },
  { value: "lusso", label: "Lusso", range: "€70–200+" },
];

export default function Catalog() {
  const { t, addToCart } = useApp();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("all");
  const [regione, setRegione] = useState("all");
  const [fascia, setFascia] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "priceAsc" | "priceDesc">("default");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      setCatalog(cat);
      const regionParam = searchParams.get("regione");
      if (regionParam) {
        const decoded = regionParam.replace(/\+/g, " ");
        const match = cat.find((w) => w.regione === decoded);
        if (match) {
          setRegione(decoded);
          setShowFilters(true);
        }
      }
      setLoading(false);
    });
  }, [searchParams]);

  const regions = useMemo(() => getUniqueRegions(catalog), [catalog]);
  const types = useMemo(() => getWineTypes(catalog), [catalog]);

  const filtered = useMemo(() => {
    const result = filterWines(catalog, { tipo, regione, fascia, search });
    if (sortBy === "priceAsc") return [...result].sort((a, b) => a.prezzo - b.prezzo);
    if (sortBy === "priceDesc") return [...result].sort((a, b) => b.prezzo - a.prezzo);
    return result;
  }, [catalog, tipo, regione, fascia, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("catalog.title")}</h1>
        <p className="text-bordeaux-600 mt-1">{t("catalog.subtitle")}</p>
      </div>

      {/* Oltrepò badge */}
      <div className="mb-6 p-4 rounded-xl bg-bordeaux-950 text-cream-100 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-gold-400" />
        <div>
          <p className="font-serif text-lg text-cream-50">{t("catalog.tabOltrepo")}</p>
          <p className="text-xs text-cream-300">{catalog.length} vini dell'Oltrepò Pavese — 7 DOC/DOCG, 10 vitigni, 12 cantine</p>
        </div>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("catalog.search")}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-bordeaux-700 hover:bg-cream-200 transition-colors text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtri</span>
        </button>
        <div className="relative">
          <ArrowDownWideNarrow className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="pl-9 pr-3 py-2.5 rounded-lg bg-cream-100 border border-cream-300 text-bordeaux-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
          >
            <option value="default">{t("catalog.sort.default")}</option>
            <option value="priceAsc">{t("catalog.sort.priceAsc")}</option>
            <option value="priceDesc">{t("catalog.sort.priceDesc")}</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 animate-fade-in">
          {/* Tipo vino */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">{t("catalog.filter.type")}</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("catalog.filter.all")}</option>
              {types.map((tp) => <option key={tp} value={tp}>{t(`type.${tp}`)}</option>)}
            </select>
          </div>

          {/* Regione */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">{t("catalog.filter.region")}</label>
            <select value={regione} onChange={(e) => setRegione(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("catalog.filter.all")}</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Fascia prezzo */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">{t("catalog.filter.price")}</label>
            <select value={fascia} onChange={(e) => setFascia(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              {FASCIE.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.value === "all" ? t("catalog.filter.all") : `${f.label} (${f.range})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <p className="text-sm text-bordeaux-600 mb-4">
        {filtered.length} {t("catalog.results")}
      </p>

      {tipo === "Champagne" && (
        <div className="mb-6 p-4 rounded-xl bg-gold-50 border border-gold-200">
          <p className="text-sm text-bordeaux-700"><strong className="font-serif text-base text-bordeaux-950">Champagne</strong> — Vini spumanti prodotti con Metodo Classico (refermentazione in bottiglia). Caratterizzati da perlage fine, note di pane tostato e brioche dovute all'autolisi dei lieviti. L'Oltrepò Pavese e la zona italiana a maggior produzione di Pinot Nero per spumanti metodo classico.</p>
        </div>
      )}
      {tipo === "Fortificato" && (
        <div className="mb-6 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
          <p className="text-sm text-bordeaux-700"><strong className="font-serif text-base text-bordeaux-950">Fortificato</strong> — Vini ai quali e stata aggiunta acquavite o alcol per arrestare la fermentazione e innalzare la gradazione (16-20% vol). Il processo mantiene zuccheri residui elevati e produce aromi complessi: frutta secca, caramello, tabacco, spezie. Esempi classici: Marsala, Port, Sherry, Madeira. Si abbinano a formaggi stagionati, dolci e cioccolato.</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-cream-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((wine) => (
            <WineCard key={wine.id} wine={wine} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

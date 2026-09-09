import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog, filterWines, getUniqueRegions, getUniqueContinents, getUniqueCountries, getWineTypes, getContinent } from "../data/wineCatalog";
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
  const [continente, setContinente] = useState("all");
  const [paese, setPaese] = useState("all");
  const [fascia, setFascia] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      setCatalog(cat);
      setLoading(false);
    });
  }, []);

  const continents = useMemo(() => getUniqueContinents(catalog), [catalog]);
  const countries = useMemo(() => {
    if (continente === "all") return getUniqueCountries(catalog);
    return [...new Set(catalog.filter((w) => getContinent(w) === continente).map((w) => w.continente))].sort();
  }, [catalog, continente]);
  const regions = useMemo(() => {
    let filtered = catalog;
    if (continente !== "all") filtered = filtered.filter((w) => getContinent(w) === continente);
    if (paese !== "all") filtered = filtered.filter((w) => w.continente === paese);
    return getUniqueRegions(filtered);
  }, [catalog, continente, paese]);
  const types = useMemo(() => getWineTypes(catalog), [catalog]);

  const filtered = useMemo(() => {
    return filterWines(catalog, { tipo, regione, continente, fascia, search });
  }, [catalog, tipo, regione, continente, fascia, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950">{t("catalog.title")}</h1>
        <p className="text-bordeaux-600 mt-1">{t("catalog.subtitle")}</p>
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
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 animate-fade-in">
          {/* Tipo vino */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">{t("catalog.filter.type")}</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("catalog.filter.all")}</option>
              {types.map((tp) => <option key={tp} value={tp}>{t(`type.${tp}`)}</option>)}
            </select>
          </div>

          {/* Continente */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">Continente</label>
            <select value={continente} onChange={(e) => { setContinente(e.target.value); setPaese("all"); setRegione("all"); }}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("catalog.filter.all")}</option>
              {continents.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Paese */}
          <div>
            <label className="text-xs text-bordeaux-600 mb-1 block">Paese</label>
            <select value={paese} onChange={(e) => { setPaese(e.target.value); setRegione("all"); }}
              className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("catalog.filter.all")}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
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

          {/* Fascia prezzo con range */}
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

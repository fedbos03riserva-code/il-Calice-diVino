import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Globe2, Check, X, MapPin, Wine, Layers, Languages, FileText, QrCode as QrCodeIcon, Download, Map as MapIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { wineries, type Winery } from "../data/wineryDirectory";
import { QRCodeSVG } from "qrcode.react";

function downloadWineryQR(winery: Winery) {
  const svg = document.getElementById(`dir-qr-${winery.id}`);
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const dlUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = dlUrl;
  a.download = `qr-${winery.id}-${winery.nome.replace(/\s+/g, "-").toLowerCase()}.svg`;
  a.click();
  URL.revokeObjectURL(dlUrl);
}

export default function WineryDirectory() {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const [filterExport, setFilterExport] = useState<"all" | "yes" | "no">("all");
  const [filterCert, setFilterCert] = useState<string>("all");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [selected, setSelected] = useState<Winery | null>(null);

  const allCerts = useMemo(() => {
    const set = new Set<string>();
    wineries.forEach((w) => w.certificazioni.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, []);

  const allLangs = useMemo(() => {
    const set = new Set<string>();
    wineries.forEach((w) => w.lingueTeam.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return wineries.filter((w) => {
      if (search && !w.nome.toLowerCase().includes(search.toLowerCase()) && !w.comune.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterExport === "yes" && !w.esporta) return false;
      if (filterExport === "no" && w.esporta) return false;
      if (filterCert !== "all" && !w.certificazioni.includes(filterCert)) return false;
      if (filterLang !== "all" && !w.lingueTeam.includes(filterLang)) return false;
      return true;
    });
  }, [search, filterExport, filterCert, filterLang]);

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("nav.business")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{t("directory.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">{t("directory.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="bg-cream-50 rounded-xl border border-cream-200 p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("directory.search")}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <select value={filterExport} onChange={(e) => setFilterExport(e.target.value as "all" | "yes" | "no")}
              className="px-3 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("directory.filter.export.all")}</option>
              <option value="yes">{t("directory.filter.export.yes")}</option>
              <option value="no">{t("directory.filter.export.no")}</option>
            </select>
            <select value={filterCert} onChange={(e) => setFilterCert(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("directory.filter.cert.all")}</option>
              {allCerts.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="all">{t("directory.filter.lang.all")}</option>
              {allLangs.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-bordeaux-500">
            <Filter className="w-3.5 h-3.5" />
            <span>{filtered.length} {t("directory.results")}</span>
            <span className="text-gold-600">·</span>
            <span className="text-green-700 font-medium">{filtered.filter((w) => w.exportReady).length} {t("directory.exportReady")}</span>
          </div>
        </div>

        {/* Winery cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <div key={w.id} className="bg-cream-50 rounded-xl border border-cream-200 p-5 hover:border-gold-300 transition-colors cursor-pointer"
              onClick={() => setSelected(w)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg text-bordeaux-950">{w.nome}</h3>
                  <p className="text-xs text-bordeaux-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {w.comune} ({w.provincia})
                  </p>
                </div>
                {w.exportReady && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-600 text-cream-50 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Export Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-bordeaux-600 line-clamp-2 mb-3">{w.descrizione}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {w.denominazioni.slice(0, 3).map((d) => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-bordeaux-100 text-bordeaux-700">{d}</span>
                ))}
                {w.denominazioni.length > 3 && <span className="text-[10px] px-2 py-0.5 text-bordeaux-400">+{w.denominazioni.length - 3}</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-bordeaux-400">{t("directory.capacity")}</p>
                  <p className="font-semibold text-bordeaux-700">{w.capacitaProduttiva.toLocaleString()} hl</p>
                </div>
                <div>
                  <p className="text-bordeaux-400">MOQ</p>
                  <p className="font-semibold text-bordeaux-700">{w.moq} bt</p>
                </div>
                <div>
                  <p className="text-bordeaux-400">FOB</p>
                  <p className="font-semibold text-bordeaux-700">€{w.prezzoFOB.toFixed(2)}</p>
                </div>
              </div>
              {w.esporta && (
                <div className="mt-3 pt-3 border-t border-cream-200">
                  <p className="text-[10px] text-bordeaux-400 mb-1">{t("directory.markets")}</p>
                  <div className="flex flex-wrap gap-1">
                    {w.paesiServiti.slice(0, 4).map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-gold-100 text-gold-700">{p}</span>
                    ))}
                    {w.paesiServiti.length > 4 && <span className="text-[10px] text-bordeaux-400">+{w.paesiServiti.length - 4}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bordeaux-950/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <div className="bg-cream-50 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gold-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-bordeaux-950 text-cream-50 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-cream-50">{selected.nome}</h2>
                  <p className="text-xs text-cream-300 flex items-center gap-1"><MapPin className="w-3 h-3" /> {selected.comune} ({selected.provincia}) · {t("directory.founded")} {selected.annoFondazione}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-cream-300 hover:text-gold-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-bordeaux-700 leading-relaxed">{selected.descrizione}</p>

                {selected.exportReady && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{t("directory.readyBadge")}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-cream-100">
                    <p className="text-xs text-bordeaux-400 flex items-center gap-1"><Layers className="w-3 h-3" /> {t("directory.hectares")}</p>
                    <p className="font-serif text-lg text-bordeaux-950">{selected.ettari} ha</p>
                  </div>
                  <div className="p-3 rounded-lg bg-cream-100">
                    <p className="text-xs text-bordeaux-400 flex items-center gap-1"><Wine className="w-3 h-3" /> {t("directory.capacity")}</p>
                    <p className="font-serif text-lg text-bordeaux-950">{selected.capacitaProduttiva.toLocaleString()} hl/anno</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 mb-2">{t("directory.denominations")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.denominazioni.map((d) => <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-100 text-bordeaux-700">{d}</span>)}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 mb-2">{t("directory.certifications")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.certificazioni.map((c) => <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">{c}</span>)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><p className="text-xs text-bordeaux-400">MOQ</p><p className="font-semibold text-bordeaux-700">{selected.moq} bt</p></div>
                  <div><p className="text-xs text-bordeaux-400">FOB €/bt</p><p className="font-semibold text-bordeaux-700">€{selected.prezzoFOB.toFixed(2)}</p></div>
                  <div><p className="text-xs text-bordeaux-400">{t("directory.incoterms")}</p><p className="font-semibold text-bordeaux-700">{selected.incoterms.join(", ")}</p></div>
                  <div><p className="text-xs text-bordeaux-400">{t("directory.contact")}</p><p className="font-semibold text-bordeaux-700 text-xs">{selected.contatti.email}</p></div>
                </div>

                {selected.esporta && (
                  <div>
                    <p className="text-xs font-semibold text-bordeaux-700 mb-2 flex items-center gap-1"><Globe2 className="w-3 h-3" /> {t("directory.markets")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.paesiServiti.map((p) => <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-gold-100 text-gold-700">{p}</span>)}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-bordeaux-700 mb-2 flex items-center gap-1"><Languages className="w-3 h-3" /> {t("directory.teamLangs")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.lingueTeam.map((l) => <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-700 text-cream-50">{l}</span>)}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
                  <div className="bg-cream-50 p-2 rounded-lg border border-cream-300 shrink-0">
                    <QRCodeSVG id={`dir-qr-${selected.id}`} value={`${window.location.origin}/wine-sheet/${selected.id}`} size={100} level="M" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-bordeaux-700 flex items-center gap-1 mb-1"><QrCodeIcon className="w-3.5 h-3.5" /> {t("techsheet.qr")}</p>
                    <p className="text-xs text-bordeaux-500 mb-2">{t("techsheet.qr.desc")}</p>
                    <button onClick={() => downloadWineryQR(selected)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors">
                      <Download className="w-3.5 h-3.5" /> {t("techsheet.qr.download")}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/rfq?cantina=${selected.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
                    <FileText className="w-4 h-4" /> {t("directory.sendRfq")}
                  </Link>
                  <Link to={`/wine-sheet/${selected.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
                    <FileText className="w-4 h-4" /> {t("map.techSheet")}
                  </Link>
                </div>
                <Link to="/mappa" className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-cream-100 text-bordeaux-600 font-medium hover:bg-cream-200 transition-colors text-sm">
                  <MapIcon className="w-4 h-4" /> {t("map.title")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

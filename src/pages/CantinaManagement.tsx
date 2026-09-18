import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, Wine, Package, TrendingUp, Eye, QrCode, Globe, MapPin, Phone, Mail, BarChart3, ArrowRight, Loader2 } from "lucide-react";
import { loadWineCatalog } from "../data/wineCatalog";
import { wineries, getWineryById, type Winery } from "../data/wineryDirectory";
import type { Wine as WineType } from "../types/wine";

export default function CantinaManagement() {
  const [selectedWineryId, setSelectedWineryId] = useState<string>("");
  const [catalog, setCatalog] = useState<WineType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"panoramica" | "vini" | "profilo">("panoramica");

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      setCatalog(cat);
      setLoading(false);
    });
  }, []);

  const selectedWinery: Winery | undefined = selectedWineryId ? getWineryById(selectedWineryId) : undefined;
  const wineryWines = selectedWinery ? catalog.filter((w) => w.nome.toLowerCase().includes(selectedWinery.nome.toLowerCase().split(" ")[0].toLowerCase())) : [];

  const totalWineryValue = wineryWines.reduce((sum, w) => sum + w.prezzo, 0);
  const avgPrice = wineryWines.length > 0 ? (totalWineryValue / wineryWines.length).toFixed(2) : "0";
  const byType: Record<string, number> = {};
  wineryWines.forEach((w) => { byType[w.tipo] = (byType[w.tipo] || 0) + 1; });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bordeaux-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" /> Area Cantina
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">Gestione Cantina</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">
            Seleziona la tua cantina per gestire i vini, visualizzare le statistiche e aggiornare il profilo export.
          </p>
        </div>

        {/* Winery selector */}
        {!selectedWinery && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-bordeaux-700 mb-2">Seleziona la tua cantina:</p>
            {wineries.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWineryId(w.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center shrink-0">
                  <Wine className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-bordeaux-950">{w.nome}</h3>
                  <p className="text-xs text-bordeaux-500">{w.comune} (PV) · {w.ettari} ettari · {w.capacitaProduttiva} hl/anno</p>
                </div>
                <div className="flex items-center gap-2">
                  {w.exportReady && <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Export Ready</span>}
                  <ArrowRight className="w-4 h-4 text-bordeaux-400 group-hover:text-gold-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Winery dashboard */}
        {selectedWinery && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center">
                  <Store className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-bordeaux-950">{selectedWinery.nome}</h2>
                  <p className="text-xs text-bordeaux-500">{selectedWinery.comune} (PV) · Fondata nel {selectedWinery.annoFondazione}</p>
                </div>
              </div>
              <button onClick={() => setSelectedWineryId("")} className="text-sm text-bordeaux-600 hover:text-gold-600">
                Cambia cantina
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 mb-6 border-b border-cream-200 pb-3">
              {[
                { id: "panoramica", label: "Panoramica", icon: BarChart3 },
                { id: "vini", label: "I miei vini", icon: Wine },
                { id: "profilo", label: "Profilo export", icon: Globe },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as typeof tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                    tab === item.id ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600 hover:bg-cream-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Panoramica */}
            {tab === "panoramica" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                    <Wine className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                    <p className="font-serif text-2xl text-cream-50">{wineryWines.length}</p>
                    <p className="text-xs text-cream-300">Vini in catalogo</p>
                  </div>
                  <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                    <p className="font-serif text-2xl text-cream-50">EUR {avgPrice}</p>
                    <p className="text-xs text-cream-300">Prezzo medio</p>
                  </div>
                  <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                    <Package className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                    <p className="font-serif text-2xl text-cream-50">{selectedWinery.moq}</p>
                    <p className="text-xs text-cream-300">MOQ (bottiglie)</p>
                  </div>
                  <div className="bg-bordeaux-950 rounded-xl p-4 text-center">
                    <Globe className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                    <p className="font-serif text-2xl text-cream-50">{selectedWinery.paesiServiti.length}</p>
                    <p className="text-xs text-cream-300">Paesi serviti</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Distribuzione per tipo</h3>
                  <div className="space-y-2">
                    {Object.entries(byType).map(([tipo, count]) => (
                      <div key={tipo} className="flex items-center gap-3">
                        <span className="text-sm text-bordeaux-700 w-24">{tipo}</span>
                        <div className="flex-1 h-6 rounded-full bg-cream-100 overflow-hidden">
                          <div className="h-6 rounded-full bg-bordeaux-700 flex items-center justify-end pr-2" style={{ width: `${(count / wineryWines.length) * 100}%` }}>
                            <span className="text-xs text-cream-50 font-semibold">{count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {wineryWines.length === 0 && <p className="text-sm text-bordeaux-400">Nessun vino trovato per questa cantina nel catalogo.</p>}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gold-50 border border-gold-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-2">Stato export</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${selectedWinery.exportReady ? "bg-green-100 text-green-700 border border-green-300" : "bg-amber-100 text-amber-700 border border-amber-300"}`}>
                      {selectedWinery.exportReady ? "Export Ready" : "Non export ready"}
                    </span>
                    <span className="text-xs text-bordeaux-500">FOB: EUR {selectedWinery.prezzoFOB}/bottiglia</span>
                  </div>
                  <p className="text-xs text-bordeaux-600">{selectedWinery.descrizione}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedWinery.certificazioni.map((c) => (
                      <span key={c} className="text-xs px-2 py-1 rounded-full bg-cream-100 text-bordeaux-700 border border-cream-200">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Vini */}
            {tab === "vini" && (
              <div className="space-y-3">
                {wineryWines.length === 0 ? (
                  <div className="p-8 rounded-xl bg-cream-50 border border-cream-200 text-center">
                    <Wine className="w-10 h-10 text-bordeaux-300 mx-auto mb-3" />
                    <p className="text-sm text-bordeaux-600">Nessun vino trovato nel catalogo per {selectedWinery.nome}.</p>
                    <p className="text-xs text-bordeaux-400 mt-1">I vini vengono abbinati automaticamente in base al nome della cantina.</p>
                  </div>
                ) : (
                  wineryWines.map((w) => (
                    <div key={w.id} className="flex items-center gap-4 p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
                        <Wine className="w-5 h-5 text-gold-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/wine/${w.id}`} className="font-medium text-sm text-bordeaux-950 hover:text-bordeaux-700 truncate block">
                          {w.nome}
                        </Link>
                        <p className="text-xs text-bordeaux-500 mt-0.5">{w.tipo} · {w.uva} · EUR {w.prezzo.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/wine-sheet/${w.id}`} className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 transition-colors" title="Scheda tecnica">
                          <Eye className="w-4 h-4 text-bordeaux-600" />
                        </Link>
                        <Link to={`/qr-cantina`} className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 transition-colors" title="QR Code">
                          <QrCode className="w-4 h-4 text-bordeaux-600" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profilo export */}
            {tab === "profilo" && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Informazioni cantina</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-bordeaux-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Comune</p>
                      <p className="text-sm text-bordeaux-950">{selectedWinery.comune} ({selectedWinery.provincia})</p>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Fondazione</p>
                      <p className="text-sm text-bordeaux-950">{selectedWinery.annoFondazione}</p>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Ettari</p>
                      <p className="text-sm text-bordeaux-950">{selectedWinery.ettari} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Capacita produttiva</p>
                      <p className="text-sm text-bordeaux-950">{selectedWinery.capacitaProduttiva} hl/anno</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Export data</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-bordeaux-500">MOQ</p>
                      <p className="text-sm text-bordeaux-950">{selectedWinery.moq} bottiglie</p>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Prezzo FOB</p>
                      <p className="text-sm text-bordeaux-950">EUR {selectedWinery.prezzoFOB}/bottiglia</p>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Incoterms</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedWinery.incoterms.map((ic) => (
                          <span key={ic} className="text-xs px-2 py-1 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">{ic}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-bordeaux-500">Lingue team</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedWinery.lingueTeam.map((l) => (
                          <span key={l} className="text-xs px-2 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Contatti</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-bordeaux-700 flex items-center gap-2"><Mail className="w-4 h-4 text-bordeaux-500" /> {selectedWinery.contatti.email}</p>
                    <p className="text-sm text-bordeaux-700 flex items-center gap-2"><Phone className="w-4 h-4 text-bordeaux-500" /> {selectedWinery.contatti.telefono}</p>
                    <p className="text-sm text-bordeaux-700 flex items-center gap-2"><Globe className="w-4 h-4 text-bordeaux-500" /> {selectedWinery.contatti.sito}</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
                  <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Paesi serviti</h3>
                  {selectedWinery.paesiServiti.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedWinery.paesiServiti.map((p) => (
                        <span key={p} className="text-sm px-3 py-1.5 rounded-full bg-cream-50 text-bordeaux-700 border border-cream-200">{p}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-bordeaux-500">Nessun paese servito attualmente. Potenziale export da sviluppare.</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/qr-cantina" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
                    <QrCode className="w-4 h-4" /> Gestisci QR Code
                  </Link>
                  <Link to="/rfq" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
                    <Package className="w-4 h-4" /> Vedi richieste RFQ
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

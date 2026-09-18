import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, Wine, Package, TrendingUp, Eye, QrCode, Globe, MapPin, Phone, Mail, BarChart3, ArrowRight, Loader2, Sparkles, Save, Check, Edit3, X, Plus, Brain, Target, Lightbulb, Flag, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { loadWineCatalog } from "../data/wineCatalog";
import { getWineryById, type Winery } from "../data/wineryDirectory";
import type { Wine as WineType } from "../types/wine";
import { supabase } from "../lib/supabase";

interface WineryEdit {
  moq: number;
  prezzoFOB: number;
  email: string;
  telefono: string;
  sito: string;
  descrizione: string;
  paesiServiti: string[];
  incoterms: string[];
  certificazioni: string[];
  exportReady: boolean;
}

export default function CantinaManagement() {
  const { user } = useApp();
  const [catalog, setCatalog] = useState<WineType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"panoramica" | "vini" | "profilo" | "modifica" | "ai-export">("panoramica");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<WineryEdit | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [aiExportLoading, setAiExportLoading] = useState(false);
  const [aiExportResult, setAiExportResult] = useState<any>(null);
  const [aiExportError, setAiExportError] = useState<string | null>(null);

  useEffect(() => {
    loadWineCatalog().then((cat) => {
      setCatalog(cat);
      setLoading(false);
    });
  }, []);

  const selectedWinery: Winery | undefined = user?.wineryId ? getWineryById(user.wineryId) : undefined;
  const wineryWines = selectedWinery
    ? catalog.filter((w) => w.nome.toLowerCase().includes(selectedWinery.nome.toLowerCase().split(" ")[0].toLowerCase()))
    : [];

  const avgPrice = wineryWines.length > 0 ? (wineryWines.reduce((sum, w) => sum + w.prezzo, 0) / wineryWines.length).toFixed(2) : "0";
  const byType: Record<string, number> = {};
  wineryWines.forEach((w) => { byType[w.tipo] = (byType[w.tipo] || 0) + 1; });

  const startEditing = () => {
    if (!selectedWinery) return;
    setEditData({
      moq: selectedWinery.moq,
      prezzoFOB: selectedWinery.prezzoFOB,
      email: selectedWinery.contatti.email,
      telefono: selectedWinery.contatti.telefono,
      sito: selectedWinery.contatti.sito,
      descrizione: selectedWinery.descrizione,
      paesiServiti: [...selectedWinery.paesiServiti],
      incoterms: [...selectedWinery.incoterms],
      certificazioni: [...selectedWinery.certificazioni],
      exportReady: selectedWinery.exportReady,
    });
    setEditing(true);
    setTab("modifica");
  };

  const handleSave = async () => {
    if (!editData || !selectedWinery || !user?.wineryId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("winery_qr_data")
        .upsert({
          winery_id: user.wineryId,
          moq: editData.moq,
          prezzo_fob: editData.prezzoFOB,
          email: editData.email,
          telefono: editData.telefono,
          sito: editData.sito,
          descrizione: editData.descrizione,
          paesi_serviti: editData.paesiServiti,
          incoterms: editData.incoterms,
          certificazioni: editData.certificazioni,
          export_ready: editData.exportReady,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setSavedMsg(true);
      setEditing(false);
      setTab("profilo");
      setTimeout(() => setSavedMsg(false), 3000);
    } catch {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addCountry = () => {
    if (!newCountry.trim() || !editData) return;
    setEditData({ ...editData, paesiServiti: [...editData.paesiServiti, newCountry.trim()] });
    setNewCountry("");
  };

  const removeCountry = (c: string) => {
    if (!editData) return;
    setEditData({ ...editData, paesiServiti: editData.paesiServiti.filter((p) => p !== c) });
  };

  const runAIExportAnalysis = async () => {
    if (!selectedWinery) return;
    setAiExportLoading(true);
    setAiExportError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-winery-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({
          query: `Analizza il profilo export di questa cantina e suggerisci: 1) 3 mercati target prioritari non ancora serviti, 2) ottimizzazioni del prezzo FOB per essere competitivi, 3) certificazioni mancanti che aumenterebbero l'attrattivita, 4) strategia di posizionamento per fiere export. Cantina: ${selectedWinery.nome}, ${selectedWinery.comune}, ettari ${selectedWinery.ettari}, capacita ${selectedWinery.capacitaProduttiva} hl, MOQ ${selectedWinery.moq}, FOB ${selectedWinery.prezzoFOB} EUR, certificazioni: ${selectedWinery.certificazioni.join(", ") || "nessuna"}, paesi serviti: ${selectedWinery.paesiServiti.join(", ") || "nessuno"}, incoterms: ${selectedWinery.incoterms.join(", ")}`,
          wineries: [{ id: selectedWinery.id, nome: selectedWinery.nome, tipo: "Rosso,Bianco,Spumante", exportReady: selectedWinery.exportReady }],
          lang: "it",
          mode: "export-analysis",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiExportResult(data);
      } else {
        const errData = await response.json().catch(() => null);
        if (errData?.error === "AI_NOT_CONFIGURED") {
          setAiExportError("AI non configurata. Mostrando suggerimenti base.");
        } else {
          setAiExportError("Analisi AI non disponibile. Riprova piu tardi.");
        }
      }
    } catch {
      setAiExportError("Errore di connessione. Riprova.");
    }
    setAiExportLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bordeaux-600" />
      </div>
    );
  }

  if (!user || user.role !== "cantina") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bordeaux-950 flex items-center justify-center">
          <Store className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">Area Cantina</h1>
        <p className="text-sm text-bordeaux-500 mb-6">Accedi con un account cantina per gestire i tuoi vini e il tuo profilo export.</p>
        <Link to="/account" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
          <ArrowRight className="w-4 h-4" /> Accedi o registrati
        </Link>
      </div>
    );
  }

  if (!selectedWinery) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bordeaux-950 flex items-center justify-center">
          <Wine className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">Cantina non configurata</h1>
        <p className="text-sm text-bordeaux-500 mb-6">Il tuo account non e collegato a una cantina specifica. Contatta l'assistenza per configurare il profilo cantina.</p>
        <a href="mailto:cantina@bf45wine.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
          <Mail className="w-4 h-4" /> Contatta l'assistenza
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {savedMsg && (
          <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-green-600 text-cream-50 text-sm font-medium flex items-center gap-2 animate-fade-in shadow-lg">
            <Check className="w-4 h-4" /> Modifiche salvate con successo
          </div>
        )}

        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" /> Area Cantina
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{selectedWinery.nome}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">
            {selectedWinery.comune} (PV) · Fondata nel {selectedWinery.annoFondazione} · {selectedWinery.ettari} ettari
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center">
              <Store className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-bordeaux-950">Gestione Cantina</h2>
              <p className="text-xs text-bordeaux-500">Benvenuto, {user.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedWinery.exportReady && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">Export Ready</span>
            )}
            {!editing && (
              <button onClick={startEditing} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 text-sm font-medium hover:bg-gold-300 transition-colors">
                <Edit3 className="w-4 h-4" /> Modifica profilo
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-cream-200 pb-3 overflow-x-auto">
          {[
            { id: "panoramica", label: "Panoramica", icon: BarChart3 },
            { id: "vini", label: "I miei vini", icon: Wine },
            { id: "profilo", label: "Profilo export", icon: Globe },
            { id: "ai-export", label: "AI Export", icon: Brain },
            ...(editing ? [{ id: "modifica", label: "Modifica", icon: Edit3 }] : []),
          ].map((item) => (
            <button key={item.id} onClick={() => setTab(item.id as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${tab === item.id ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600 hover:bg-cream-100"}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

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
                <p className="font-serif text-2xl text-cream-50">&euro;{avgPrice}</p>
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
                <span className="text-xs text-bordeaux-500">FOB: &euro;{selectedWinery.prezzoFOB}/bottiglia</span>
              </div>
              <p className="text-xs text-bordeaux-600">{selectedWinery.descrizione}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedWinery.certificazioni.map((c) => (
                  <span key={c} className="text-xs px-2 py-1 rounded-full bg-cream-100 text-bordeaux-700 border border-cream-200">{c}</span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-gold-50 to-cream-100 border border-gold-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-gold-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-bordeaux-950">Passa a Cantina Pro</h3>
                  <p className="text-sm text-bordeaux-600 mt-1">Sblocca AI matching con buyer esteri, QR dinamico e analytics avanzate.</p>
                  <Link to="/premium-cantina" className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gold-400 text-bordeaux-950 text-sm font-semibold hover:bg-gold-300 transition-colors">
                    Scopri i piani <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <p className="text-xs text-bordeaux-500 mt-0.5">{w.tipo} · {w.uva} · &euro;{w.prezzo.toFixed(2)}</p>
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

        {tab === "profilo" && !editing && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Informazioni cantina</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><p className="text-xs text-bordeaux-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Comune</p><p className="text-sm text-bordeaux-950">{selectedWinery.comune} ({selectedWinery.provincia})</p></div>
                <div><p className="text-xs text-bordeaux-500">Fondazione</p><p className="text-sm text-bordeaux-950">{selectedWinery.annoFondazione}</p></div>
                <div><p className="text-xs text-bordeaux-500">Ettari</p><p className="text-sm text-bordeaux-950">{selectedWinery.ettari} ha</p></div>
                <div><p className="text-xs text-bordeaux-500">Capacita produttiva</p><p className="text-sm text-bordeaux-950">{selectedWinery.capacitaProduttiva} hl/anno</p></div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Export data</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><p className="text-xs text-bordeaux-500">MOQ</p><p className="text-sm text-bordeaux-950">{selectedWinery.moq} bottiglie</p></div>
                <div><p className="text-xs text-bordeaux-500">Prezzo FOB</p><p className="text-sm text-bordeaux-950">&euro;{selectedWinery.prezzoFOB}/bottiglia</p></div>
                <div>
                  <p className="text-xs text-bordeaux-500">Incoterms</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">{selectedWinery.incoterms.map((ic) => <span key={ic} className="text-xs px-2 py-1 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">{ic}</span>)}</div>
                </div>
                <div>
                  <p className="text-xs text-bordeaux-500">Lingue team</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">{selectedWinery.lingueTeam.map((l) => <span key={l} className="text-xs px-2 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200">{l}</span>)}</div>
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
                <div className="flex flex-wrap gap-2">{selectedWinery.paesiServiti.map((p) => <span key={p} className="text-sm px-3 py-1.5 rounded-full bg-cream-50 text-bordeaux-700 border border-cream-200">{p}</span>)}</div>
              ) : (
                <p className="text-sm text-bordeaux-500">Nessun paese servito attualmente. Potenziale export da sviluppare.</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={startEditing} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm">
                <Edit3 className="w-4 h-4" /> Modifica profilo export
              </button>
              <Link to="/qr-cantina" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
                <QrCode className="w-4 h-4" /> Gestisci QR Code
              </Link>
              <Link to="/premium-cantina" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
                <Sparkles className="w-4 h-4" /> Passa a Cantina Pro
              </Link>
            </div>
          </div>
        )}

        {tab === "modifica" && editing && editData && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Modifica dati export</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">MOQ (bottiglie minimo ordine)</label>
                  <input type="number" value={editData.moq} onChange={(e) => setEditData({ ...editData, moq: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">Prezzo FOB (&euro;/bottiglia)</label>
                  <input type="number" step="0.5" value={editData.prezzoFOB} onChange={(e) => setEditData({ ...editData, prezzoFOB: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-4">Contatti</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">Email</label>
                  <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">Telefono</label>
                  <input type="text" value={editData.telefono} onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">Sito web</label>
                  <input type="text" value={editData.sito} onChange={(e) => setEditData({ ...editData, sito: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="text-xs text-bordeaux-500 block mb-1">Export Ready</label>
                  <button onClick={() => setEditData({ ...editData, exportReady: !editData.exportReady })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${editData.exportReady ? "bg-green-100 text-green-700 border border-green-300" : "bg-cream-100 text-bordeaux-600 border border-cream-300"}`}>
                    {editData.exportReady ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {editData.exportReady ? "Export Ready" : "Non export ready"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <label className="text-xs text-bordeaux-500 block mb-1">Descrizione cantina</label>
              <textarea value={editData.descrizione} onChange={(e) => setEditData({ ...editData, descrizione: e.target.value })} rows={3}
                className="w-full px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>

            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Paesi serviti</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {editData.paesiServiti.map((c) => (
                  <span key={c} className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">
                    {c}
                    <button onClick={() => removeCountry(c)} className="text-bordeaux-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="Aggiungi paese..."
                  className="flex-1 px-3 py-2 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <button onClick={addCountry} className="px-3 py-2 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Incoterms</h3>
              <div className="flex flex-wrap gap-2">
                {["EXW", "FOB", "CIF", "DDP", "FCA", "DAP"].map((ic) => (
                  <button key={ic} onClick={() => setEditData({ ...editData, incoterms: editData.incoterms.includes(ic) ? editData.incoterms.filter((x) => x !== ic) : [...editData.incoterms, ic] })}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${editData.incoterms.includes(ic) ? "bg-bordeaux-800 text-cream-50" : "bg-cream-100 text-bordeaux-600 border border-cream-300"}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
              <h3 className="font-serif text-lg text-bordeaux-950 mb-3">Certificazioni</h3>
              <div className="flex flex-wrap gap-2">
                {["Bio EU", "Vegan", "ISO 22000", "BRC", "IFS", "Biodinamico", "Demeter"].map((c) => (
                  <button key={c} onClick={() => setEditData({ ...editData, certificazioni: editData.certificazioni.includes(c) ? editData.certificazioni.filter((x) => x !== c) : [...editData.certificazioni, c] })}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${editData.certificazioni.includes(c) ? "bg-green-700 text-cream-50" : "bg-cream-100 text-bordeaux-600 border border-cream-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 sticky bottom-4">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm disabled:opacity-50 flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salva modifiche
              </button>
              <button onClick={() => { setEditing(false); setTab("profilo"); }}
                className="px-6 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
                Annulla
              </button>
            </div>
          </div>
        )}

        {tab === "ai-export" && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold-400/20 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-gold-400">AI Export Assistant</h3>
                  <p className="text-sm text-cream-200 mt-1">L'AI analizza il profilo della tua cantina e suggerisce mercati target, ottimizzazioni del prezzo FOB, certificazioni strategiche e posizionamento per fiere export.</p>
                  <button
                    onClick={runAIExportAnalysis}
                    disabled={aiExportLoading}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm disabled:opacity-50"
                  >
                    {aiExportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {aiExportLoading ? "Analisi in corso..." : "Avvia analisi AI"}
                  </button>
                </div>
              </div>
            </div>

            {aiExportError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{aiExportError}</p>
              </div>
            )}

            {aiExportResult && (
              <div className="space-y-4">
                {aiExportResult.sintesi && (
                  <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-bordeaux-950 uppercase tracking-wider mb-2">Sintesi AI</p>
                        <p className="text-sm text-bordeaux-700 leading-relaxed">{aiExportResult.sintesi}</p>
                      </div>
                    </div>
                  </div>
                )}
                {aiExportResult.matches && aiExportResult.matches.length > 0 && (
                  <div className="p-5 rounded-xl bg-cream-50 border border-cream-200">
                    <p className="text-xs font-semibold text-bordeaux-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-bordeaux-600" /> Mercati target suggeriti
                    </p>
                    <div className="space-y-3">
                      {aiExportResult.matches.map((m: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-bordeaux-50 border border-bordeaux-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-bordeaux-950 flex items-center gap-1.5">
                              <Flag className="w-3.5 h-3.5 text-bordeaux-600" /> {m.winery_id || m.score}
                            </p>
                            <span className="text-xs font-mono text-gold-600">{m.score}%</span>
                          </div>
                          {m.reasons && (
                            <ul className="text-xs text-bordeaux-600 space-y-1 mt-1">
                              {m.reasons.map((r: string, j: number) => (
                                <li key={j} className="flex items-start gap-1.5">
                                  <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" /> {r}
                                </li>
                              ))}
                            </ul>
                          )}
                          {m.recommendation && (
                            <p className="text-xs text-bordeaux-700 italic mt-2 p-2 rounded bg-cream-100">{m.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!aiExportResult && !aiExportLoading && !aiExportError && (
              <div className="p-8 rounded-xl bg-cream-50 border border-cream-200 text-center">
                <Brain className="w-10 h-10 text-bordeaux-300 mx-auto mb-3" />
                <p className="text-sm text-bordeaux-600">Clicca "Avvia analisi AI" per ricevere suggerimenti personalizzati sulla strategia export della tua cantina.</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <span className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">Mercati target</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">Ottimizzazione FOB</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">Certificazioni strategiche</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200">Posizionamento fiere</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

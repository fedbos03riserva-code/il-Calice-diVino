import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, Loader2, Check, QrCode as QrCodeIcon, Download, ExternalLink, Store, Wine, Globe, Mail, Phone, FileText, Calendar, Package, Award, Sparkles, ArrowRight, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getWineryById } from "../data/wineryDirectory";
import { supabase } from "../lib/supabase";
import { QRCodeSVG } from "qrcode.react";

interface QRData {
  annata: string;
  stock: string;
  prezzo_aggiornato: string;
  premi: string;
  eventi: string;
  descrizione: string;
  email_contatto: string;
  telefono_contatto: string;
  sito_web: string;
  instagram: string;
  note_deglustazione: string;
}

const EMPTY_QR: QRData = {
  annata: "2023", stock: "", prezzo_aggiornato: "", premi: "", eventi: "",
  descrizione: "", email_contatto: "", telefono_contatto: "", sito_web: "", instagram: "", note_deglustazione: "",
};

export default function WineryPanel() {
  const { t, user } = useApp();
  const [qrData, setQrData] = useState<QRData>(EMPTY_QR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"dati" | "contatti" | "qr">("dati");

  const wineryId = user?.wineryId || "";
  const winery = wineryId ? getWineryById(wineryId) : undefined;
  const sheetUrl = wineryId ? `${window.location.origin}/wine-sheet/${wineryId}` : "";

  useEffect(() => {
    if (!wineryId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setSaved(false);
    supabase
      .from("winery_qr_data")
      .select("annata, stock, prezzo_aggiornato, premi, eventi, descrizione, email_contatto, telefono_contatto, sito_web, instagram, note_deglustazione")
      .eq("winery_id", wineryId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setQrData({ ...EMPTY_QR, ...data } as QRData);
        else setQrData({ ...EMPTY_QR, annata: "2023" });
        setLoading(false);
      });
  }, [wineryId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wineryId) return;
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from("winery_qr_data")
      .upsert({ winery_id: wineryId, ...qrData, updated_at: new Date().toISOString() });
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const downloadQR = () => {
    const svg = document.getElementById("panel-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${wineryId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user || user.role !== "cantina") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bordeaux-950 flex items-center justify-center">
          <QrCodeIcon className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">QR Cantina</h1>
        <p className="text-sm text-bordeaux-500 mb-6">Accedi con un account cantina per gestire il tuo QR code e i dati che i clienti vedranno.</p>
        <Link to="/account" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
          <ArrowRight className="w-4 h-4" /> Accedi o registrati
        </Link>
      </div>
    );
  }

  if (!winery) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bordeaux-950 flex items-center justify-center">
          <Wine className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">Cantina non configurata</h1>
        <p className="text-sm text-bordeaux-500 mb-6">Il tuo account non e collegato a una cantina. Contatta l'assistenza.</p>
        <a href="mailto:cantina@bf45wine.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
          <Mail className="w-4 h-4" /> Contatta l'assistenza
        </a>
      </div>
    );
  }

  const tabs = [
    { id: "dati" as const, label: "Dati QR", icon: FileText },
    { id: "contatti" as const, label: "Contatti", icon: Phone },
    { id: "qr" as const, label: "QR Code", icon: QrCodeIcon },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1">
            <QrCodeIcon className="w-3.5 h-3.5" /> {t("qr.panel.badge")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{t("qr.panel.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">{t("qr.panel.subtitle")}</p>
        </div>

        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-bordeaux-800 flex items-center justify-center">
              <Store className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-cream-50">{winery.nome}</h2>
              <p className="text-xs text-cream-300">{winery.comune} (PV) · {winery.ettari} ha</p>
            </div>
          </div>
          <Link to="/gestione-cantina" className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
            Gestione <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-2 mb-6 border-b border-cream-200 pb-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-600 hover:bg-cream-100"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-bordeaux-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: editor */}
            <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
              {activeTab === "dati" && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" /> {t("qr.panel.annata")}
                    </label>
                    <input type="text" value={qrData.annata} onChange={(e) => setQrData({ ...qrData, annata: e.target.value })} placeholder="2023"
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gold-600" /> {t("qr.panel.stock")}
                    </label>
                    <input type="text" value={qrData.stock || ""} onChange={(e) => setQrData({ ...qrData, stock: e.target.value })} placeholder={t("qr.panel.stock.ph")}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-gold-600" /> {t("qr.panel.price")}
                    </label>
                    <input type="text" value={qrData.prezzo_aggiornato || ""} onChange={(e) => setQrData({ ...qrData, prezzo_aggiornato: e.target.value })} placeholder={t("qr.panel.price.ph")}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gold-600" /> {t("qr.panel.awards")}
                    </label>
                    <input type="text" value={qrData.premi || ""} onChange={(e) => setQrData({ ...qrData, premi: e.target.value })} placeholder={t("qr.panel.awards.ph")}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" /> {t("qr.panel.events")}
                    </label>
                    <input type="text" value={qrData.eventi || ""} onChange={(e) => setQrData({ ...qrData, eventi: e.target.value })} placeholder={t("qr.panel.events.ph")}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gold-600" /> Descrizione cantina
                    </label>
                    <textarea value={qrData.descrizione || ""} onChange={(e) => setQrData({ ...qrData, descrizione: e.target.value })} placeholder="Breve descrizione che i clienti vedranno scansionando il QR..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-gold-600" /> Note di degustazione
                    </label>
                    <textarea value={qrData.note_deglustazione || ""} onChange={(e) => setQrData({ ...qrData, note_deglustazione: e.target.value })} placeholder="Note sensoriali, abbinamenti consigliati..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? t("qr.panel.saved") : t("qr.panel.save")}
                  </button>
                  {saved && <p className="text-xs text-green-600 text-center">{t("qr.panel.savedDesc")}</p>}
                </form>
              )}

              {activeTab === "contatti" && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold-600" /> Email contatto
                    </label>
                    <input type="email" value={qrData.email_contatto || ""} onChange={(e) => setQrData({ ...qrData, email_contatto: e.target.value })} placeholder="cantina@esempio.it"
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold-600" /> Telefono
                    </label>
                    <input type="tel" value={qrData.telefono_contatto || ""} onChange={(e) => setQrData({ ...qrData, telefono_contatto: e.target.value })} placeholder="+39 0385 000 000"
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gold-600" /> Sito web
                    </label>
                    <input type="text" value={qrData.sito_web || ""} onChange={(e) => setQrData({ ...qrData, sito_web: e.target.value })} placeholder="www.cantinaesempio.it"
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bordeaux-700 mb-1 block flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gold-600" /> Instagram
                    </label>
                    <input type="text" value={qrData.instagram || ""} onChange={(e) => setQrData({ ...qrData, instagram: e.target.value })} placeholder="@cantina"
                      className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? t("qr.panel.saved") : t("qr.panel.save")}
                  </button>
                  {saved && <p className="text-xs text-green-600 text-center">{t("qr.panel.savedDesc")}</p>}
                </form>
              )}

              {activeTab === "qr" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
                    <h3 className="font-serif text-base text-bordeaux-950 mb-2">Come funziona il QR dinamico</h3>
                    <p className="text-xs text-bordeaux-600 leading-relaxed">
                      Il QR code punta a una pagina fissa (la scheda tecnica della tua cantina). I dati che il cliente vede
                      scansionando il QR si aggiornano in tempo reale quando modifichi i campi nelle tab "Dati QR" e "Contatti".
                      Stampa il QR una sola volta sulle etichette o nei materiali: il contenuto si aggiorna senza ristampare.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-cream-100 border border-cream-200">
                      <span className="text-xs text-bordeaux-500">URL QR</span>
                      <span className="text-xs font-mono text-bordeaux-700 truncate ml-2">{sheetUrl}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-cream-100 border border-cream-200">
                      <span className="text-xs text-bordeaux-500">Ultimo aggiornamento</span>
                      <span className="text-xs text-bordeaux-700">{qrData.annata ? "Dati presenti" : "Mai"}</span>
                    </div>
                  </div>
                  <Link to={`/wine-sheet/${wineryId}`} target="_blank"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-700 text-cream-50 font-semibold hover:bg-bordeaux-600 transition-colors text-sm">
                    <Eye className="w-4 h-4" /> Anteprima scheda pubblica
                  </Link>
                </div>
              )}
            </div>

            {/* Right: QR preview + live data */}
            <div className="space-y-6">
              <div className="bg-bordeaux-950 rounded-2xl border border-gold-700/30 p-6">
                <h2 className="font-serif text-lg text-cream-50 mb-4 flex items-center gap-2">
                  <QrCodeIcon className="w-5 h-5 text-gold-400" /> {t("qr.panel.preview")}
                </h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-cream-50 p-5 rounded-xl border border-cream-300 shadow-lg">
                    <QRCodeSVG id="panel-qr-code" value={sheetUrl} size={180} level="M" includeMargin={true} />
                  </div>
                  <div className="text-center w-full">
                    <p className="text-sm font-serif text-cream-50">{winery.nome}</p>
                    <p className="text-xs text-gold-400 font-mono break-all mt-1">{sheetUrl}</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button onClick={downloadQR}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 rounded-lg bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors">
                      <Download className="w-3.5 h-3.5" /> {t("qr.panel.download")}
                    </button>
                    <Link to={`/wine-sheet/${wineryId}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 rounded-lg bg-bordeaux-700 text-cream-50 font-medium hover:bg-bordeaux-600 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> {t("qr.panel.view")}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-bordeaux-950 rounded-2xl border border-gold-700/30 p-6">
                <h3 className="font-serif text-sm text-cream-50 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" /> {t("qr.panel.liveData")}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                    <span className="text-cream-400 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Annata</span>
                    <span className="text-cream-50 font-medium">{qrData.annata || "&mdash;"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                    <span className="text-cream-400 flex items-center gap-1.5"><Package className="w-3 h-3" /> Stock</span>
                    <span className="text-cream-50 font-medium">{qrData.stock || "&mdash;"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                    <span className="text-cream-400 flex items-center gap-1.5"><Wine className="w-3 h-3" /> Prezzo</span>
                    <span className="text-cream-50 font-medium">{qrData.prezzo_aggiornato || "&mdash;"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                    <span className="text-cream-400 flex items-center gap-1.5"><Award className="w-3 h-3" /> Premi</span>
                    <span className="text-cream-50 font-medium">{qrData.premi || "&mdash;"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                    <span className="text-cream-400 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Eventi</span>
                    <span className="text-cream-50 font-medium">{qrData.eventi || "&mdash;"}</span>
                  </div>
                  {qrData.descrizione && (
                    <div className="py-2 border-b border-bordeaux-800">
                      <span className="text-cream-400 flex items-center gap-1.5 mb-1"><FileText className="w-3 h-3" /> Descrizione</span>
                      <p className="text-cream-200 text-xs leading-relaxed">{qrData.descrizione}</p>
                    </div>
                  )}
                  {qrData.note_deglustazione && (
                    <div className="py-2 border-b border-bordeaux-800">
                      <span className="text-cream-400 flex items-center gap-1.5 mb-1"><Wine className="w-3 h-3" /> Note degustazione</span>
                      <p className="text-cream-200 text-xs leading-relaxed">{qrData.note_deglustazione}</p>
                    </div>
                  )}
                  {qrData.email_contatto && (
                    <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                      <span className="text-cream-400 flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</span>
                      <span className="text-cream-50 font-medium">{qrData.email_contatto}</span>
                    </div>
                  )}
                  {qrData.telefono_contatto && (
                    <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                      <span className="text-cream-400 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Telefono</span>
                      <span className="text-cream-50 font-medium">{qrData.telefono_contatto}</span>
                    </div>
                  )}
                  {qrData.sito_web && (
                    <div className="flex justify-between py-1.5 border-b border-bordeaux-800">
                      <span className="text-cream-400 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Sito</span>
                      <span className="text-cream-50 font-medium">{qrData.sito_web}</span>
                    </div>
                  )}
                  {qrData.instagram && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-cream-400 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Instagram</span>
                      <span className="text-cream-50 font-medium">{qrData.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

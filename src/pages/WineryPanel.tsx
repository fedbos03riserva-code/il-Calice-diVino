import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, Loader2, Check, QrCode as QrCodeIcon, Download, ExternalLink } from "lucide-react";
import { useApp } from "../context/AppContext";
import { wineries, getWineryById } from "../data/wineryDirectory";
import { supabase } from "../lib/supabase";
import { QRCodeSVG } from "qrcode.react";

interface QRData {
  annata: string;
  stock: string;
  prezzo_aggiornato: string;
  premi: string;
  eventi: string;
}

export default function WineryPanel() {
  const { t } = useApp();
  const [selectedId, setSelectedId] = useState(wineries[0].id);
  const [qrData, setQrData] = useState<QRData>({ annata: "", stock: "", prezzo_aggiornato: "", premi: "", eventi: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const winery = getWineryById(selectedId)!;
  const sheetUrl = `${window.location.origin}/wine-sheet/${selectedId}`;

  useEffect(() => {
    setLoading(true);
    setSaved(false);
    supabase
      .from("winery_qr_data")
      .select("annata, stock, prezzo_aggiornato, premi, eventi")
      .eq("winery_id", selectedId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setQrData(data as QRData);
        else setQrData({ annata: "2023", stock: "", prezzo_aggiornato: "", premi: "", eventi: "" });
        setLoading(false);
      });
  }, [selectedId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from("winery_qr_data")
      .upsert({ winery_id: selectedId, ...qrData, updated_at: new Date().toISOString() });
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const downloadQR = () => {
    const svg = document.getElementById(`panel-qr-${selectedId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${selectedId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1">
            <QrCodeIcon className="w-3.5 h-3.5" /> {t("qr.panel.badge")}
          </p>
          <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("qr.panel.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">{t("qr.panel.subtitle")}</p>
        </div>

        {/* Winery selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-bordeaux-700 mb-2 block">{t("qr.panel.selectWinery")}</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            {wineries.map((w) => (
              <option key={w.id} value={w.id}>{w.nome} — {w.comune}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor form */}
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-bordeaux-400" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("qr.panel.annata")}</label>
                  <input
                    type="text"
                    value={qrData.annata}
                    onChange={(e) => setQrData({ ...qrData, annata: e.target.value })}
                    placeholder="2023"
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("qr.panel.stock")}</label>
                  <input
                    type="text"
                    value={qrData.stock || ""}
                    onChange={(e) => setQrData({ ...qrData, stock: e.target.value })}
                    placeholder={t("qr.panel.stock.ph")}
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("qr.panel.price")}</label>
                  <input
                    type="text"
                    value={qrData.prezzo_aggiornato || ""}
                    onChange={(e) => setQrData({ ...qrData, prezzo_aggiornato: e.target.value })}
                    placeholder={t("qr.panel.price.ph")}
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("qr.panel.awards")}</label>
                  <input
                    type="text"
                    value={qrData.premi || ""}
                    onChange={(e) => setQrData({ ...qrData, premi: e.target.value })}
                    placeholder={t("qr.panel.awards.ph")}
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("qr.panel.events")}</label>
                  <input
                    type="text"
                    value={qrData.eventi || ""}
                    onChange={(e) => setQrData({ ...qrData, eventi: e.target.value })}
                    placeholder={t("qr.panel.events.ph")}
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? t("qr.panel.saved") : t("qr.panel.save")}
                </button>
                {saved && (
                  <p className="text-xs text-green-600 text-center">{t("qr.panel.savedDesc")}</p>
                )}
              </form>
            )}
          </div>

          {/* QR preview */}
          <div className="bg-bordeaux-950 rounded-2xl border border-gold-700/30 p-6">
            <h2 className="font-serif text-lg text-cream-50 mb-4 flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5 text-gold-400" /> {t("qr.panel.preview")}
            </h2>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-300">
                <QRCodeSVG id={`panel-qr-${selectedId}`} value={sheetUrl} size={160} level="M" />
              </div>
              <div className="text-center w-full">
                <p className="text-xs text-cream-300 mb-1">{winery.nome}</p>
                <p className="text-xs text-gold-400 font-mono break-all">{sheetUrl}</p>
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> {t("qr.panel.download")}
                </button>
                <Link
                  to={`/wine-sheet/${selectedId}`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-bordeaux-700 text-cream-50 font-medium hover:bg-bordeaux-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> {t("qr.panel.view")}
                </Link>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold-700/20">
              <p className="text-xs text-cream-300">{t("qr.panel.liveData")}</p>
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-cream-200"><span className="text-gold-400">Annata:</span> {qrData.annata || "—"}</p>
                <p className="text-cream-200"><span className="text-gold-400">Stock:</span> {qrData.stock || "—"}</p>
                <p className="text-cream-200"><span className="text-gold-400">Prezzo:</span> {qrData.prezzo_aggiornato || "—"}</p>
                <p className="text-cream-200"><span className="text-gold-400">Premi:</span> {qrData.premi || "—"}</p>
                <p className="text-cream-200"><span className="text-gold-400">Eventi:</span> {qrData.eventi || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

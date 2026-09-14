import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wine, MapPin, Globe2, FileText, QrCode as QrCodeIcon, Download, Loader2, TrendingUp, Award, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getWineryById } from "../data/wineryDirectory";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabase";

interface LiveQRData {
  annata: string;
  stock: string;
  prezzo_aggiornato: string;
  premi: string;
  eventi: string;
}

export default function WineTechSheet() {
  const { id } = useParams<{ id: string }>();
  const { t } = useApp();
  const winery = id ? getWineryById(id) : null;
  const [liveData, setLiveData] = useState<LiveQRData | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLiveLoading(true);
    supabase
      .from("winery_qr_data")
      .select("annata, stock, prezzo_aggiornato, premi, eventi")
      .eq("winery_id", id)
      .maybeSingle()
      .then(({ data }) => {
        setLiveData(data as LiveQRData | null);
        setLiveLoading(false);
      });
  }, [id]);

  if (!winery) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-bordeaux-600 text-lg mb-4">{t("techsheet.notfound")}</p>
          <Link to="/cantine" className="px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
            {t("nav.directory")}
          </Link>
        </div>
      </div>
    );
  }

  const sheetUrl = `${window.location.origin}/wine-sheet/${winery.id}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${winery.id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${winery.id}-${winery.nome.replace(/\s+/g, "-").toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printSheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="no-print mb-6">
          <Link to="/cantine" className="inline-flex items-center gap-1 text-sm text-bordeaux-600 hover:text-gold-600">
            <ArrowLeft className="w-4 h-4" /> {t("rfq.back")}
          </Link>
        </div>

        {/* Header */}
        <div className="bg-bordeaux-950 text-cream-50 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-1">{t("techsheet.badge")}</p>
              <h1 className="font-serif text-3xl text-cream-50">{winery.nome}</h1>
              <p className="text-sm text-cream-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {winery.comune} ({winery.provincia}) · {t("directory.founded")} {winery.annoFondazione}
              </p>
            </div>
            {winery.exportReady && (
              <span className="text-[10px] px-3 py-1.5 rounded-full bg-green-600 text-cream-50 font-semibold whitespace-nowrap">
                Export Ready
              </span>
            )}
          </div>
        </div>

        {/* Technical data */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
            <Wine className="w-5 h-5 text-gold-600" /> {t("techsheet.data")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-xs text-bordeaux-400">{t("directory.hectares")}</p><p className="font-semibold text-bordeaux-700">{winery.ettari} ha</p></div>
            <div><p className="text-xs text-bordeaux-400">{t("directory.capacity")}</p><p className="font-semibold text-bordeaux-700">{winery.capacitaProduttiva.toLocaleString()} hl/anno</p></div>
            <div><p className="text-xs text-bordeaux-400">MOQ</p><p className="font-semibold text-bordeaux-700">{winery.moq} bt</p></div>
            <div><p className="text-xs text-bordeaux-400">FOB €/bt</p><p className="font-semibold text-bordeaux-700">€{winery.prezzoFOB.toFixed(2)}</p></div>
            <div><p className="text-xs text-bordeaux-400">{t("directory.incoterms")}</p><p className="font-semibold text-bordeaux-700 text-xs">{winery.incoterms.join(", ")}</p></div>
            <div><p className="text-xs text-bordeaux-400">{t("directory.contact")}</p><p className="font-semibold text-bordeaux-700 text-xs">{winery.contatti.email}</p></div>
          </div>
        </div>

        {/* Denominations */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-3">{t("directory.denominations")}</h2>
          <div className="flex flex-wrap gap-2">
            {winery.denominazioni.map((d) => <span key={d} className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-100 text-bordeaux-700">{d}</span>)}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-3">{t("directory.certifications")}</h2>
          <div className="flex flex-wrap gap-2">
            {winery.certificazioni.map((c) => <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700">{c}</span>)}
          </div>
        </div>

        {/* Export markets */}
        {winery.esporta && (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
            <h2 className="font-serif text-lg text-bordeaux-950 mb-3 flex items-center gap-2"><Globe2 className="w-5 h-5 text-gold-600" /> {t("directory.markets")}</h2>
            <div className="flex flex-wrap gap-2">
              {winery.paesiServiti.map((p) => <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-gold-100 text-gold-700">{p}</span>)}
            </div>
          </div>
        )}

        {/* Languages */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-3">{t("directory.teamLangs")}</h2>
          <div className="flex flex-wrap gap-2">
            {winery.lingueTeam.map((l) => <span key={l} className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-700 text-cream-50">{l}</span>)}
          </div>
        </div>

        {/* Live QR data — updated in real time by the winery */}
        {liveLoading ? (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-bordeaux-400" />
          </div>
        ) : liveData ? (
          <div className="bg-bordeaux-950 text-cream-50 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-lg text-cream-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" /> {t("techsheet.liveData")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-cream-300">{t("qr.panel.annata")}</p>
                <p className="font-semibold text-gold-400">{liveData.annata}</p>
              </div>
              <div>
                <p className="text-xs text-cream-300">{t("qr.panel.stock")}</p>
                <p className="font-semibold text-cream-50">{liveData.stock || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-cream-300">{t("qr.panel.price")}</p>
                <p className="font-semibold text-cream-50">{liveData.prezzo_aggiornato || "—"}</p>
              </div>
            </div>
            {liveData.premi && (
              <div className="mt-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <p className="text-xs text-cream-200">{liveData.premi}</p>
              </div>
            )}
            {liveData.eventi && (
              <div className="mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <p className="text-xs text-cream-200">{liveData.eventi}</p>
              </div>
            )}
            <p className="text-xs text-cream-400 mt-3 italic">{t("techsheet.liveDataNote")}</p>
          </div>
        ) : null}

        {/* QR Code section — dual level: compliance + export */}
        <div className="bg-bordeaux-50 rounded-2xl border border-bordeaux-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2"><QrCodeIcon className="w-5 h-5 text-gold-600" /> {t("techsheet.qr")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Compliance QR */}
            <div className="bg-cream-50 rounded-xl border border-cream-300 p-4">
              <p className="text-xs font-semibold text-bordeaux-700 mb-2">{t("techsheet.qr.compliance")}</p>
              <p className="text-xs text-bordeaux-500 mb-3">{t("techsheet.qr.compliance.desc")}</p>
              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg border border-cream-300">
                  <QRCodeSVG id={`qr-compliance-${winery.id}`} value={`${sheetUrl}?mode=compliance`} size={120} level="M" />
                </div>
              </div>
              <button onClick={() => {
                const svg = document.getElementById(`qr-compliance-${winery.id}`);
                if (!svg) return;
                const svgData = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([svgData], { type: "image/svg+xml" });
                const dlUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = dlUrl;
                a.download = `qr-compliance-${winery.id}.svg`;
                a.click();
                URL.revokeObjectURL(dlUrl);
              }} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-cream-200 text-bordeaux-700 font-medium hover:bg-cream-300 transition-colors w-full justify-center">
                <Download className="w-3.5 h-3.5" /> {t("techsheet.qr.download")}
              </button>
            </div>

            {/* Export QR */}
            <div className="bg-bordeaux-800 rounded-xl border border-gold-700/30 p-4">
              <p className="text-xs font-semibold text-gold-400 mb-2">{t("techsheet.qr.export")}</p>
              <p className="text-xs text-cream-300 mb-3">{t("techsheet.qr.desc")}</p>
              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG id={`qr-export-${winery.id}`} value={sheetUrl} size={120} level="M" />
                </div>
              </div>
              <button onClick={downloadQR} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors w-full justify-center">
                <Download className="w-3.5 h-3.5" /> {t("techsheet.qr.download")}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={printSheet} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cream-200 text-bordeaux-700 font-medium hover:bg-cream-300 transition-colors text-sm no-print">
              <FileText className="w-4 h-4" /> {t("techsheet.print")}
            </button>
          </div>
        </div>

        {/* RFQ CTA */}
        <Link to={`/rfq?cantina=${winery.id}`} className="no-print flex items-center justify-center gap-2 w-full px-5 py-4 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors">
          <FileText className="w-4 h-4" /> {t("directory.sendRfq")}
        </Link>
      </div>
    </div>
  );
}

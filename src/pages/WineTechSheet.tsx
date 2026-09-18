import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wine, MapPin, Globe2, FileText, QrCode as QrCodeIcon, Download, Loader2, TrendingUp, Award, Calendar, Package, Mail, Phone, Check, Building2, Leaf, Euro } from "lucide-react";
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
  descrizione: string;
  email_contatto: string;
  telefono_contatto: string;
  sito_web: string;
  instagram: string;
  note_deglustazione: string;
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
      .select("annata, stock, prezzo_aggiornato, premi, eventi, descrizione, email_contatto, telefono_contatto, sito_web, instagram, note_deglustazione")
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

  const downloadQR = (qrId: string, filename: string) => {
    const svg = document.getElementById(qrId);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printSheet = () => window.print();

  return (
    <div className="min-h-screen bg-cream-100">
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="no-print mb-6">
          <Link to="/cantine" className="inline-flex items-center gap-1 text-sm text-bordeaux-600 hover:text-gold-600">
            <ArrowLeft className="w-4 h-4" /> {t("rfq.back")}
          </Link>
        </div>

        {/* Hero header */}
        <div className="bg-bordeaux-950 text-cream-50 rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full -translate-y-24 translate-x-24" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-2">{t("techsheet.badge")}</p>
                <h1 className="font-serif text-3xl md:text-4xl text-cream-50 mb-2">{winery.nome}</h1>
                <p className="text-sm text-cream-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {winery.comune} ({winery.provincia}) · {t("directory.founded")} {winery.annoFondazione}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {winery.exportReady && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-green-600 text-cream-50 font-semibold whitespace-nowrap flex items-center gap-1">
                    <Check className="w-3 h-3" /> Export Ready
                  </span>
                )}
                <span className="text-xs px-3 py-1.5 rounded-full bg-gold-400/20 text-gold-400 font-medium border border-gold-400/30">
                  {winery.ettari} ha
                </span>
              </div>
            </div>
            {liveData?.descrizione && (
              <p className="text-sm text-cream-200 leading-relaxed max-w-2xl mt-4 pt-4 border-t border-bordeaux-800">
                {liveData.descrizione}
              </p>
            )}
          </div>
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4">
            <Building2 className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-400">{t("directory.hectares")}</p>
            <p className="font-serif text-xl text-bordeaux-950">{winery.ettari} ha</p>
          </div>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4">
            <Package className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-400">{t("directory.capacity")}</p>
            <p className="font-serif text-xl text-bordeaux-950">{winery.capacitaProduttiva.toLocaleString()} hl</p>
          </div>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4">
            <Euro className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-400">FOB €/bt</p>
            <p className="font-serif text-xl text-bordeaux-950">&euro;{winery.prezzoFOB.toFixed(2)}</p>
          </div>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4">
            <Wine className="w-5 h-5 text-bordeaux-600 mb-2" />
            <p className="text-xs text-bordeaux-400">MOQ</p>
            <p className="font-serif text-xl text-bordeaux-950">{winery.moq} bt</p>
          </div>
        </div>

        {/* Export data */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-gold-600" /> Export Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-bordeaux-400 mb-1">{t("directory.incoterms")}</p>
              <div className="flex flex-wrap gap-1.5">
                {winery.incoterms.map((ic) => <span key={ic} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-100 text-bordeaux-700 font-medium">{ic}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs text-bordeaux-400 mb-1">{t("directory.teamLangs")}</p>
              <div className="flex flex-wrap gap-1.5">
                {winery.lingueTeam.map((l) => <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-700 text-cream-50 font-medium">{l}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Denominations + Certifications side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
            <h2 className="font-serif text-lg text-bordeaux-950 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-600" /> {t("directory.denominations")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {winery.denominazioni.map((d) => <span key={d} className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-100 text-bordeaux-700 font-medium">{d}</span>)}
            </div>
          </div>
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
            <h2 className="font-serif text-lg text-bordeaux-950 mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" /> {t("directory.certifications")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {winery.certificazioni.map((c) => <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-medium">{c}</span>)}
            </div>
          </div>
        </div>

        {/* Export markets */}
        {winery.esporta && (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
            <h2 className="font-serif text-lg text-bordeaux-950 mb-3 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-gold-600" /> {t("directory.markets")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {winery.paesiServiti.length > 0 ? (
                winery.paesiServiti.map((p) => <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-gold-100 text-gold-700 font-medium">{p}</span>)
              ) : (
                <p className="text-sm text-bordeaux-500">Nuovo mercato export -- potenziale da sviluppare</p>
              )}
            </div>
          </div>
        )}

        {/* Live QR data */}
        {liveLoading ? (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-bordeaux-400" />
          </div>
        ) : liveData ? (
          <div className="bg-bordeaux-950 text-cream-50 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-lg text-cream-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" /> {t("techsheet.liveData")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-cream-300 flex items-center gap-1"><Calendar className="w-3 h-3" /> {t("qr.panel.annata")}</p>
                <p className="font-serif text-lg text-gold-400 mt-1">{liveData.annata}</p>
              </div>
              <div>
                <p className="text-xs text-cream-300 flex items-center gap-1"><Package className="w-3 h-3" /> {t("qr.panel.stock")}</p>
                <p className="font-semibold text-cream-50 mt-1">{liveData.stock || "&mdash;"}</p>
              </div>
              <div>
                <p className="text-xs text-cream-300 flex items-center gap-1"><Euro className="w-3 h-3" /> {t("qr.panel.price")}</p>
                <p className="font-semibold text-cream-50 mt-1">{liveData.prezzo_aggiornato || "&mdash;"}</p>
              </div>
              <div>
                <p className="text-xs text-cream-300 flex items-center gap-1"><Award className="w-3 h-3" /> {t("qr.panel.awards")}</p>
                <p className="font-semibold text-cream-50 mt-1 text-xs">{liveData.premi || "&mdash;"}</p>
              </div>
            </div>
            {liveData.eventi && (
              <div className="mt-3 flex items-center gap-2 pt-3 border-t border-bordeaux-800">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <p className="text-xs text-cream-200">{liveData.eventi}</p>
              </div>
            )}
            {liveData.note_deglustazione && (
              <div className="mt-3 pt-3 border-t border-bordeaux-800">
                <p className="text-xs text-cream-300 flex items-center gap-1 mb-1"><Wine className="w-3 h-3" /> Note di degustazione</p>
                <p className="text-xs text-cream-200 leading-relaxed">{liveData.note_deglustazione}</p>
              </div>
            )}
            <p className="text-xs text-cream-400 mt-3 italic">{t("techsheet.liveDataNote")}</p>
          </div>
        ) : null}

        {/* Contact info from QR data */}
        {liveData && (liveData.email_contatto || liveData.telefono_contatto || liveData.sito_web) && (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 mb-6">
            <h2 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold-600" /> Contatti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liveData.email_contatto && (
                <a href={`mailto:${liveData.email_contatto}`} className="flex items-center gap-2 text-sm text-bordeaux-700 hover:text-gold-600 transition-colors">
                  <Mail className="w-4 h-4 text-bordeaux-500" /> {liveData.email_contatto}
                </a>
              )}
              {liveData.telefono_contatto && (
                <p className="flex items-center gap-2 text-sm text-bordeaux-700">
                  <Phone className="w-4 h-4 text-bordeaux-500" /> {liveData.telefono_contatto}
                </p>
              )}
              {liveData.sito_web && (
                <a href={`https://${liveData.sito_web.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-bordeaux-700 hover:text-gold-600 transition-colors">
                  <Globe2 className="w-4 h-4 text-bordeaux-500" /> {liveData.sito_web}
                </a>
              )}
            </div>
          </div>
        )}

        {/* QR Code section */}
        <div className="bg-bordeaux-50 rounded-2xl border border-bordeaux-200 p-6 mb-6">
          <h2 className="font-serif text-lg text-bordeaux-950 mb-4 flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-gold-600" /> {t("techsheet.qr")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Compliance QR */}
            <div className="bg-cream-50 rounded-xl border border-cream-300 p-5">
              <p className="text-sm font-semibold text-bordeaux-700 mb-1">{t("techsheet.qr.compliance")}</p>
              <p className="text-xs text-bordeaux-500 mb-4">{t("techsheet.qr.compliance.desc")}</p>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-lg border border-cream-300">
                  <QRCodeSVG id={`qr-compliance-${winery.id}`} value={`${sheetUrl}?mode=compliance`} size={140} level="M" />
                </div>
              </div>
              <button onClick={() => downloadQR(`qr-compliance-${winery.id}`, `qr-compliance-${winery.id}.svg`)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-cream-200 text-bordeaux-700 font-medium hover:bg-cream-300 transition-colors w-full justify-center">
                <Download className="w-3.5 h-3.5" /> {t("techsheet.qr.download")}
              </button>
            </div>

            {/* Export QR */}
            <div className="bg-bordeaux-800 rounded-xl border border-gold-700/30 p-5">
              <p className="text-sm font-semibold text-gold-400 mb-1">{t("techsheet.qr.export")}</p>
              <p className="text-xs text-cream-300 mb-4">{t("techsheet.qr.desc")}</p>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG id={`qr-export-${winery.id}`} value={sheetUrl} size={140} level="M" />
                </div>
              </div>
              <button onClick={() => downloadQR(`qr-export-${winery.id}`, `qr-${winery.id}-${winery.nome.replace(/\s+/g, "-").toLowerCase()}.svg`)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-gold-400 text-bordeaux-950 font-medium hover:bg-gold-300 transition-colors w-full justify-center">
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

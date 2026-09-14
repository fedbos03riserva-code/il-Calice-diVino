import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, ArrowLeft, Send, Globe2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getWineryById, wineries } from "../data/wineryDirectory";

export default function RFQ() {
  const { t } = useApp();
  const [searchParams] = useSearchParams();
  const cantinaId = searchParams.get("cantina") || "";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    cantina: cantinaId,
    paese: "",
    volume: "",
    tipologia: "",
    budget: "",
    incoterm: "FOB",
    nome: "",
    email: "",
    azienda: "",
    note: "",
  });

  const selectedWinery = cantinaId ? getWineryById(cantinaId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const incoterms = ["EXW", "FOB", "CIF", "DDP", "DAP"];
  const wineTypes = ["Rosso", "Bianco", "Rosato", "Spumante", "Dolce", "Indifferente"];

  if (sent) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl text-bordeaux-950 mb-2">{t("rfq.sent.title")}</h1>
          <p className="text-sm text-bordeaux-600 mb-6">{t("rfq.sent.desc")}</p>
          {selectedWinery && (
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 mb-4 text-left">
              <p className="text-xs text-bordeaux-400">{t("rfq.sent.to")}</p>
              <p className="font-semibold text-bordeaux-700">{selectedWinery.nome}</p>
              <p className="text-xs text-bordeaux-500">{selectedWinery.contatti.email}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cantine" className="px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
              {t("rfq.sent.another")}
            </Link>
            <Link to="/" className="px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
              {t("rfq.sent.home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link to="/cantine" className="inline-flex items-center gap-1 text-sm text-bordeaux-600 hover:text-gold-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> {t("rfq.back")}
        </Link>

        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("rfq.badge")}</p>
          <h1 className="font-serif text-3xl text-bordeaux-950 mb-2">{t("rfq.title")}</h1>
          <p className="text-sm text-bordeaux-600">{t("rfq.subtitle")}</p>
        </div>

        {selectedWinery && (
          <div className="p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200 mb-6">
            <p className="text-xs text-bordeaux-400">{t("rfq.to")}</p>
            <p className="font-serif text-lg text-bordeaux-950">{selectedWinery.nome}</p>
            <p className="text-xs text-bordeaux-500">{selectedWinery.comune} ({selectedWinery.provincia}) · MOQ: {selectedWinery.moq} bt · FOB: €{selectedWinery.prezzoFOB.toFixed(2)}/bt</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedWinery && (
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.winery")}</label>
              <select value={form.cantina} onChange={(e) => setForm({ ...form, cantina: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
                <option value="">{t("rfq.winery.select")}</option>
                {wineries.map((w) => <option key={w.id} value={w.id}>{w.nome} — {w.comune}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.country")}</label>
              <input type="text" required value={form.paese} onChange={(e) => setForm({ ...form, paese: e.target.value })}
                placeholder={t("rfq.country.ph")}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.volume")}</label>
              <input type="text" required value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })}
                placeholder={t("rfq.volume.ph")}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.wineType")}</label>
              <select value={form.tipologia} onChange={(e) => setForm({ ...form, tipologia: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400">
                <option value="">{t("rfq.wineType.select")}</option>
                {wineTypes.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.budget")}</label>
              <input type="text" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder={t("rfq.budget.ph")}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.incoterm")}</label>
            <div className="flex flex-wrap gap-2">
              {incoterms.map((ic) => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, incoterm: ic })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.incoterm === ic ? "bg-bordeaux-800 text-cream-50" : "bg-cream-200 text-bordeaux-700 hover:bg-cream-300"}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.name")}</label>
              <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder={t("rfq.name.ph")}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.email")}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("rfq.email.ph")}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.company")}</label>
            <input type="text" value={form.azienda} onChange={(e) => setForm({ ...form, azienda: e.target.value })}
              placeholder={t("rfq.company.ph")}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>

          <div>
            <label className="text-sm font-medium text-bordeaux-700 mb-1 block">{t("rfq.notes")}</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder={t("rfq.notes.ph")} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors">
            <Send className="w-4 h-4" /> {t("rfq.submit")}
          </button>
          <p className="text-xs text-bordeaux-400 text-center flex items-center justify-center gap-1">
            <Globe2 className="w-3 h-3" /> {t("rfq.disclaimer")}
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Send, CheckCircle, Wine, GraduationCap, ClipboardList, Users, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

const VENUE_TYPES = ["Trattoria", "Vineria", "Beach club", "Hotel", "Locale serale", "Fine dining", "Pizzeria", "Agriturismo", "Cocktail bar", "Altro"];

export default function PrivateConsulting() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ venueName: "", contact: "", phone: "", email: "", venueType: "", message: "" });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  const services = [
    { icon: ClipboardList, title: t("consulting.s1"), desc: t("consulting.s1.desc") },
    { icon: Wine, title: t("consulting.s2"), desc: t("consulting.s2.desc") },
    { icon: Users, title: t("consulting.s3"), desc: t("consulting.s3.desc") },
  ];

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-bordeaux-950">{t("consulting.sent.title")}</h1>
        <p className="text-bordeaux-600 mt-4 leading-relaxed">{t("consulting.sent.desc")}</p>
        <button onClick={() => navigate("/")} className="mt-8 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">
          {t("consulting.sent.home")}
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-3 rounded-lg bg-bordeaux-900 border border-bordeaux-700 text-cream-50 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-400";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button onClick={() => navigate("/b2b")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> {t("consulting.back")}
      </button>

      <div className="max-w-3xl mb-10">
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-3">{t("consulting.badge")}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-bordeaux-950">{t("consulting.title")}</h1>
        <p className="text-bordeaux-600 mt-4 text-lg leading-relaxed">{t("consulting.desc")}</p>
      </div>

      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-bordeaux-950 to-bordeaux-800 text-cream-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gold-400 flex items-center justify-center">
              <User className="w-12 h-12 text-bordeaux-950" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gold-400 uppercase tracking-wider">{t("consulting.expert")}</p>
            <h3 className="font-serif text-2xl text-cream-50 mt-1">{t("consulting.expert.name")}</h3>
            <p className="text-sm text-cream-300 mt-2 leading-relaxed">{t("consulting.expert.bio")}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <GraduationCap className="w-3.5 h-3.5 text-gold-400" /> {t("consulting.expert.ais")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <Wine className="w-3.5 h-3.5 text-gold-400" /> {t("consulting.expert.years")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-cream-200 bg-bordeaux-800/60 px-3 py-1.5 rounded-full border border-gold-700/30">
                <Clock className="w-3.5 h-3.5 text-gold-400" /> {t("consulting.expert.response")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-serif text-2xl text-bordeaux-950 mb-5">{t("consulting.includes")}</h2>
          <div className="space-y-4">
            {services.map((s) => (
              <div key={s.title} className="p-5 rounded-xl bg-cream-100 border border-cream-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bordeaux-800 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-bordeaux-950">{s.title}</h3>
                    <p className="text-sm text-bordeaux-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-gold-50 border border-gold-200">
            <p className="text-sm text-bordeaux-800">
              <strong>{t("consulting.included")}</strong> — {t("consulting.included.desc")}
            </p>
          </div>
        </section>

        <section className="p-6 md:p-8 rounded-2xl bg-bordeaux-950 text-cream-100">
          <div className="flex items-center gap-3 mb-5">
            <Send className="w-6 h-6 text-gold-400" />
            <h2 className="font-serif text-2xl text-cream-50">{t("consulting.form.title")}</h2>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.venue")} *</label>
              <input required value={form.venueName} onChange={(e) => update("venueName", e.target.value)} className={inputClass} placeholder={t("consulting.form.venue.ph")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.contact")} *</label>
                <input required value={form.contact} onChange={(e) => update("contact", e.target.value)} className={inputClass} placeholder={t("consulting.form.contact.ph")} />
              </div>
              <div>
                <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.phone")} *</label>
                <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder={t("consulting.form.phone.ph")} />
              </div>
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.email")} *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder={t("consulting.form.email.ph")} />
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.type")}</label>
              <select value={form.venueType} onChange={(e) => update("venueType", e.target.value)} className={inputClass + " text-cream-200"}>
                <option value="">{t("consulting.form.type.ph")}</option>
                {VENUE_TYPES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-cream-300 block mb-1">{t("consulting.form.message")}</label>
              <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} placeholder={t("consulting.form.message.ph")} />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> {t("consulting.form.submit")}
            </button>
            <p className="text-xs text-cream-400 text-center">{t("consulting.form.disclaimer")}</p>
          </form>
        </section>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Search, FileText, Handshake, Package, Globe2, Store, TrendingUp, ClipboardList, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function ExportProcess() {
  const { t } = useApp();
  const [tab, setTab] = useState<"buyer" | "cantine">("buyer");

  const buyerSteps = [
    { icon: Search, title: t("export.buyer.step1.title"), desc: t("export.buyer.step1.desc"), link: "/" },
    { icon: FileText, title: t("export.buyer.step2.title"), desc: t("export.buyer.step2.desc"), link: "/rfq" },
    { icon: Handshake, title: t("export.buyer.step3.title"), desc: t("export.buyer.step3.desc"), link: "/cantine" },
    { icon: Package, title: t("export.buyer.step4.title"), desc: t("export.buyer.step4.desc"), link: null },
  ];

  const cantineSteps = [
    { icon: Globe2, title: t("export.cantine.step1.title"), desc: t("export.cantine.step1.desc"), link: "/cantine" },
    { icon: TrendingUp, title: t("export.cantine.step2.title"), desc: t("export.cantine.step2.desc"), link: "/eventi" },
    { icon: ClipboardList, title: t("export.cantine.step3.title"), desc: t("export.cantine.step3.desc"), link: "/rfq" },
    { icon: Package, title: t("export.cantine.step4.title"), desc: t("export.cantine.step4.desc"), link: null },
  ];

  const steps = tab === "buyer" ? buyerSteps : cantineSteps;

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("nav.business")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{t("export.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl mx-auto">{t("export.subtitle")}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-cream-200 p-1">
            <button onClick={() => setTab("buyer")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "buyer" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-700 hover:text-bordeaux-900"}`}>
              <Globe2 className="w-4 h-4 inline mr-1.5" /> {t("export.tab.buyer")}
            </button>
            <button onClick={() => setTab("cantine")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "cantine" ? "bg-bordeaux-800 text-cream-50" : "text-bordeaux-700 hover:text-bordeaux-900"}`}>
              <Store className="w-4 h-4 inline mr-1.5" /> {t("export.tab.cantine")}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 transition-colors">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-12 rounded-full bg-bordeaux-800 flex items-center justify-center text-gold-400 font-bold text-lg">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-full bg-cream-300 mt-2" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <step.icon className="w-5 h-5 text-gold-600" />
                  <h3 className="font-serif text-lg text-bordeaux-950">{step.title}</h3>
                </div>
                <p className="text-sm text-bordeaux-600 leading-relaxed">{step.desc}</p>
                {step.link && (
                  <Link to={step.link} className="inline-flex items-center gap-1 text-sm text-bordeaux-700 hover:text-gold-600 font-medium mt-3">
                    {t("export.cta")} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100 text-center">
          <h3 className="font-serif text-xl text-cream-50 mb-2">{t("export.ctaTitle")}</h3>
          <p className="text-sm text-cream-300 mb-4">{t("export.ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/rfq" className="px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm">
              {t("nav.rfq")}
            </Link>
            <Link to="/cantine" className="px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm border border-gold-700/30">
              {t("nav.directory")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FileText, Download, Calendar, Globe2, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function BBMaterials() {
  const { t } = useApp();

  const catalogs = [
    { lang: "IT", title: "Catalogo Oltrepò Pavese — Italiano", desc: "111 vini, 12 cantine, 7 denominazioni. PDF stampabile.", size: "2.4 MB" },
    { lang: "EN", title: "Oltrepò Pavese Catalog — English", desc: "111 wines, 12 wineries, 7 denominations. Print-ready PDF.", size: "2.4 MB" },
    { lang: "DE", title: "Oltrepò Pavese Katalog — Deutsch", desc: "111 Weine, 12 Weingüter, 7 Bezeichnungen. Druckfertig PDF.", size: "2.4 MB" },
    { lang: "JP", title: "オルトレポー・パヴェーゼ カタログ — 日本語", desc: "111ワイン、12ワイナリー、7認定。印刷用PDF。", size: "2.4 MB" },
  ];

  const fairs = [
    { name: "ProWein", city: "Düsseldorf", date: "15-17 Marzo 2026", desc: t("events.fairs.prowein.desc"), flag: "DE" },
    { name: "Vinitaly", city: "Verona", date: "12-15 Aprile 2026", desc: t("events.fairs.vinitaly.desc"), flag: "IT" },
    { name: "Wine & Gourmet Japan", city: "Tokyo", date: "20-22 Ottobre 2026", desc: t("events.fairs.japan.desc"), flag: "JP" },
    { name: "SIAL Paris", city: "Parigi", date: "17-21 Ottobre 2026", desc: "Fiera food & beverage internazionale. Sezione vino italiana con cantine Oltrepò.", flag: "FR" },
  ];

  const handleDownload = (lang: string) => {
    const content = `B&F 45 — Catalogo Oltrepò Pavese (${lang})\n\nQuesto e un catalogo demo. Nella versione production il PDF viene generato dinamicamente con tutti i vini e le cantine del portale.\n\n- 111 vini dell'Oltrepò Pavese\n- 12 cantine export-ready\n- 7 denominazioni DOC/DOCG\n- Schede tecniche, prezzi FOB, MOQ, incoterms\n\nwww.bf45wine.com`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bf45-catalog-oltrepo-${lang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2">{t("nav.business")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-2">{t("materials.title")}</h1>
          <p className="text-sm text-bordeaux-600 max-w-2xl">{t("materials.subtitle")}</p>
        </div>

        {/* Catalogs */}
        <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold-600" /> {t("materials.catalogs")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {catalogs.map((c) => (
            <div key={c.lang} className="bg-cream-50 rounded-xl border border-cream-200 p-5 hover:border-gold-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-bordeaux-800 text-gold-400 font-bold flex items-center justify-center text-sm">
                    {c.lang}
                  </span>
                  <div>
                    <h3 className="font-serif text-base text-bordeaux-950">{c.title}</h3>
                    <p className="text-xs text-bordeaux-500">{c.size} · PDF</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-bordeaux-600 mb-3">{c.desc}</p>
              <button onClick={() => handleDownload(c.lang)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bordeaux-800 text-cream-50 font-medium hover:bg-bordeaux-700 transition-colors text-sm w-full justify-center">
                <Download className="w-4 h-4" /> {t("materials.download")}
              </button>
            </div>
          ))}
        </div>

        {/* Fairs calendar */}
        <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-600" /> {t("events.fairs.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {fairs.map((f) => (
            <div key={f.name} className="bg-cream-50 rounded-xl border border-cream-200 p-5 hover:border-gold-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-bordeaux-700 text-cream-50">{f.flag}</span>
                <span className="text-xs font-semibold text-gold-700">{f.date}</span>
              </div>
              <h3 className="font-serif text-base text-bordeaux-950">{f.name}</h3>
              <p className="text-xs text-bordeaux-500 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" /> {f.city}</p>
              <p className="text-xs text-bordeaux-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Territory data */}
        <div className="bg-bordeaux-950 text-cream-100 rounded-2xl p-6 mb-8">
          <h2 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2"><Globe2 className="w-5 h-5 text-gold-400" /> {t("materials.territory")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center"><p className="font-serif text-3xl text-gold-400">65%</p><p className="text-xs text-cream-300">{t("home.whyOltrepo.stat1")}</p></div>
            <div className="text-center"><p className="font-serif text-3xl text-gold-400">#1</p><p className="text-xs text-cream-300">{t("home.whyOltrepo.stat2")}</p></div>
            <div className="text-center"><p className="font-serif text-3xl text-gold-400">3ª</p><p className="text-xs text-cream-300">{t("home.whyOltrepo.stat3")}</p></div>
            <div className="text-center"><p className="font-serif text-3xl text-gold-400">7</p><p className="text-xs text-cream-300">DOC/DOCG</p></div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/export-process" className="flex-1 text-center px-5 py-3 rounded-xl bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm">
            {t("export.title")}
          </Link>
          <Link to="/cantine" className="flex-1 text-center px-5 py-3 rounded-xl bg-cream-200 text-bordeaux-700 font-semibold hover:bg-cream-300 transition-colors text-sm">
            {t("nav.directory")}
          </Link>
        </div>
      </div>
    </div>
  );
}

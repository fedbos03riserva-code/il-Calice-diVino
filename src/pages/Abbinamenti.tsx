import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, FlaskConical, Beaker, ChefHat, Sparkles, Wine as WineIcon, Store, Briefcase } from "lucide-react";
import { useApp } from "../context/AppContext";

const PREMIUM_DISHES = [
  "bistecca alla fiorentina",
  "risotto ai funghi porcini",
  "ostriche e caviale",
  "tagliatelle al tartufo bianco",
  "agnello al forno con erbe",
  "salmone affumicato",
  "foie gras con miele",
  "parmigiana di melanzane",
  "osso buco alla gremolada",
  "brasato al Barolo",
  "sushi di tonno",
  "curry di pollo",
  "paella valenciana",
  "tacos al pastor",
];

const BUSINESS_DISHES = [
  "antipasto misto della casa",
  "tagliere di salumi e formaggi",
  "risotto allo zafferano",
  "ravioli di magro",
  "coniglio alla cacciatora",
  "fritto misto di pesce",
  "tagliata di manzo con rucola",
  "tortino al cioccolato",
];

export default function Abbinamenti() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [dish, setDish] = useState("");
  const [businessMode, setBusinessMode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dish.trim()) navigate(`/results?dish=${encodeURIComponent(dish.trim())}${businessMode ? "&mode=business" : ""}`);
  };

  const tools = [
    { icon: Sparkles, to: "/quiz", title: t("home.feature.quiz"), desc: t("home.feature.quiz.desc"), cta: t("home.feature.prova") },
    { icon: Beaker, to: "/wine-lab", title: t("home.feature.lab"), desc: t("home.feature.lab.desc"), cta: t("home.feature.esplora") },
    { icon: ChefHat, to: "/reverse", title: t("home.feature.reverse"), desc: t("home.feature.reverse.desc"), cta: t("home.feature.scopri") },
    { icon: FlaskConical, to: "/premium", title: t("home.feature.premium"), desc: t("home.feature.premium.desc"), cta: t("home.feature.premium.cta") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero with search */}
      <section className="relative overflow-hidden bg-bordeaux-950 text-cream-50">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(200,157,46,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(155,18,56,0.4) 0%, transparent 50%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="animate-fade-in-up">
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">{t("hero.subtitle")}</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-balance">
              {t("abbinamenti.heading")}
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-10 text-pretty">
              {businessMode
                ? "Il portale dell'Oltrepò Pavese per ristoratori e locali: la modalità Business è attiva solo con credenziali business e mostra margini, temperatura di servizio e consigli per la sala."
                : "Il portale dell'Oltrepò Pavese per appassionati e privati: trova il vino perfetto per il tuo piatto tra oltre 225 etichette del territorio del vino più vasto della Lombardia."}
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Business mode toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setBusinessMode(false)}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-colors ${!businessMode ? "bg-gold-400 text-bordeaux-950 font-semibold" : "bg-bordeaux-800/50 text-cream-200 hover:bg-bordeaux-700"}`}
              >
                <ChefHat className="w-3.5 h-3.5" /> Modalità Privato
              </button>
              <button
                type="button"
                onClick={() => setBusinessMode(true)}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-colors ${businessMode ? "bg-gold-400 text-bordeaux-950 font-semibold" : "bg-bordeaux-800/50 text-cream-200 hover:bg-bordeaux-700"}`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Modalità Business
              </button>
            </div>
            {businessMode && (
              <p className="text-xs text-gold-400 text-center mb-4 animate-fade-in">
                Modalita Business attiva: i risultati includeranno margini suggeriti, temperatura di servizio, posizionamento in carta e consigli per la sala
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
                <input type="text" value={dish} onChange={(e) => setDish(e.target.value)}
                  placeholder={t("hero.search.placeholder")}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream-50 text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm md:text-base" />
              </div>
              <button type="submit"
                className="px-6 py-4 rounded-xl bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors flex items-center justify-center gap-2 group">
                {t("hero.search.button")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {(businessMode ? BUSINESS_DISHES : PREMIUM_DISHES).map((s) => (
              <button key={s} onClick={() => navigate(`/results?dish=${encodeURIComponent(s)}${businessMode ? "&mode=business" : ""}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-bordeaux-800/50 text-cream-200 hover:bg-gold-700 hover:text-cream-50 transition-colors border border-bordeaux-700">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scope: Oltrepò only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-5 rounded-xl bg-bordeaux-50 border border-bordeaux-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-bordeaux-950 flex items-center justify-center shrink-0">
            <WineIcon className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <p className="font-serif text-lg text-bordeaux-950">{t("catalog.tabOltrepo")}</p>
            <p className="text-xs text-bordeaux-600">225 vini dell'Oltrepò Pavese — 7 DOC/DOCG, 10 vitigni, 12 cantine reali</p>
          </div>
        </div>
        {businessMode && (
          <div className="mt-4 p-5 rounded-xl bg-gold-50 border border-gold-200 flex items-start gap-4 animate-fade-in">
            <Store className="w-10 h-10 text-gold-600 shrink-0" />
            <div>
              <p className="font-serif text-lg text-bordeaux-950">Modalita Business</p>
              <p className="text-xs text-bordeaux-600">Ogni abbinamento include: prezzo di vendita suggerito in carta, margine target, temperatura di servizio, posizionamento ideale nel menu, e consigli operativi per la sala. Perfetto per ristoratori, wine bar e enoteche.</p>
            </div>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="font-serif text-2xl md:text-3xl text-center text-bordeaux-950 mb-10">
          {t("section.howitworks")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Search, title: t("section.howitworks.1"), desc: t("section.howitworks.1.desc") },
            { icon: FlaskConical, title: t("section.howitworks.2"), desc: t("section.howitworks.2.desc") },
            { icon: Sparkles, title: t("section.howitworks.3"), desc: t("section.howitworks.3.desc") },
            { icon: ArrowRight, title: t("section.howitworks.4"), desc: t("section.howitworks.4.desc") },
          ].map((step, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bordeaux-800 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-gold-400" />
              </div>
              <div className="text-xs text-gold-600 font-semibold mb-2">0{i + 1}</div>
              <h3 className="font-serif text-lg font-semibold text-bordeaux-950 mb-2">{step.title}</h3>
              <p className="text-sm text-bordeaux-600 text-pretty">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="font-serif text-2xl md:text-3xl text-bordeaux-950 mb-8 text-center">{t("abbinamenti.tools")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <button key={i} onClick={() => navigate(tool.to)} className="text-left p-6 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-colors group">
              <tool.icon className="w-8 h-8 text-bordeaux-700 mb-3" />
              <h3 className="font-serif text-lg text-bordeaux-950">{tool.title}</h3>
              <p className="text-sm text-bordeaux-600 mt-1">{tool.desc}</p>
              <span className="flex items-center gap-1 text-xs text-bordeaux-600 mt-3 group-hover:text-gold-600 transition-colors">{tool.cta} <ArrowRight className="w-3 h-3" /></span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Grape, ArrowRight, MapPin, Wine as WineIcon, Mountain, Clock, Award, Layers, Wind, History, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getVitigni, getVitigniPageTexts } from "../data/vitigniTranslations";

const tipoColors: Record<string, string> = {
  Rosso: "bg-bordeaux-800 text-gold-400",
  Rouge: "bg-bordeaux-800 text-gold-400",
  Rot: "bg-bordeaux-800 text-gold-400",
  Rood: "bg-bordeaux-800 text-gold-400",
  Tinto: "bg-bordeaux-800 text-gold-400",
  赤: "bg-bordeaux-800 text-gold-400",
  Bianco: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Blanc: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Weiß: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Wit: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Blanco: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  白: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Spumante: "bg-gold-100 text-gold-700 border border-gold-300",
  Sparkling: "bg-gold-100 text-gold-700 border border-gold-300",
  Effervescent: "bg-gold-100 text-gold-700 border border-gold-300",
  Schaumwein: "bg-gold-100 text-gold-700 border border-gold-300",
  Schuimwijn: "bg-gold-100 text-gold-700 border border-gold-300",
  Espumoso: "bg-gold-100 text-gold-700 border border-gold-300",
  スパークリング: "bg-gold-100 text-gold-700 border border-gold-300",
  Dolce: "bg-amber-100 text-amber-700 border border-amber-300",
  Sweet: "bg-amber-100 text-amber-700 border border-amber-300",
  Doux: "bg-amber-100 text-amber-700 border border-amber-300",
  Süß: "bg-amber-100 text-amber-700 border border-amber-300",
  Zoet: "bg-amber-100 text-amber-700 border border-amber-300",
  Dulce: "bg-amber-100 text-amber-700 border border-amber-300",
  甘口: "bg-amber-100 text-amber-700 border border-amber-300",
  Rose: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Rosato: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Rosé: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  Rosado: "bg-cream-200 text-bordeaux-700 border border-cream-300",
  ロゼ: "bg-cream-200 text-bordeaux-700 border border-cream-300",
};

export default function VitigniGuide() {
  const { lang } = useApp();
  const texts = getVitigniPageTexts(lang);
  const vitigni = getVitigni(lang);

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-600 mb-2 flex items-center gap-1.5">
            <Grape className="w-3.5 h-3.5" /> {texts.badge}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bordeaux-950 mb-3">{texts.title}</h1>
          <p className="text-sm text-bordeaux-600 leading-relaxed max-w-2xl">
            {texts.subtitle}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {texts.stats.map((s, i) => (
            <div key={i} className="bg-bordeaux-950 rounded-xl p-4 text-center">
              <p className="font-serif text-2xl text-gold-400">{s.num}</p>
              <p className="text-xs text-cream-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Terroir section */}
        <div className="mb-8 p-6 rounded-xl bg-cream-50 border border-cream-200">
          <h2 className="font-serif text-xl text-bordeaux-950 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-600" /> {texts.terroirTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-bordeaux-50/50 border border-cream-200">
              <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" /> {texts.geologiaTitle}
              </p>
              <p className="text-xs text-bordeaux-600 leading-relaxed">
                {texts.geologiaText}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bordeaux-50/50 border border-cream-200">
              <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" /> {texts.climaTitle}
              </p>
              <p className="text-xs text-bordeaux-600 leading-relaxed">
                {texts.climaText}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gold-50/50 border border-gold-200">
            <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> {texts.storiaTitle}
            </p>
            <p className="text-xs text-bordeaux-600 leading-relaxed">
              {texts.storiaText}
            </p>
          </div>
        </div>

        {/* Denominazioni overview */}
        <div className="mb-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h2 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-400" /> {texts.denominazioniTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {texts.denominazioni.map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-bordeaux-800/50 border border-gold-700/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-400 text-bordeaux-950">{d.tipo}</span>
                  <p className="text-xs font-semibold text-cream-100">{d.nome}</p>
                </div>
                <p className="text-xs text-cream-300 leading-relaxed">{d.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vitigni cards */}
        <div className="space-y-4">
          {vitigni.map((v, i) => (
            <div key={i} className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-serif text-xl text-bordeaux-950">{v.nome}</h2>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColors[v.tipo] || "bg-cream-200 text-bordeaux-700 border border-cream-300"}`}>
                        {v.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-gold-600 font-medium">{v.denominazione}</p>
                  </div>
                </div>

                <p className="text-sm text-bordeaux-700 leading-relaxed mb-4">{v.descrizione}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">{texts.labels.origine}</p>
                      <p className="text-xs text-bordeaux-600">{v.origine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Grape className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">{texts.labels.superficie}</p>
                      <p className="text-xs text-bordeaux-600">{v.superficie}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mountain className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">{texts.labels.altitudine}</p>
                      <p className="text-xs text-bordeaux-600">{v.altitudine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">{texts.labels.invecchiamento}</p>
                      <p className="text-xs text-bordeaux-600">{v.potenzialeInvecchiamento}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-bordeaux-50/50 border border-cream-200">
                  <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mountain className="w-3 h-3" /> {texts.labels.suoli}
                  </p>
                  <p className="text-xs text-bordeaux-600">{v.suoli}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">{texts.labels.profilo}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.profilo.map((p, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-bordeaux-50 text-bordeaux-700 border border-cream-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">{texts.labels.abbinamenti}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.abbinamenti.map((a, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-cream-100 text-bordeaux-600">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1.5">{texts.labels.cantine}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.cantine.map((c, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gold-50/50 border border-gold-200">
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Award className="w-3 h-3" /> {texts.labels.disciplinare}
                    </p>
                    <p className="text-xs text-bordeaux-600">{v.disciplinare}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 py-3 bg-bordeaux-50 border-t border-cream-200">
                <p className="text-xs text-bordeaux-600 italic flex items-start gap-2">
                  <WineIcon className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                  {v.curiosita}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-xl bg-bordeaux-950 text-cream-100">
          <h3 className="font-serif text-xl text-cream-50 mb-2">{texts.ctaTitle}</h3>
          <p className="text-sm text-cream-200 mb-4">{texts.ctaText}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalog?regione=Oltrepò+Pavese" className="px-5 py-3 rounded-lg bg-gold-400 text-bordeaux-950 font-semibold hover:bg-gold-300 transition-colors text-sm text-center flex items-center justify-center gap-2">
              <WineIcon className="w-4 h-4" /> {texts.ctaCatalog} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cantine" className="px-5 py-3 rounded-lg bg-bordeaux-800 text-cream-50 font-semibold hover:bg-bordeaux-700 transition-colors text-sm text-center border border-gold-700/30 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> {texts.ctaDirectory} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

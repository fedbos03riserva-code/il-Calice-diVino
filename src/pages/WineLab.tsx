import { useEffect, useState } from "react";
import { Beaker, ArrowLeft, SlidersHorizontal, RefreshCw, Sparkles, Wine as WineIcon, MapPin, Grape, Percent, Info, ChefHat, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { loadWineCatalog, getWineTypes } from "../data/wineCatalog";
import { pairDishWithCatalog } from "../lib/pairingEngine";
import type { PairingResult, Wine } from "../types/wine";

const FASCIE_INFO: Record<string, { range: string; desc: string }> = {
  economico: { range: "€8 – €15", desc: "Vini di tutti i giorni, ottimo rapporto qualità-prezzo" },
  standard: { range: "€15 – €30", desc: "Vini affidabili per occasioni regolari" },
  premium: { range: "€30 – €70", desc: "Vini di qualità superiore, per momenti speciali" },
  lusso: { range: "€70 – €200+", desc: "Grandi bottiglie, etichette prestigiose e annate eccezionali" },
};

const TANNINI_INFO: Record<string, { chimica: string; bocca: string }> = {
  "assenti": { chimica: "Vino senza tannini (bianchi e rosati). Nessun legame con le proteine della carne.", bocca: "Bocca fluida e fresca, nessuna astringenza." },
  "leggeri": { chimica: "Tannini a bassa concentrazione, estratti con macerazione breve.", bocca: "Astringenza minima, sensazione setosa in bocca." },
  "media": { chimica: "Tannini mediamente concentrati, bilanciati con l'acidità.", bocca: "Sensazione di struttura moderata, leggero grip sulle gengive." },
  "strutturati": { chimica: "Tannini concentrati che si legano alle proteine della carne, sgrassando il palato.", bocca: "Astringenza pronunciata, bocca piena e persistente." },
  "potenti": { chimica: "Tannini ad alta concentrazione, richiedono piatti grassi e proteici per bilanciarsi.", bocca: "Astringenza marcata, sensazione di grip intenso e lungo." },
};

const ACIDITA_INFO: Record<string, string> = {
  "bassa": "pH > 3.8. Vini morbidi, richiedono piatti altrettanto morbidi per non sembrare piatti.",
  "media": "pH 3.3–3.8. Acidità equilibrata, versatile con la maggior parte dei piatti.",
  "alta": "pH < 3.3. Acidità tagliante che sgrassa e rinfresca, perfetta con cibi ricchi e grassi.",
};

const CORPO_INFO: Record<string, string> = {
  "leggero": "Vino snello, 10–11.5% alcol. Ideale con piatti delicati.",
  "medio": "Corpo moderato, 11.5–13% alcol. Versatile, regge piatti di media intensità.",
  "medio-pieno": "Corpo strutturato, 13–14% alcol. Regge piatti saporiti e salse ridotte.",
  "pieno": "Corpo importante, 14%+ alcol. Per piatti intensi, carnosi e strutturati.",
};

export default function WineLab() {
  const navigate = useNavigate();
  const { t, searchHistory } = useApp();
  const [catalog, setCatalog] = useState<Wine[]>([]);
  const [dish, setDish] = useState(searchHistory[0]?.piatto || "risotto ai funghi");
  const [fat, setFat] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [spice, setSpice] = useState(20);
  const [sweet, setSweet] = useState(10);
  const [aiNote, setAiNote] = useState("");
  const [result, setResult] = useState<PairingResult | null>(null);
  const [filterTipo, setFilterTipo] = useState("all");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadWineCatalog().then(setCatalog); }, []);

  const types = getWineTypes(catalog);

  useEffect(() => {
    if (!catalog.length) return;
    const modifiers: string[] = [];
    if (fat !== 50) modifiers.push(`grassezza ${fat}%`);
    if (intensity !== 50) modifiers.push(`intensità ${intensity}%`);
    if (spice !== 20) modifiers.push(`speziatura ${spice}%`);
    if (sweet !== 10) modifiers.push(`dolcezza ${sweet}%`);
    if (aiNote.trim()) modifiers.push(aiNote.trim());
    const fullDish = modifiers.length ? `${dish}, ${modifiers.join(", ")}` : dish;
    let pool = catalog;
    if (filterTipo !== "all") pool = catalog.filter((w) => w.tipo === filterTipo);
    setResult(pairDishWithCatalog(pool, fullDish)[0] || null);
  }, [catalog, dish, fat, intensity, spice, sweet, aiNote, filterTipo]);

  const reset = () => { setFat(50); setIntensity(50); setSpice(20); setSweet(10); setAiNote(""); setFilterTipo("all"); };

  const w = result?.wine;
  const fasciaInfo = w ? FASCIE_INFO[w.fascia] : null;
  const tanniniInfo = w ? TANNINI_INFO[w.tannini] : null;
  const aciditaInfo = w ? ACIDITA_INFO[w.acidita] : null;
  const corpoInfo = w ? CORPO_INFO[w.corpo] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> {t("nav.home")}
      </button>

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Beaker className="w-7 h-7 text-gold-600" />
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">{t("nav.winelab")}</p>
        </div>
        <h1 className="font-serif text-4xl text-bordeaux-950">{t("winelab.title")}</h1>
        <p className="text-bordeaux-600 mt-3 leading-relaxed">{t("winelab.desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        {/* Left: Controls */}
        <section className="p-6 rounded-2xl bg-cream-100 border border-cream-200">
          <label className="text-xs text-bordeaux-600 block mb-1">{t("winelab.dish")}</label>
          <textarea value={dish} onChange={(e) => setDish(e.target.value)} rows={2}
            className="w-full px-3 py-3 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 focus:outline-none focus:ring-2 focus:ring-gold-400" />

          <div className="mt-6 space-y-5">
            <Slider label={t("winelab.fat")} value={fat} onChange={setFat} low={t("winelab.light")} high={t("winelab.rich")} />
            <Slider label={t("winelab.intensity")} value={intensity} onChange={setIntensity} low={t("winelab.delicate")} high={t("winelab.powerful")} />
            <Slider label={t("winelab.spice")} value={spice} onChange={setSpice} low={t("winelab.clean")} high={t("winelab.piccante")} />
            <Slider label={t("winelab.sweet")} value={sweet} onChange={setSweet} low={t("winelab.sapido")} high={t("winelab.dolce")} />
          </div>

          {/* Filters */}
          <button onClick={() => setShowFilters(!showFilters)} className="mt-5 flex items-center gap-2 text-sm text-bordeaux-600 hover:text-gold-600">
            <Filter className="w-4 h-4" /> {t("winelab.filter")}
          </button>
          {showFilters && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setFilterTipo("all")} className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filterTipo === "all" ? "bg-bordeaux-800 text-cream-50" : "bg-cream-50 text-bordeaux-700 border border-cream-300"}`}>{t("winelab.all")}</button>
              {types.map((tp) => (
                <button key={tp} onClick={() => setFilterTipo(tp)} className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filterTipo === tp ? "bg-bordeaux-800 text-cream-50" : "bg-cream-50 text-bordeaux-700 border border-cream-300"}`}>{tp}</button>
              ))}
            </div>
          )}

          {/* AI text input */}
          <div className="mt-6 p-4 rounded-xl bg-bordeaux-50 border border-bordeaux-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <p className="text-xs font-semibold text-bordeaux-800">{t("winelab.ai.title")}</p>
            </div>
            <p className="text-xs text-bordeaux-500 mb-2 leading-relaxed">{t("winelab.ai.desc")}</p>
            <textarea value={aiNote} onChange={(e) => setAiNote(e.target.value)} rows={2}
              placeholder={t("winelab.ai.placeholder")}
              className="w-full px-3 py-2.5 rounded-lg bg-cream-50 border border-cream-300 text-sm text-bordeaux-950 placeholder:text-bordeaux-400 focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>

          <button onClick={reset} className="mt-6 flex items-center gap-2 text-sm text-bordeaux-600 hover:text-gold-600">
            <RefreshCw className="w-4 h-4" /> {t("winelab.reset")}
          </button>
        </section>

        {/* Right: Results */}
        <section className="p-6 rounded-2xl bg-bordeaux-950 text-cream-100 min-h-[400px]">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-xl text-cream-50">{t("winelab.result")}</h2>
          </div>

          {result && w ? (
            <>
              {/* Wine name + score */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gold-400 uppercase tracking-wider">{t("winelab.best")}</p>
                  <h3 className="font-serif text-2xl text-cream-50 mt-1">{w.nome}</h3>
                  <p className="text-sm text-cream-300 mt-1">{w.regione} · {w.continente}</p>
                </div>
                <span className="text-4xl font-serif text-gold-400">{result.score.totale}</span>
              </div>

              {/* Wine indicators with info */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <InfoCard icon={WineIcon} label={t("winelab.best")} value={w.tipo} />
                <InfoCard icon={Grape} label={t("winelab.vitigno")} value={w.uva} />
                <InfoCard icon={Percent} label={t("winelab.alcol")} value={`${w.alcol}%`} />
                <InfoCard icon={MapPin} label={t("winelab.fascia")} value={`${w.fascia} · €${w.prezzo.toFixed(0)}`} />
              </div>

              {/* Chemical indicators with expandable info */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <TechIndicator label={t("winelab.acidita")} value={w.acidita} info={aciditaInfo} showKey="acidita" showInfo={showInfo} setShowInfo={setShowInfo} />
                <TechIndicator label={t("winelab.tannini")} value={w.tannini} info={tanniniInfo ? `${tanniniInfo.chimica} ${tanniniInfo.bocca}` : null} showKey="tannini" showInfo={showInfo} setShowInfo={setShowInfo} />
                <TechIndicator label={t("winelab.corpo")} value={w.corpo} info={corpoInfo} showKey="corpo" showInfo={showInfo} setShowInfo={setShowInfo} />
                <TechIndicator label={t("winelab.zuccheri")} value={w.residuo_zuccherino > 50 ? "Dolce" : w.residuo_zuccherino > 10 ? "Abboccato" : "Secco"} info={w.residuo_zuccherino > 50 ? "Residuo zuccherino alto, vino dolce o da dessert." : w.residuo_zuccherino > 10 ? "Leggero residuo zuccherino, vino abboccato." : "Vino secco, residuo zuccherino minimo (< 4g/L)."} showKey="zuccheri" showInfo={showInfo} setShowInfo={setShowInfo} />
              </div>

              {/* Tannini detail */}
              {tanniniInfo && showInfo === "tannini" && (
                <div className="mt-3 p-4 rounded-lg bg-bordeaux-800/60 border border-gold-700/20 space-y-2">
                  <div>
                    <p className="text-xs text-gold-400 font-semibold uppercase">In chimica</p>
                    <p className="text-xs text-cream-300 mt-1 leading-relaxed">{tanniniInfo.chimica}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gold-400 font-semibold uppercase">In bocca</p>
                    <p className="text-xs text-cream-300 mt-1 leading-relaxed">{tanniniInfo.bocca}</p>
                  </div>
                </div>
              )}

              {/* Aromatic profile */}
              <div className="mt-4">
                <p className="text-[10px] text-cream-400 uppercase mb-1.5">{t("winelab.aromatic")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.profilo_aromatico.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-1 rounded-full bg-bordeaux-800/60 text-cream-200 border border-gold-700/20">{a}</span>
                  ))}
                </div>
              </div>

              {/* Pairs with */}
              <div className="mt-3">
                <p className="text-[10px] text-cream-400 uppercase mb-1.5">{t("winelab.pairs")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.abbina_bene_con.slice(0, 4).map((a) => (
                    <span key={a} className="text-[10px] px-2 py-1 rounded-full bg-gold-700/30 text-gold-200">🍽️ {a}</span>
                  ))}
                </div>
              </div>

              {/* Culinary tips */}
              <div className="mt-4 p-4 rounded-lg bg-bordeaux-800/40 border border-gold-700/20">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="w-4 h-4 text-gold-400" />
                  <p className="text-xs font-semibold text-gold-400 uppercase">{t("winelab.culinary")}</p>
                </div>
                <p className="text-xs text-cream-300 leading-relaxed">
                  Per valorizzare questo vino: privilegia cotture che mantengano l'equilibrio tra la struttura del piatto
                  e il profilo del vino. Se il vino è {w.tipo.toLowerCase()} con acidità {w.acidita},
                  {" "}{w.acidita === "alta" ? "usa grassi moderati e cotture semplici per non coprire la freschezza" : w.acidita === "bassa" ? "aggiungi acidità con agrumi o riduzioni per bilanciare il palato" : "bilancia con salse di media intensità e cotture lente"}.
                  {w.tannini !== "assenti" && w.tannini !== "leggeri" ? " I tannini richiedono proteine e grassi per ammorbidirsi: carne, formaggi stagionati o riduzioni." : ""}
                </p>
              </div>

              {/* IRC Score bars */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-bordeaux-800">
                {[["Chimica", result.score.chimica, 40], ["Aromaticità", result.score.aromatico, 25], ["Struttura", result.score.struttura, 20], ["Pulizia", result.score.pulizia, 15]].map(([label, value, max]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-xs text-cream-300">
                      <span>{label}</span>
                      <span>{value}/{max}</span>
                    </div>
                    <div className="h-2 rounded-full bg-bordeaux-800 mt-1">
                      <div className="h-2 rounded-full bg-gold-400 transition-all duration-500" style={{ width: `${(Number(value) / Number(max)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mechanism explanation */}
              <p className="text-sm text-cream-200 mt-5 leading-relaxed">{result.meccanismo_chimico}</p>

              {/* Price range info */}
              {fasciaInfo && (
                <div className="mt-4 p-3 rounded-lg bg-bordeaux-800/40 border border-gold-700/20">
                  <p className="text-xs text-gold-400 font-semibold">{w.fascia} — {fasciaInfo.range}</p>
                  <p className="text-xs text-cream-300 mt-0.5">{fasciaInfo.desc}</p>
                </div>
              )}

              <button onClick={() => navigate(`/wine/${w.id}`)} className="mt-5 text-sm text-gold-400 hover:text-gold-300">
                {t("winelab.fullcard")} →
              </button>
            </>
          ) : (
            <p className="text-cream-300">{t("winelab.loading")}</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, low, high }: { label: string; value: number; onChange: (value: number) => void; low: string; high: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-bordeaux-800 mb-2">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-bordeaux-700" />
      <div className="flex justify-between text-xs text-bordeaux-500 mt-1">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof WineIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-bordeaux-800/50">
      <Icon className="w-4 h-4 text-gold-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-cream-400 uppercase">{label}</p>
        <p className="text-xs text-cream-100 truncate">{value}</p>
      </div>
    </div>
  );
}

function TechIndicator({ label, value, info, showKey, showInfo, setShowInfo }: { label: string; value: string; info: string | null; showKey: string; showInfo: string | null; setShowInfo: (v: string | null) => void }) {
  return (
    <div>
      <div className="p-2.5 rounded-lg bg-bordeaux-800/50">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-cream-400 uppercase">{label}</p>
          {info && (
            <button onClick={() => setShowInfo(showInfo === showKey ? null : showKey)} className="text-cream-400 hover:text-gold-400 transition-colors">
              <Info className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-xs text-cream-100 mt-0.5 capitalize">{value}</p>
      </div>
      {info && showInfo === showKey && showKey !== "tannini" && (
        <p className="text-[10px] text-cream-400 mt-1.5 leading-relaxed px-1">{info}</p>
      )}
    </div>
  );
}

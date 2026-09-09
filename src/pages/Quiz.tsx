import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const QUESTIONS = [
  { title: "Che cosa cerchi in un calice?", options: [{ label: "Freschezza e leggerezza", type: "Bianco" }, { label: "Struttura e profondità", type: "Rosso" }, { label: "Eleganza e bollicine", type: "Spumante" }, { label: "Morbidezza e profumi", type: "Rosato" }] },
  { title: "Quale tavola ti rappresenta?", options: [{ label: "Pesce, crudi e verdure", type: "Bianco" }, { label: "Carni, paste e formaggi", type: "Rosso" }, { label: "Aperitivo e finger food", type: "Spumante" }, { label: "Cucina estiva e speziata", type: "Rosato" }] },
  { title: "Come preferisci il finale?", options: [{ label: "Secco e minerale", type: "Bianco" }, { label: "Lungo e tannico", type: "Rosso" }, { label: "Fresco e frizzante", type: "Spumante" }, { label: "Fruttato e morbido", type: "Rosato" }] },
  { title: "Qual è la tua occasione?", options: [{ label: "Una cena intima", type: "Rosso" }, { label: "Un pranzo leggero", type: "Bianco" }, { label: "Una festa", type: "Spumante" }, { label: "Un tramonto", type: "Rosato" }] },
  { title: "Scegli un profilo aromatico", options: [{ label: "Agrumi ed erbe", type: "Bianco" }, { label: "Frutti rossi e spezie", type: "Rosso" }, { label: "Mela, brioche e fiori", type: "Spumante" }, { label: "Fragola e fiori", type: "Rosato" }] },
];

export default function Quiz() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const result = useMemo(() => { const counts = answers.reduce<Record<string, number>>((acc, type) => ({ ...acc, [type]: (acc[type] || 0) + 1 }), {}); return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Rosso"; }, [answers]);

  const choose = (type: string) => { const next = [...answers, type]; setAnswers(next); if (step === QUESTIONS.length - 1) setDone(true); else setStep(step + 1); };
  const restart = () => { setStep(0); setAnswers([]); setDone(false); };

  if (done) return <div className="max-w-xl mx-auto px-4 py-16 text-center"><div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-gold-600" /></div><p className="text-xs tracking-[0.25em] uppercase text-gold-600">Il tuo profilo</p><h1 className="font-serif text-4xl text-bordeaux-950 mt-2">Il tuo vino ideale è {result}</h1><p className="text-bordeaux-600 mt-4">Abbiamo incrociato le tue preferenze di struttura, freschezza, occasione e profumi.</p><button onClick={() => navigate(`/catalog?tipo=${result}`)} className="mt-7 px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors">Esplora i {result.toLowerCase()}</button><button onClick={restart} className="block mx-auto mt-4 text-sm text-bordeaux-600 hover:text-gold-600">Ripeti il quiz</button></div>;

  const question = QUESTIONS[step];
  return <div className="max-w-2xl mx-auto px-4 py-10 md:py-16"><button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-10"><ArrowLeft className="w-4 h-4" /> {t("nav.home")}</button><div className="text-center mb-8"><Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" /><p className="text-xs uppercase tracking-[0.2em] text-gold-600">Quiz del gusto</p><h1 className="font-serif text-3xl text-bordeaux-950 mt-2">Trova il tuo vino ideale</h1><p className="text-sm text-bordeaux-500 mt-2">Domanda {step + 1} di {QUESTIONS.length}</p></div><div className="h-1 bg-cream-200 rounded-full mb-8"><div className="h-1 bg-gold-500 rounded-full transition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></div><div className="p-6 md:p-8 rounded-2xl bg-cream-50 border border-cream-200"><h2 className="font-serif text-2xl text-bordeaux-950 mb-6">{question.title}</h2><div className="grid gap-3">{question.options.map((option) => <button key={option.label} onClick={() => choose(option.type)} className="w-full text-left p-4 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-400 hover:bg-gold-50 transition-colors flex items-center justify-between group"><span className="text-sm text-bordeaux-800">{option.label}</span><ArrowRight className="w-4 h-4 text-bordeaux-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" /></button>)}</div></div></div>;
}

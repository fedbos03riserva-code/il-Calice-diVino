import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Wine as WineIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface Option {
  label: string;
  type: string;
  weight: number;
}

interface Question {
  title: string;
  subtitle?: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    title: "Che cosa cerchi in un calice?",
    subtitle: "La sensazione dominante che vorresti sentire",
    options: [
      { label: "Freschezza e leggerezza", type: "Bianco", weight: 3 },
      { label: "Struttura e profondità", type: "Rosso", weight: 3 },
      { label: "Eleganza e bollicine", type: "Spumante", weight: 3 },
      { label: "Morbidezza e profumi floreali", type: "Rosato", weight: 3 },
    ],
  },
  {
    title: "Quale tavola ti rappresenta?",
    subtitle: "Il tipo di cucina che preferisci",
    options: [
      { label: "Pesce, crudi e verdure", type: "Bianco", weight: 3 },
      { label: "Carni, paste e formaggi", type: "Rosso", weight: 3 },
      { label: "Aperitivo e finger food", type: "Spumante", weight: 3 },
      { label: "Cucina estiva e speziata", type: "Rosato", weight: 3 },
    ],
  },
  {
    title: "Come preferisci il finale?",
    subtitle: "La sensazione che resta dopo aver deglutito",
    options: [
      { label: "Secco e minerale", type: "Bianco", weight: 2 },
      { label: "Lungo e tannico", type: "Rosso", weight: 2 },
      { label: "Fresco e frizzante", type: "Spumante", weight: 2 },
      { label: "Fruttato e morbido", type: "Rosato", weight: 2 },
    ],
  },
  {
    title: "Qual è la tua occasione?",
    options: [
      { label: "Una cena intima", type: "Rosso", weight: 2 },
      { label: "Un pranzo leggero", type: "Bianco", weight: 2 },
      { label: "Una festa o celebrazione", type: "Spumante", weight: 2 },
      { label: "Un tramonto in terrazza", type: "Rosato", weight: 2 },
    ],
  },
  {
    title: "Scegli un profilo aromatico",
    subtitle: "Gli aromi che ti attraggono di più",
    options: [
      { label: "Agrumi, erbe e mineralità", type: "Bianco", weight: 2 },
      { label: "Frutti rossi, spezie e tabacco", type: "Rosso", weight: 2 },
      { label: "Mela, brioche e fiori bianchi", type: "Spumante", weight: 2 },
      { label: "Fragola, rosa e agrumi rossi", type: "Rosato", weight: 2 },
    ],
  },
  {
    title: "Che temperatura preferisci?",
    subtitle: "Come ti piace servire il vino",
    options: [
      { label: "Fresco (8–10°C)", type: "Spumante", weight: 2 },
      { label: "Freddo (10–12°C)", type: "Bianco", weight: 2 },
      { label: "Temperato (14–16°C)", type: "Rosato", weight: 2 },
      { label: "Ambiente (18–20°C)", type: "Rosso", weight: 2 },
    ],
  },
  {
    title: "Quanto corpo vuoi?",
    subtitle: "La consistenza del vino in bocca",
    options: [
      { label: "Leggero e snello", type: "Bianco", weight: 1 },
      { label: "Strutturato e pieno", type: "Rosso", weight: 1 },
      { label: "Elegante e fine", type: "Spumante", weight: 1 },
      { label: "Morbido e avvolgente", type: "Rosato", weight: 1 },
    ],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; weight: number }[]>([]);
  const [done, setDone] = useState(false);

  const result = useMemo(() => {
    const counts = answers.reduce<Record<string, number>>((acc, a) => ({
      ...acc,
      [a.type]: (acc[a.type] || 0) + a.weight,
    }), {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Rosso";
  }, [answers]);

  const choose = (type: string, weight: number) => {
    const next = [...answers, { type, weight }];
    setAnswers(next);
    if (step === QUESTIONS.length - 1) setDone(true);
    else setStep(step + 1);
  };

  const restart = () => { setStep(0); setAnswers([]); setDone(false); };

  if (done) {
    const resultDesc: Record<string, string> = {
      Rosso: "Struttura, tannini e profondità. Cerchi vini che reggono piatti importanti e lasciano il segno.",
      Bianco: "Freschezza, acidità e mineralità. Vini che rinfrescano il palato senza appesantirlo.",
      Spumante: "Eleganza, bollicine e festività. Vini che celebrano il momento con classe.",
      Rosato: "Morbidezza, profumi e versatilità. Vini che uniscono freschezza e carattere.",
    };

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-gold-600" />
        </div>
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600">Il tuo profilo</p>
        <h1 className="font-serif text-4xl text-bordeaux-950 mt-2">Il tuo vino ideale è {result}</h1>
        <p className="text-bordeaux-600 mt-4 leading-relaxed">{resultDesc[result]}</p>
        <p className="text-sm text-bordeaux-500 mt-2">
          Abbiamo incrociato le tue preferenze di struttura, freschezza, temperatura, occasione, profumi e corpo
          con il motore AI Bwine per trovare la combinazione perfetta.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <button onClick={() => navigate(`/catalog?tipo=${result}`)} className="px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors flex items-center justify-center gap-2">
            <WineIcon className="w-4 h-4" /> Esplora i {result.toLowerCase()}
          </button>
          <button onClick={() => navigate("/wine-lab")} className="px-6 py-3 rounded-lg bg-gold-400 text-bordeaux-950 hover:bg-gold-300 transition-colors">
            Prova il Wine Lab
          </button>
        </div>
        <button onClick={restart} className="block mx-auto mt-4 text-sm text-bordeaux-600 hover:text-gold-600">Ripeti il quiz</button>
      </div>
    );
  }

  const question = QUESTIONS[step];
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-bordeaux-600 mb-10">
        <ArrowLeft className="w-4 h-4" /> {t("nav.home")}
      </button>
      <div className="text-center mb-8">
        <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600">Quiz del gusto</p>
        <h1 className="font-serif text-3xl text-bordeaux-950 mt-2">Trova il tuo vino ideale</h1>
        <p className="text-sm text-bordeaux-500 mt-2">Domanda {step + 1} di {QUESTIONS.length}</p>
      </div>
      <div className="h-1 bg-cream-200 rounded-full mb-8">
        <div className="h-1 bg-gold-500 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="p-6 md:p-8 rounded-2xl bg-cream-50 border border-cream-200">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-1">{question.title}</h2>
        {question.subtitle && <p className="text-sm text-bordeaux-500 mb-5">{question.subtitle}</p>}
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button key={option.label} onClick={() => choose(option.type, option.weight)}
              className="w-full text-left p-4 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-400 hover:bg-gold-50 transition-colors flex items-center justify-between group">
              <span className="text-sm text-bordeaux-800">{option.label}</span>
              <ArrowRight className="w-4 h-4 text-bordeaux-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

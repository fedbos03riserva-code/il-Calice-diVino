import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Wine as WineIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface Option {
  labelKey: string;
  type: string;
  weight: number;
}

interface Question {
  titleKey: string;
  subtitleKey?: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    titleKey: "quiz.q1",
    subtitleKey: "quiz.q1.sub",
    options: [
      { labelKey: "quiz.opt.fresh", type: "Bianco", weight: 3 },
      { labelKey: "quiz.opt.structure", type: "Rosso", weight: 3 },
      { labelKey: "quiz.opt.elegant", type: "Spumante", weight: 3 },
      { labelKey: "quiz.opt.soft", type: "Rosato", weight: 3 },
    ],
  },
  {
    titleKey: "quiz.q2",
    subtitleKey: "quiz.q2.sub",
    options: [
      { labelKey: "quiz.opt.fish", type: "Bianco", weight: 3 },
      { labelKey: "quiz.opt.meat", type: "Rosso", weight: 3 },
      { labelKey: "quiz.opt.aperitif", type: "Spumante", weight: 3 },
      { labelKey: "quiz.opt.summer", type: "Rosato", weight: 3 },
    ],
  },
  {
    titleKey: "quiz.q3",
    subtitleKey: "quiz.q3.sub",
    options: [
      { labelKey: "quiz.opt.dry", type: "Bianco", weight: 2 },
      { labelKey: "quiz.opt.long", type: "Rosso", weight: 2 },
      { labelKey: "quiz.opt.sparkling", type: "Spumante", weight: 2 },
      { labelKey: "quiz.opt.fruity", type: "Rosato", weight: 2 },
    ],
  },
  {
    titleKey: "quiz.q4",
    options: [
      { labelKey: "quiz.opt.dinner", type: "Rosso", weight: 2 },
      { labelKey: "quiz.opt.lunch", type: "Bianco", weight: 2 },
      { labelKey: "quiz.opt.party", type: "Spumante", weight: 2 },
      { labelKey: "quiz.opt.sunset", type: "Rosato", weight: 2 },
    ],
  },
  {
    titleKey: "quiz.q5",
    subtitleKey: "quiz.q5.sub",
    options: [
      { labelKey: "quiz.opt.citrus", type: "Bianco", weight: 2 },
      { labelKey: "quiz.opt.redfruit", type: "Rosso", weight: 2 },
      { labelKey: "quiz.opt.apple", type: "Spumante", weight: 2 },
      { labelKey: "quiz.opt.strawberry", type: "Rosato", weight: 2 },
    ],
  },
  {
    titleKey: "quiz.q6",
    subtitleKey: "quiz.q6.sub",
    options: [
      { labelKey: "quiz.opt.cool", type: "Spumante", weight: 2 },
      { labelKey: "quiz.opt.cold", type: "Bianco", weight: 2 },
      { labelKey: "quiz.opt.temp", type: "Rosato", weight: 2 },
      { labelKey: "quiz.opt.room", type: "Rosso", weight: 2 },
    ],
  },
  {
    titleKey: "quiz.q7",
    subtitleKey: "quiz.q7.sub",
    options: [
      { labelKey: "quiz.opt.light", type: "Bianco", weight: 1 },
      { labelKey: "quiz.opt.full", type: "Rosso", weight: 1 },
      { labelKey: "quiz.opt.fine", type: "Spumante", weight: 1 },
      { labelKey: "quiz.opt.warm", type: "Rosato", weight: 1 },
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
    const resultKey = result.toLowerCase();
    const resultTitleKey = `quiz.result.${resultKey}`;
    const resultDescKey = `quiz.result.${resultKey}.desc`;

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-gold-600" />
        </div>
        <p className="text-xs tracking-[0.25em] uppercase text-gold-600">{t("quiz.result.title")}</p>
        <h1 className="font-serif text-4xl text-bordeaux-950 mt-2">{t(resultTitleKey)}</h1>
        <p className="text-bordeaux-600 mt-4 leading-relaxed">{t(resultDescKey)}</p>
        <p className="text-sm text-bordeaux-500 mt-2">{t("quiz.result.explain")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <button onClick={() => navigate(`/catalog?tipo=${result}`)} className="px-6 py-3 rounded-lg bg-bordeaux-800 text-cream-50 hover:bg-bordeaux-700 transition-colors flex items-center justify-center gap-2">
            <WineIcon className="w-4 h-4" /> {t("quiz.result.explore")} {result.toLowerCase()}
          </button>
          <button onClick={() => navigate("/wine-lab")} className="px-6 py-3 rounded-lg bg-gold-400 text-bordeaux-950 hover:bg-gold-300 transition-colors">
            {t("quiz.result.lab")}
          </button>
        </div>
        <button onClick={restart} className="block mx-auto mt-4 text-sm text-bordeaux-600 hover:text-gold-600">{t("quiz.result.retry")}</button>
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
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600">{t("quiz.title")}</p>
        <h1 className="font-serif text-3xl text-bordeaux-950 mt-2">{t("quiz.subtitle")}</h1>
        <p className="text-sm text-bordeaux-500 mt-2">{t("quiz.question")} {step + 1} {t("quiz.of")} {QUESTIONS.length}</p>
      </div>
      <div className="h-1 bg-cream-200 rounded-full mb-8">
        <div className="h-1 bg-gold-500 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="p-6 md:p-8 rounded-2xl bg-cream-50 border border-cream-200">
        <h2 className="font-serif text-2xl text-bordeaux-950 mb-1">{t(question.titleKey)}</h2>
        {question.subtitleKey && <p className="text-sm text-bordeaux-500 mb-5">{t(question.subtitleKey)}</p>}
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button key={option.labelKey} onClick={() => choose(option.type, option.weight)}
              className="w-full text-left p-4 rounded-xl bg-cream-100 border border-cream-200 hover:border-gold-400 hover:bg-gold-50 transition-colors flex items-center justify-between group">
              <span className="text-sm text-bordeaux-800">{t(option.labelKey)}</span>
              <ArrowRight className="w-4 h-4 text-bordeaux-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

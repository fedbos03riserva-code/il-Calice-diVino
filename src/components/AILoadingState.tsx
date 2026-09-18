import { useEffect, useState } from "react";
import { Sparkles, FlaskRound, Atom, Wine, Gauge, Target } from "lucide-react";

type Lang = "it" | "en" | "fr" | "es" | "de" | "jp" | "nl";

const MESSAGES: Record<Lang, { text: string; icon: typeof Sparkles }[]> = {
  it: [
    { text: "BF45 AI sta pensando...", icon: Sparkles },
    { text: "BF45 AI sta analizzando il piatto a livello molecolare...", icon: Atom },
    { text: "BF45 AI sta identificando lipidi, proteine e acidi organici...", icon: FlaskRound },
    { text: "BF45 AI sta abbinando i vini per chimica e aromaticità...", icon: Wine },
    { text: "BF45 AI sta calcolando le reazioni chimiche in bocca...", icon: Target },
    { text: "BF45 AI sta valutando l'equilibrio tannini-acidità-corpo...", icon: Gauge },
    { text: "BF45 AI sta ottimizzando il punteggio IRC su 100...", icon: Target },
    { text: "BF45 AI sta finalizzando i consigli culinari...", icon: Sparkles },
  ],
  en: [
    { text: "BF45 AI is thinking...", icon: Sparkles },
    { text: "BF45 AI is analyzing the dish at molecular level...", icon: Atom },
    { text: "BF45 AI is identifying lipids, proteins and organic acids...", icon: FlaskRound },
    { text: "BF45 AI is pairing wines by chemistry and aromatics...", icon: Wine },
    { text: "BF45 AI is calculating chemical reactions in the mouth...", icon: Target },
    { text: "BF45 AI is evaluating tannin-acidity-body balance...", icon: Gauge },
    { text: "BF45 AI is optimizing the IRC score out of 100...", icon: Target },
    { text: "BF45 AI is finalizing culinary recommendations...", icon: Sparkles },
  ],
  fr: [
    { text: "BF45 AI réfléchit...", icon: Sparkles },
    { text: "BF45 AI analyse le plat au niveau moléculaire...", icon: Atom },
    { text: "BF45 AI identifie les lipides, protéines et acides organiques...", icon: FlaskRound },
    { text: "BF45 AI associe les vins par chimie et aromaticité...", icon: Wine },
    { text: "BF45 AI calcule les réactions chimiques en bouche...", icon: Target },
    { text: "BF45 AI évalue l'équilibre tanins-acidité-corps...", icon: Gauge },
    { text: "BF45 AI optimise le score IRC sur 100...", icon: Target },
    { text: "BF45 AI finalise les recommandations culinaires...", icon: Sparkles },
  ],
  es: [
    { text: "BF45 AI está pensando...", icon: Sparkles },
    { text: "BF45 AI está analizando el plato a nivel molecular...", icon: Atom },
    { text: "BF45 AI está identificando lípidos, proteínas y ácidos orgánicos...", icon: FlaskRound },
    { text: "BF45 AI está emparejando vinos por química y aromaticidad...", icon: Wine },
    { text: "BF45 AI está calculando las reacciones químicas en boca...", icon: Target },
    { text: "BF45 AI está evaluando el equilibrio taninos-acidez-cuerpo...", icon: Gauge },
    { text: "BF45 AI está optimizando el puntaje IRC sobre 100...", icon: Target },
    { text: "BF45 AI está finalizando las recomendaciones culinarias...", icon: Sparkles },
  ],
  de: [
    { text: "BF45 AI denkt nach...", icon: Sparkles },
    { text: "BF45 AI analysiert das Gericht auf molekularer Ebene...", icon: Atom },
    { text: "BF45 AI identifiziert Lipide, Proteine und organische Säuren...", icon: FlaskRound },
    { text: "BF45 AI paart Weine nach Chemie und Aromatik...", icon: Wine },
    { text: "BF45 AI berechnet chemische Reaktionen im Mund...", icon: Target },
    { text: "BF45 AI bewertet das Tannin-Säure-Körper-Gleichgewicht...", icon: Gauge },
    { text: "BF45 AI optimiert den IRC-Score von 100...", icon: Target },
    { text: "BF45 AI finalisiert die kulinarischen Empfehlungen...", icon: Sparkles },
  ],
  jp: [
    { text: "BF45 AIが考えています...", icon: Sparkles },
    { text: "BF45 AIが分子レベルで料理を分析しています...", icon: Atom },
    { text: "BF45 AIが脂質、タンパク質、有機酸を特定しています...", icon: FlaskRound },
    { text: "BF45 AIが化学と芳香性でワインをペアリングしています...", icon: Wine },
    { text: "BF45 AIが口内での化学反応を計算しています...", icon: Target },
    { text: "BF45 AIがタンニン-酸度-ボディのバランスを評価しています...", icon: Gauge },
    { text: "BF45 AIが100点満点のIRCスコアを最適化しています...", icon: Target },
    { text: "BF45 AIが料理の推奨事項を最終化しています...", icon: Sparkles },
  ],
  nl: [
    { text: "BF45 AI denkt na...", icon: Sparkles },
    { text: "BF45 AI analyseert het gerecht op moleculair niveau...", icon: Atom },
    { text: "BF45 AI identificeert lipiden, eiwitten en organische zuren...", icon: FlaskRound },
    { text: "BF45 AI koppelt wijnen op chemie en aromatiek...", icon: Wine },
    { text: "BF45 AI berekent chemische reacties in de mond...", icon: Target },
    { text: "BF45 AI evalueert de tannine-zuurheid-lichaam balans...", icon: Gauge },
    { text: "BF45 AI optimaliseert de IRC-score van 100...", icon: Target },
    { text: "BF45 AI rondt de culinaire aanbevelingen af...", icon: Sparkles },
  ],
};

export function AILoadingState({ lang = "it" }: { lang?: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const msgs = MESSAGES[lang as Lang] || MESSAGES.it;

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % msgs.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [msgs.length]);

  const CurrentIcon = msgs[msgIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-5">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-bordeaux-800 flex items-center justify-center transition-all duration-300">
          <CurrentIcon className="w-8 h-8 text-gold-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-gold-400/30 animate-ping" />
        <div className="absolute -inset-2 rounded-full border border-gold-400/20 animate-ping" style={{ animationDuration: "2s" }} />
      </div>
      <p className="text-sm font-medium text-bordeaux-700 animate-fade-in text-center max-w-md" key={msgIndex}>
        {msgs[msgIndex].text}
      </p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gold-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="w-48 h-1 rounded-full bg-cream-200 overflow-hidden">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-bordeaux-600 to-gold-400 transition-all duration-1000"
          style={{ width: `${((msgIndex + 1) / msgs.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "BF45 AI sta pensando...",
  "BF45 AI sta analizzando il piatto...",
  "BF45 AI sta abbinando i vini...",
  "BF45 AI sta calcolando la chimica...",
  "BF45 AI sta valutando l'aromaticita...",
  "BF45 AI sta ottimizzando...",
];

const MESSAGES_EN = [
  "BF45 AI is thinking...",
  "BF45 AI is analyzing the dish...",
  "BF45 AI is pairing wines...",
  "BF45 AI is calculating chemistry...",
  "BF45 AI is evaluating aromatics...",
  "BF45 AI is optimizing...",
];

export function AILoadingState({ lang = "it" }: { lang?: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const msgs = lang === "it" ? MESSAGES : MESSAGES_EN;

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % msgs.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [msgs.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-bordeaux-800 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-gold-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-gold-400/30 animate-ping" />
      </div>
      <p className="text-sm font-medium text-bordeaux-700 animate-fade-in" key={msgIndex}>
        {msgs[msgIndex]}
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
    </div>
  );
}

import { Sparkles, FlaskConical } from "lucide-react";

interface EngineToggleProps {
  useAI: boolean;
  onChange: (useAI: boolean) => void;
  hasCode?: boolean;
}

export default function EngineToggle({ useAI, onChange, hasCode }: EngineToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${!useAI ? "bg-bordeaux-800 text-cream-50" : "bg-cream-200 text-bordeaux-600 hover:bg-cream-300"}`}
      >
        <FlaskConical className="w-3.5 h-3.5" /> Motore locale
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${useAI ? "bg-bordeaux-950 text-gold-400" : "bg-cream-200 text-bordeaux-600 hover:bg-cream-300"}`}
      >
        <Sparkles className="w-3.5 h-3.5" /> AI (Anthropic)
      </button>
      {useAI && !hasCode && (
        <span className="text-xs text-amber-600">Richiede codice AI</span>
      )}
    </div>
  );
}

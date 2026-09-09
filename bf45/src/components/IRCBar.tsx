interface IRCBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export default function IRCBar({ label, value, max, color }: IRCBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-bordeaux-700 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-bordeaux-900 w-12 text-right tabular-nums">
        {value}/{max}
      </span>
    </div>
  );
}

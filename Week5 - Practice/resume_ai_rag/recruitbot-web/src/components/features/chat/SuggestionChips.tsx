import { DEFAULT_SUGGESTIONS } from '@/lib/utils/constants';

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4">
      {DEFAULT_SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-xs px-3 py-1.5 rounded-full bg-bg-card border border-white/10 text-white/60 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

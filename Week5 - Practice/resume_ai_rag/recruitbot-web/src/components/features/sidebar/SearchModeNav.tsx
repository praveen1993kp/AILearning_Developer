import { useSearchStore } from '@/lib/stores/search.store';
import { SearchMode } from '@/types/search.types';
import { SEARCH_MODES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export function SearchModeNav() {
  const { searchType, setSearchType } = useSearchStore();

  return (
    <div className="flex flex-col gap-1">
      {SEARCH_MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setSearchType(mode.value as SearchMode)}
          className={cn(
            'flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-all',
            searchType === mode.value
              ? 'bg-primary/15 border border-primary/30 text-white'
              : 'hover:bg-white/5 text-white/60 hover:text-white/90 border border-transparent'
          )}
        >
          <span className="text-sm font-medium">{mode.label}</span>
          <span className="text-xs text-white/40">{mode.description}</span>
        </button>
      ))}
    </div>
  );
}

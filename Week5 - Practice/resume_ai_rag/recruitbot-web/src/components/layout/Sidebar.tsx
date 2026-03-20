import { BrandAvatar } from '@/components/common/BrandAvatar';
import { StatusDot } from '@/components/common/StatusDot';
import { SearchModeNav } from '@/components/features/sidebar/SearchModeNav';
import { HybridWeightPanel } from '@/components/features/sidebar/HybridWeightPanel';
import { ResultsLimitSelect } from '@/components/features/sidebar/ResultsLimitSelect';
import { ClearChatButton } from '@/components/features/sidebar/ClearChatButton';
import { useSearchStore } from '@/lib/stores/search.store';

export function Sidebar() {
  const searchType = useSearchStore((s) => s.searchType);

  return (
    <aside className="flex flex-col h-full w-64 bg-bg-surface border-r border-white/5 p-4 gap-6 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center justify-between">
        <BrandAvatar />
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <StatusDot />
          <span>Online</span>
        </div>
      </div>

      {/* Search mode */}
      <section>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Search Mode</p>
        <SearchModeNav />
      </section>

      {/* Hybrid weights */}
      {searchType === 'hybrid' && (
        <section>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Weights</p>
          <HybridWeightPanel />
        </section>
      )}

      {/* Result count */}
      <section>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Results Limit</p>
        <ResultsLimitSelect />
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clear */}
      <ClearChatButton />
    </aside>
  );
}

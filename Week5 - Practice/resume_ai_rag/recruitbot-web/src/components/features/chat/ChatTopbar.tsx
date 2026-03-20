import { Menu } from 'lucide-react';
import { BrandAvatar } from '@/components/common/BrandAvatar';
import { useUIStore } from '@/lib/stores/ui.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { SEARCH_MODES } from '@/lib/utils/constants';
import { Button } from '@/components/ui/button';

export function ChatTopbar() {
  const { toggleSidebar } = useUIStore();
  const searchType = useSearchStore((s) => s.searchType);
  const modeLabel = SEARCH_MODES.find((m) => m.value === searchType)?.label ?? searchType;

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-surface/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:flex hidden">
          <Menu size={18} />
        </Button>
        <BrandAvatar />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40">Mode:</span>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{modeLabel}</span>
      </div>
    </header>
  );
}

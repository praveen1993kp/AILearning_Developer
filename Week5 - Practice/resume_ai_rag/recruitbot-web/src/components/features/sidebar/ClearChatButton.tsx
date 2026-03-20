import { Trash2 } from 'lucide-react';
import { useChatStore } from '@/lib/stores/chat.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { Button } from '@/components/ui/button';

export function ClearChatButton() {
  const clearMessages = useChatStore((s) => s.clearMessages);
  const clearResults = useSearchStore((s) => s.clearResults);

  const handleClear = () => {
    clearMessages();
    clearResults();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClear} className="w-full justify-start gap-2 text-white/50 hover:text-red-400">
      <Trash2 size={14} />
      Clear conversation
    </Button>
  );
}

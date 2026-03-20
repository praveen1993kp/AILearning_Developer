import { KeyboardEvent, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface ChatInputBarProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function ChatInputBar({ onSubmit, isLoading }: ChatInputBarProps) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const q = value.trim();
    if (!q || isLoading) return;
    setValue('');
    onSubmit(q);
    setTimeout(() => ref.current?.focus(), 50);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-shrink-0 px-4 py-4 border-t border-white/5 bg-bg-surface/80 backdrop-blur-sm">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search for candidates… (Enter to send, Shift+Enter for newline)"
          rows={1}
          className={cn('flex-1 min-h-[44px] max-h-32 overflow-y-auto', isLoading && 'opacity-50')}
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="flex-shrink-0 h-[44px] w-[44px]"
        >
          <Send size={16} />
        </Button>
      </div>
      <p className="text-center text-xs text-white/20 mt-2">Enter to search • Shift+Enter for newline</p>
    </div>
  );
}

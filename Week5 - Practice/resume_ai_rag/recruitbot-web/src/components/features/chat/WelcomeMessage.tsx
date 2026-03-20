import { WELCOME_MESSAGE } from '@/lib/utils/constants';
import { Bot } from 'lucide-react';

export function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
        <Bot size={28} className="text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Welcome to RecruitBot</h2>
        <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
          {WELCOME_MESSAGE.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      </div>
    </div>
  );
}

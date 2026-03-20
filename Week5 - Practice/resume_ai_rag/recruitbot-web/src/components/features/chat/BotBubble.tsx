import { motion } from 'framer-motion';
import { LoadingDots } from '@/components/common/LoadingDots';
import { ResultsList } from '@/components/features/results/ResultsList';
import { SearchResult } from '@/types/search.types';

interface BotBubbleProps {
  content: string;
  results?: SearchResult[];
  isLoading?: boolean;
  timestamp: Date;
}

export function BotBubble({ content, results, isLoading, timestamp }: BotBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[90%] w-full">
        {/* Avatar */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">R</div>
          <span className="text-xs text-white/30">RecruitBot</span>
        </div>

        {/* Bubble */}
        <div className="bg-bg-card border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
          {isLoading ? (
            <LoadingDots />
          ) : (
            <p className="text-sm text-white/80 whitespace-pre-wrap">{content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
          )}
        </div>

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-3">
            <ResultsList results={results} />
          </div>
        )}

        <p className="text-xs text-white/20 mt-1 pl-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { User, Briefcase, ExternalLink } from 'lucide-react';
import { SearchResult } from '@/types/search.types';
import { useSearchStore } from '@/lib/stores/search.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { RankBadge } from './RankBadge';
import { ScorePill } from './ScorePill';
import { ResultSummary } from './ResultSummary';
import { cn } from '@/lib/utils/cn';

interface ResultCardProps {
  result: SearchResult;
  rank: number;
  query?: string;
}

export function ResultCard({ result, rank, query }: ResultCardProps) {
  const searchType = useSearchStore((s) => s.searchType);
  const openCandidateModal = useUIStore((s) => s.openCandidateModal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className={cn(
        'group relative rounded-xl bg-bg-card border border-white/5 hover:border-primary/30 p-4 transition-all cursor-pointer',
        'hover:shadow-lg hover:shadow-primary/5'
      )}
      onClick={() => openCandidateModal(result.candidateId ?? '')}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <RankBadge rank={rank} />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-primary/70" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm text-white/90 truncate">
              {result.name || `Candidate ${result.candidateId.slice(-6)}`}
            </h4>
            <ScorePill score={result.score} mode={searchType} />
          </div>

          {result.email && (
            <p className="text-xs text-white/35 mt-0.5 truncate">{result.email}</p>
          )}

          {typeof result.experienceYears === 'number' && (
            <div className="flex items-center gap-1 mt-1">
              <Briefcase size={11} className="text-white/30" />
              <span className="text-xs text-white/40">{result.experienceYears}y exp</span>
            </div>
          )}

          <div className="mt-2">
            <ResultSummary snippet={result.snippet || result.content || ''} query={query} />
          </div>
        </div>

        {/* Open icon */}
        <ExternalLink size={14} className="text-white/20 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-0.5" />
      </div>
    </motion.div>
  );
}

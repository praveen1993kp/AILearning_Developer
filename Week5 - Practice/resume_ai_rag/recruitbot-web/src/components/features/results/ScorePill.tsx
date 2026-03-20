import { SearchMode } from '@/types/search.types';
import { SCORE_BG_COLORS } from '@/lib/utils/constants';
import { formatScore } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface ScorePillProps {
  score: number;
  mode?: SearchMode;
  className?: string;
}

export function ScorePill({ score, mode = 'hybrid', className }: ScorePillProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', SCORE_BG_COLORS[mode], className)}>
      {formatScore(score)}
    </span>
  );
}

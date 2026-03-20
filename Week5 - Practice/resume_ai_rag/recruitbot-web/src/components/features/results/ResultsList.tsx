import { SearchResult } from '@/types/search.types';
import { ResultCard } from './ResultCard';
import { useSearchStore } from '@/lib/stores/search.store';

interface ResultsListProps {
  results: SearchResult[];
}

export function ResultsList({ results }: ResultsListProps) {
  const lastQuery = useSearchStore((s) => s.lastQuery);

  if (!results.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {results.map((r, i) => (
        <ResultCard key={r.candidateId} result={r} rank={i + 1} query={lastQuery} />
      ))}
    </div>
  );
}

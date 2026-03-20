import { useSearchStore } from '@/lib/stores/search.store';
import { Select } from '@/components/ui/select';
import { TOP_K_OPTIONS } from '@/lib/utils/constants';

export function ResultsLimitSelect() {
  const { topK, setTopK } = useSearchStore();

  return (
    <Select value={topK} onChange={(e) => setTopK(Number(e.target.value))}>
      {TOP_K_OPTIONS.map((n) => (
        <option key={n} value={n}>{n} results</option>
      ))}
    </Select>
  );
}

import { useCallback } from 'react';
import { useSearchStore } from '@/lib/stores/search.store';

export function useHybridWeights() {
  const { bm25Weight, vectorWeight, setBm25Weight, setVectorWeight } = useSearchStore();

  const setWeights = useCallback((bm25: number) => {
    const clamped = Math.max(0, Math.min(1, bm25));
    setBm25Weight(parseFloat(clamped.toFixed(2)));
    setVectorWeight(parseFloat((1 - clamped).toFixed(2)));
  }, [setBm25Weight, setVectorWeight]);

  return { bm25Weight, vectorWeight, setWeights };
}

import { useHybridWeights } from '@/hooks/use-hybrid-weights';
import { Slider } from '@/components/ui/slider';

export function HybridWeightPanel() {
  const { bm25Weight, vectorWeight, setWeights } = useHybridWeights();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-xs text-white/50">
        <span>Keyword (BM25)</span>
        <span>{Math.round(bm25Weight * 100)}%</span>
      </div>
      <Slider
        min={0}
        max={1}
        step={0.05}
        value={bm25Weight}
        onChange={(e) => setWeights(parseFloat(e.target.value))}
      />
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-score-bm25 inline-block" />
          <span className="text-white/40">BM25 {Math.round(bm25Weight * 100)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-score-vector inline-block" />
          <span className="text-white/40">Vector {Math.round(vectorWeight * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

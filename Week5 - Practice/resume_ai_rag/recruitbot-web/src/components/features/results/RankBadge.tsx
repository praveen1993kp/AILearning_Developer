interface RankBadgeProps { rank: number }

export function RankBadge({ rank }: RankBadgeProps) {
  const colors =
    rank === 1 ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' :
    rank === 2 ? 'bg-zinc-300/20 text-zinc-300 border-zinc-300/30' :
    rank === 3 ? 'bg-orange-400/20 text-orange-300 border-orange-400/30' :
    'bg-white/5 text-white/40 border-white/10';

  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold ${colors}`}>
      {rank}
    </span>
  );
}

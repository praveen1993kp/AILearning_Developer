import { cn } from '@/lib/utils/cn';

type StatusDotProps = { active?: boolean; className?: string };

export function StatusDot({ active = true, className }: StatusDotProps) {
  return (
    <span className={cn('inline-block w-2 h-2 rounded-full', active ? 'bg-green-400 animate-pulse' : 'bg-white/30', className)} />
  );
}

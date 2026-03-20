import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary/20 text-primary',
        secondary: 'bg-white/10 text-white/70',
        vector: 'bg-score-vector/15 text-score-vector',
        bm25: 'bg-score-bm25/15 text-score-bm25',
        hybrid: 'bg-score-hybrid/15 text-score-hybrid',
        accent: 'bg-accent/15 text-accent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

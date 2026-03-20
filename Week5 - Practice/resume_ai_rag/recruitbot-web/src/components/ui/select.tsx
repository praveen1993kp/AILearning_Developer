import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-lg bg-bg-card border border-white/10 text-white/90 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
Select.displayName = 'Select';

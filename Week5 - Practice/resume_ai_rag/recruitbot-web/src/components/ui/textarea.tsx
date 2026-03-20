import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full resize-none rounded-xl bg-bg-card border border-white/10 text-white placeholder:text-white/30 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

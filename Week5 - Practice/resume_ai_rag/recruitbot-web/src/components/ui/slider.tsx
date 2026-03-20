import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Slider = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={cn(
        'w-full h-1.5 rounded-full accent-primary bg-white/10 cursor-pointer focus:outline-none',
        className
      )}
      {...props}
    />
  )
);
Slider.displayName = 'Slider';

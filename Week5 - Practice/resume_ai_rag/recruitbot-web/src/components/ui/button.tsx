import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 active:scale-95',
        secondary: 'bg-bg-surface text-white/80 hover:bg-bg-card border border-white/10',
        ghost: 'hover:bg-white/5 text-white/70 hover:text-white',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-white/20 text-white/80 hover:bg-white/5',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={clsx(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';

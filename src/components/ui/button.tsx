import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-gradient text-[#1C0900] shadow-brand hover:shadow-brand-hover',
        ghost:
          'border-[1.5px] border-line bg-surface text-ink hover:border-ink hover:bg-surface-muted',
        ghostDark:
          'border border-line-dark bg-white/[0.06] text-white backdrop-blur hover:border-white/40 hover:bg-white/10',
      },
      size: {
        md: 'px-6 py-3.5 text-[15.5px]',
        sm: 'px-[18px] py-2.5 text-sm',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

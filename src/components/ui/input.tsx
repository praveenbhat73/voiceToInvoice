import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-control border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/[0.12]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

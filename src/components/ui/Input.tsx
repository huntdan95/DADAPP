import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 px-3 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-xs uppercase tracking-wider text-muted', className)}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label>{label}</Label>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-11 px-3 rounded-xl bg-surface-2 border border-border text-text focus:outline-none focus:border-accent/60',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

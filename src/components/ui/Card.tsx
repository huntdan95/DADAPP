import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-surface border border-border shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-4 pt-4 pb-2 flex flex-col gap-1', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardSubtitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted', className)} {...props} />
));
CardSubtitle.displayName = 'CardSubtitle';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-4 pb-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardSection = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-4 py-3 border-t border-border first:border-t-0', className)}
    {...props}
  >
    {label && (
      <div className="text-xs uppercase tracking-wider text-muted mb-2">
        {label}
      </div>
    )}
    {children}
  </div>
));
CardSection.displayName = 'CardSection';

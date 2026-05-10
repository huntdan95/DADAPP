import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Native-feeling bottom sheet. No radix dependency — animates with CSS
 * transitions. Backdrop click + escape close. Body scroll-lock while open.
 *
 * Renders through a Portal to document.body so it always overlays the
 * page regardless of which stacking context (e.g. the Leaflet map) the
 * caller renders us inside.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const tree = (
    <div
      className={cn(
        'fixed inset-0 z-[9999] transition-opacity',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface border-t border-border safe-bottom',
          'transition-transform duration-200',
          open ? 'translate-y-0' : 'translate-y-full',
          className
        )}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2 sticky top-0 bg-surface z-10">
          <div className="mx-auto h-1 w-10 rounded-full bg-border absolute left-1/2 -translate-x-1/2 -mt-1" />
          {title ? (
            <h2 className="text-base font-semibold pt-2">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-surface-2 text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}

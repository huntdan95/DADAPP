import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

export function BottomNav<TKey extends string>({
  tabs,
  current,
  onChange,
}: {
  tabs: ReadonlyArray<NavTab & { key: TKey }>;
  current: TKey;
  onChange: (k: TKey) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-bg/95 backdrop-blur border-t border-border safe-bottom"
      role="navigation"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-3">
        {tabs.map((t) => {
          const active = t.key === current;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2.5 transition',
                active ? 'text-accent' : 'text-muted hover:text-text'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

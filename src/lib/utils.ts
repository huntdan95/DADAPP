import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function celsiusToF(c: number | null | undefined): number | null {
  if (c == null || Number.isNaN(c)) return null;
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function formatTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date);
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const minutesAgo = Math.round((now - then) / 60000);
  if (minutesAgo < 1) return 'just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const daysAgo = Math.round(hoursAgo / 24);
  return `${daysAgo}d ago`;
}

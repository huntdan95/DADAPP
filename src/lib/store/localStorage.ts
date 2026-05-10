import type { Location } from '../providers/types';
import { seedLocations } from '@/seedLocations';
import type { LocationStore } from './types';

const STORAGE_KEY = 'dad-fishing.locations.v1';
const CHANGE_EVENT = 'dad-fishing:locations-changed';

function read(): Location[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // First run — seed with the four primary spots.
    write(seedLocations);
    return seedLocations;
  }
  try {
    return JSON.parse(raw) as Location[];
  } catch {
    return [];
  }
}

function write(locs: Location[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locs));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export const localStorageLocationStore: LocationStore = {
  async list() {
    return read();
  },
  async get(id) {
    return read().find((l) => l.id === id) ?? null;
  },
  async upsert(loc) {
    const all = read();
    const idx = all.findIndex((l) => l.id === loc.id);
    if (idx >= 0) all[idx] = loc;
    else all.push(loc);
    write(all);
  },
  async remove(id) {
    write(read().filter((l) => l.id !== id));
  },
  subscribe(cb) {
    const handler = () => cb(read());
    // Same-tab mutations fire CHANGE_EVENT; cross-tab mutations fire 'storage'.
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    queueMicrotask(handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};

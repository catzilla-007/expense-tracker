import { writable } from 'svelte/store';
import type { SheetSettings } from '#lib/api/broadcast.ts';

export const sheetSettings = writable<SheetSettings>({
  url: '',
  count: 0,
  syncing: false,
  error: ''
});
export const settingsLoaded = writable(false);

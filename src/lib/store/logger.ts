import { writable } from 'svelte/store';

export const logger = writable<Array<string>>(['logs']);

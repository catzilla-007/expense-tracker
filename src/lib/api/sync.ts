import { debug } from '$lib/debugger';

export function initializeCacheSync() {
  debug('trigger expense cache');
  const bc = new BroadcastChannel('cache-expense');
  bc.postMessage('sync');
}

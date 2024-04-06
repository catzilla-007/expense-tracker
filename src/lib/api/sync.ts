import { logger } from '$lib/store/logger';

export function registerSync(): Promise<boolean> {
  return new Promise((resolve) => {
    navigator.serviceWorker.ready.then((registration: any) => {
      if (registration.sync) {
        registration.sync.register('send-expense');
        resolve(true);
      } else {
        logger.update((value) => {
          return [...value, 'sync not available'];
        });
        resolve(false);
      }
    });
  });
}

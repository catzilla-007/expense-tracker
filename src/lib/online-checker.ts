import { isOnline } from './store/is-online';
import { requestSyncExpense } from './api/broadcast';

export function initializeOnlineChecker() {
  isOnline.set(window.navigator.onLine);

  window.addEventListener('online', () => {
    isOnline.set(true);
    requestSyncExpense();
  });

  window.addEventListener('offline', () => {
    isOnline.set(false);
  });
}

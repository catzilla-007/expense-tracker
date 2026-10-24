import { isOnline } from './store/is-online';
import { requestSyncExpense } from './api/broadcast';

export function initializeOnlineChecker() {
  isOnline.set(window.navigator.onLine);

  const handleOnline = () => {
    isOnline.set(true);
    requestSyncExpense();
  };

  const handleOffline = () => {
    isOnline.set(false);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

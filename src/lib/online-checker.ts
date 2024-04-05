import { isOnline } from './store/is-online';

export function initializeOnlineChecker() {
  isOnline.set(window.navigator.onLine);

  window.addEventListener('online', () => {
    isOnline.set(true);
  });

  window.addEventListener('offline', () => {
    isOnline.set(false);
  });
}

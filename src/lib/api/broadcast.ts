import { sheetSettings } from '#lib/store/sheet-settings.ts';

export interface SheetSettings {
  url: string;
  count: number;
  syncing: boolean;
  error: string;
}

export async function workerRequest(
  type: string,
  payload: Record<string, unknown> = {}
): Promise<SheetSettings> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('This browser does not support offline storage through service workers.');
  }
  let readyTimeout: ReturnType<typeof setTimeout> | undefined;
  const registration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => {
      readyTimeout = setTimeout(() => {
        reject(new Error('Offline storage is not ready. Reload the app and try again.'));
      }, 10000);
    })
  ]).finally(() => clearTimeout(readyTimeout));
  const worker = registration.active;
  if (!worker) throw new Error('The app is not ready. Reload and try again.');
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    // Loading settings must not leave the dialog waiting on an older worker forever.
    const replyTimeout =
      type === 'get-settings'
        ? setTimeout(() => {
            channel.port1.close();
            reject(
              new Error(
                'Settings could not be loaded. Close all app tabs and reopen the app to update it.'
              )
            );
          }, 10000)
        : undefined;
    channel.port1.onmessage = ({ data }) => {
      clearTimeout(replyTimeout);
      channel.port1.close();
      if (data.ok) {
        sheetSettings.set(data.result);
        resolve(data.result);
      } else reject(new Error(data.error));
    };
    try {
      worker.postMessage({ type, ...payload }, [channel.port2]);
    } catch (error) {
      clearTimeout(replyTimeout);
      channel.port1.close();
      channel.port2.close();
      reject(error);
    }
  });
}

export function requestSyncExpense() {
  void workerRequest('sync-expense').catch((error: Error) => {
    sheetSettings.update((state) => ({ ...state, error: error.message }));
  });
}

export function requestExpenseCount() {
  void workerRequest('get-expense-count').catch((error: Error) => {
    sheetSettings.update((state) => ({ ...state, error: error.message }));
  });
}

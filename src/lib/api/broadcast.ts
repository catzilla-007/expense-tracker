import { debug } from '$lib/debugger';

export const swBroadcast = new BroadcastChannel('sw-connect');

export function requestSyncExpense() {
  debug('trigger sync-expense');
  swBroadcast.postMessage('sync-expense');
}

export function initializeDbConnect() {
  debug('trigger db-connect');
  swBroadcast.postMessage('db-connect');
}

export function requestExpenseCount() {
  debug('trigger get-expense-count');
  swBroadcast.postMessage('get-expense-count');
}

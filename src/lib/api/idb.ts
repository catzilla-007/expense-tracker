import { debug } from '$lib/debugger';

const DB = 'expenseDB';
const STORE = 'expense';
let db;

export async function getExpenseCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    function getCount(db: IDBDatabase) {
      const transaction = db.transaction([STORE], 'readonly');
      const objectStore = transaction.objectStore(STORE);

      const countRequest = objectStore.count();
      countRequest.onsuccess = () => {
        resolve(countRequest.result);
      };

      countRequest.onerror = () => {
        reject();
      };
    }

    const request = indexedDB.open(DB, 1);
    request.onsuccess = (event: any) => {
      getCount(event.target.result);
    };
  });
}

export async function initializeDb() {
  function initialize(resolve: any, reject: any) {
    const request = window.indexedDB.open(DB, 1);

    request.onerror = (event) => {
      debug('cannot initialize db');
      debug(JSON.stringify(event.target));
      reject();
    };

    request.onsuccess = () => {
      debug('db initialized');
      db = request.result;

      const bc = new BroadcastChannel('db-connect');
      bc.postMessage('connect');
      resolve();
    };

    request.onupgradeneeded = (event: any) => {
      // debug('upgrading db');
      console.log('upgrading db');
      db = event.target.result;
      db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
  }

  return new Promise(initialize);
}

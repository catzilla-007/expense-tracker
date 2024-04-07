/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyIexJBnFFBoJD1EZHGpFS1BunDg2NZJrHDY3LovTcstwk4oahYMziwMzoO6rVf18fwsw/exec';

// indexeddb
const DB = 'expenseDB';
const STORE = 'expense';
let db;
// const request = self.indexedDB.open(DB, 1);

// request.onerror = (event) => {
//   debug('cannot initialize db');
//   debug(JSON.stringify(event.target));
// };

// request.onsuccess = () => {
//   debug('db initialized');
//   db = request.result;
// };

// request.onupgradeneeded = () => {
//   debug('upgrading db');
//   db = request.result;
//   db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
// };

// broadcast channels
const swLogger = new BroadcastChannel('sw-logger');
const cacheExpense = new BroadcastChannel('cache-expense');
const expenseCount = new BroadcastChannel('expense-count');
const dbConnect = new BroadcastChannel('db-connect');

cacheExpense.onmessage = () => {
  debug('cache-expense triggered');
  sendExpenseFromDbtoSheet();
  cacheExpense.close();
};

dbConnect.onmessage = () => {
  debug('db-connect triggered');
  if (db) {
    debug('db already connected');
    return;
  }
  const request = self.indexedDB.open(DB, 1);

  request.onerror = (event) => {
    debug('cannot initialize db');
    debug(JSON.stringify(event.target));
  };

  request.onsuccess = () => {
    debug('db initialized');
    db = request.result;
  };
};

// functions

function addExpenseToDb(name, price, description, date) {
  try {
    const transaction = db.transaction([STORE], 'readwrite');

    transaction.oncomplete = () => {
      debug('addExpenseToDb ok');
      expenseCount.postMessage('trigger');
    };

    transaction.onerror = (event) => {
      debug('addExpenseToDb nok');
      debug(JSON.stringify(event.target));
    };

    const objectStore = transaction.objectStore(STORE);

    const request = objectStore.add({ name, price, description, date });

    request.onsuccess = () => {
      debug('add db ok');
    };

    request.onerror = (event) => {
      debug('add db nok');
      debug(JSON.stringify(event.target));
    };
  } catch (error) {
    debug(`addExpenseToDB nok: ${error.message}`);
  }
}

async function addExpenseToSheet(name, price, description, date) {
  debug(`trying to send ${name}:${price} to sheet`);
  const params = new URLSearchParams({
    name,
    price: `${price}`,
    description,
    date
  });

  return await fetch(SHEET_URL + '?' + params, {
    method: 'GET'
  });
}

async function sendExpenseFromDbtoSheet() {
  try {
    const transaction = db.transaction([STORE], 'readonly');

    transaction.oncomplete = () => {
      debug('sendExpenseFromDbtoSheet ok');
    };

    transaction.onerror = (event) => {
      debug('sendExpenseFromDbtoSheet nok');
      debug(JSON.stringify(event));
    };

    const objectStore = transaction.objectStore(STORE);

    objectStore.getAll().onsuccess = (event) => {
      event.target.result.forEach(async ({ id, name, price, description, date }) => {
        try {
          await addExpenseToSheet(name, price, description, date);
          await removeExpenseFromDb(id);
          debug(`db->sheet ${name}:${price} ok`);
          expenseCount.postMessage('trigger');
        } catch (error) {
          debug(error.message);
          console.error(error);
        }
      });
    };
  } catch (error) {
    debug(`sendExpenseFromDbtoSheet nok: ${error.message}`);
  }
}

async function removeExpenseFromDb(id) {
  const transaction = db.transaction([STORE], 'readwrite');

  transaction.oncomplete = (event) => {
    debug(`removeExpenseFromDb ${id} ok`, event);
  };

  transaction.onerror = (event) => {
    debug(`removeExpenseFromDb ${id} nok`, event);
  };

  transaction.objectStore('expense').delete(id);
}

function debug(message) {
  console.log(`sw: ${message}`);
  swLogger.postMessage(`sw: ${message}`);
}

// event handlers

self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }
  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  // only accept GET requests
  if (event.request.method !== 'GET') return;

  // ignore chrome dev tools
  if (event.request.url.startsWith('chrome-extension')) return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        return response;
      }
    }

    try {
      const response = await fetch(event.request);

      if (!(response instanceof Response)) {
        throw new Error('invalid response from fetch');
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }

      throw err;
    }
  }

  event.respondWith(respond());
});

self.addEventListener('message', (event) => {
  const { name, date, price, description } = event.data;

  async function saveExpense() {
    try {
      await addExpenseToSheet(name, price, description, date);
      debug(`expense ${name}:${price} -> sheet ok`);
    } catch (err) {
      debug(`no connection, saving ${name}:${price} to db`);
      addExpenseToDb(name, price, description, date);
    }
  }

  saveExpense();
});

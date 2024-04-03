/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyIexJBnFFBoJD1EZHGpFS1BunDg2NZJrHDY3LovTcstwk4oahYMziwMzoO6rVf18fwsw/exec';

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
  initializeDb();
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

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      // if we're offline, fetch can return a value that is not a Response
      // instead of throwing - and we can't pass this non-Response to respondWith
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
    } catch (err) {
      addExpenseToDb(name, price, description, date);
    }
  }

  saveExpense();
});

self.addEventListener('sync', (event) => {
  console.log('sw: sync', event);
  if (event.tag === 'send-expense') {
    console.log('sw: send-expense triggered');
    event.waitUntil(sendExpenseFromDbtoSheet());
  }
});

let db;

function initializeDb() {
  const request = indexedDB.open('expenseDB', 1);

  request.onerror = (event) => {
    console.log('cannot initializeDB');
    console.log(event.target);
  };

  request.onsuccess = (event) => {
    console.log('initialize db successful');
    db = event.target.result;
  };

  request.onupgradeneeded = (event) => {
    console.log('upgrading db');
    db = event.target.result;
    db.createObjectStore('expense', { keyPath: 'id', autoIncrement: true });
  };
}

function addExpenseToDb(name, price, description, date) {
  const transaction = db.transaction(['expense'], 'readwrite');

  transaction.oncomplete = (event) => {
    console.log('transaction complete', event);
  };

  transaction.onerror = (event) => {
    console.log('transaction failed', event);
  };

  const objectStore = transaction.objectStore('expense');

  const request = objectStore.add({ name, price, description, date });

  request.onsuccess = (event) => {
    console.log('request sucess', event);
  };

  request.onerror = (event) => {
    console.log('request failed', event);
  };
}

async function addExpenseToSheet(name, price, description, date) {
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
  const transaction = db.transaction(['expense'], 'readonly');
  const rowsToRemove = [];

  transaction.oncomplete = (event) => {
    console.log('transaction complete', event);
    console.log('rowsToRemove', rowsToRemove);

    rowsToRemove.forEach(async (id) => {
      console.log(`removing id from idb: ${id}`);
    });
  };

  transaction.onerror = (event) => {
    console.log('transaction failed', event);
  };

  const objectStore = transaction.objectStore('expense');

  objectStore.getAll().onsuccess = (event) => {
    console.log('results', event.target.result);

    event.target.result.forEach(async ({ id, name, price, description, date }) => {
      try {
        await addExpenseToSheet(name, price, description, date);
        await removeExpenseFromDb(id);
      } catch (error) {
        console.error(error);
      }
    });
  };
}

async function removeExpenseFromDb(id) {
  const transaction = db.transaction(['expense'], 'readwrite');

  transaction.oncomplete = (event) => {
    console.log('transaction complete', event);
  };

  transaction.onerror = (event) => {
    console.log('transaction failed', event);
  };

  transaction.objectStore('expense').delete(id);
}

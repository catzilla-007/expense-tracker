import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { normalizeSheetUrl } from '../lib/sheet-url.js';

const CACHE = `cache-${version}`;
const ASSETS = [...immutable, ...assets, ...prerendered].map(
  ({ path }) => new URL(path, self.registration.scope).pathname
);
const STORE = 'expense';
const SHEET_STORE = 'sheet';
const CONFIG_KEY = 'apps-script-url';
const expenseCount = new BroadcastChannel('expense-count');
const settingsChannel = new BroadcastChannel('sheet-settings');
let database;
let operations = Promise.resolve();
let syncing = false;
let syncAgain = false;
let syncError = '';

function connectDatabase() {
  if (!database) {
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open('expenseDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        request.result.createObjectStore(SHEET_STORE);
      };
      request.onsuccess = () => {
        request.result.onversionchange = () => {
          request.result.close();
          database = undefined;
        };
        resolve(request.result);
      };
      request.onerror = () => {
        database = undefined;
        reject(request.error);
      };
    });
  }
  return database;
}

async function accessStore(store, mode, action) {
  const db = await connectDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = tx.onabort = () => reject(tx.error || new Error('Local storage failed.'));
  });
}

function serialize(action) {
  const result = operations.then(action);
  operations = result.catch(() => {});
  return result;
}

async function getSettings() {
  const url = (await accessStore(SHEET_STORE, 'readonly', (store) => store.get(CONFIG_KEY))) || '';
  const count = await accessStore(STORE, 'readonly', (store) => store.count());
  return { url, count, syncing, error: syncError };
}

async function publish() {
  const state = await getSettings();
  expenseCount.postMessage(state.count);
  settingsChannel.postMessage(state);
  return state;
}

async function saveSettings(value) {
  const url = normalizeSheetUrl(value);
  return serialize(async () => {
    const current = await getSettings();
    if (url !== current.url && (syncing || (current.url && current.count > 0))) {
      throw new Error('Sync pending expenses before changing or clearing the connection.');
    }
    await accessStore(SHEET_STORE, 'readwrite', (store) => store.put(url, CONFIG_KEY));
    syncError = '';
    return publish();
  });
}

async function syncExpenses() {
  if (syncing) {
    syncAgain = true;
    return;
  }
  syncing = true;
  syncAgain = false;
  syncError = '';
  try {
    await publish();
    const { url } = await serialize(getSettings);
    if (!url) return;
    // Recording remains available while network requests are in flight.
    while (true) {
      const records = await accessStore(STORE, 'readonly', (store) => store.getAll());
      if (!records.length) break;
      for (const { id, name, price, description, date } of records) {
        const params = new URLSearchParams({
          name,
          price: `${price}`,
          description: description || '',
          date
        });
        const response = await fetch(`${url}?${params}`, {
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error(`Google Sheets returned HTTP ${response.status}.`);
        await accessStore(STORE, 'readwrite', (store) => store.delete(id));
        await publish();
      }
    }
  } catch (error) {
    const detail =
      error instanceof TypeError
        ? 'The request could not be completed. Check your connection and deploy Apps Script as a web app running as you with access set to Anyone. Return a ContentService response and use the updated /exec URL.'
        : error.message;
    syncError = `Sync failed. Expenses remain on this device. ${detail}`;
  } finally {
    syncing = false;
    const state = await publish();
    if (syncAgain && !syncError && state.url) await syncExpenses();
  }
}

self.addEventListener('message', (event) => {
  const port = event.ports[0];
  async function handle() {
    try {
      let result;
      let shouldSync = false;
      switch (event.data.type) {
        case 'get-settings':
        case 'get-expense-count':
          result = await serialize(publish);
          break;
        case 'save-settings':
          result = await saveSettings(event.data.url);
          shouldSync = Boolean(result.url);
          break;
        case 'sync-expense':
          await syncExpenses();
          result = await getSettings();
          break;
        case 'add-expense':
        case undefined: // Accept messages from an older open app during an update.
          result = await serialize(async () => {
            const expense = event.data.expense || event.data;
            const { name, price, description, date } = expense;
            if (!name || !Number.isFinite(price) || !date) throw new Error('Invalid expense.');
            await accessStore(STORE, 'readwrite', (store) =>
              store.add({ name, price, description, date })
            );
            return publish();
          });
          shouldSync = true;
          break;
        default:
          throw new Error('Unknown service worker request.');
      }
      port?.postMessage({ ok: true, result });
      if (shouldSync) await syncExpenses();
    } catch (error) {
      port?.postMessage({ ok: false, error: error.message });
    } finally {
      port?.close();
    }
  }
  event.waitUntil(handle());
});

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
  if (new URL(event.request.url).origin !== self.location.origin) return;

  // ignore chrome dev tools
  if (event.request.url.startsWith('chrome-extension')) return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // Build assets and prerendered routes can be served from the cache
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
        await cache.put(event.request, response.clone());
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

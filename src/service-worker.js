/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [...build, ...files];

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
			// save expense details to indexDB when fetch failed
			if (url.host === 'script.google.com') {
				const name = url.searchParams.get('name');
				const price = url.searchParams.get('price');
				const description = url.searchParams.get('description');
				const date = url.searchParams.get('date');

				addExpense(name, price, description, date);
				return new Response({ body: { status: 'saved to idb' } });
			}

			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

self.addEventListener('message', (event) => {
	console.log(`The client sent me a message: ${event.data}`);
});

let db;

export function initializeDb() {
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
		db.createObjectStore('expense', { autoIncrement: true });
	};
}

export function addExpense(name, price, description, date) {
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

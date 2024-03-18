let db: IDBDatabase;

export function getDB(): IDBDatabase | false {
	if (!db) {
		return false;
	}
	return db;
}

export function initializeDb() {
	const request: IDBOpenDBRequest = window.indexedDB.open('expenseDB', 1);

	request.onerror = (event: any) => {
		// Do something with request.errorCode!
		console.log('something wrong happened');
		console.log(event.target);
	};

	request.onsuccess = (event: any) => {
		console.log('onsuccess');
		db = event.target.result;
	};

	request.onupgradeneeded = (event: any) => {
		console.log('onupgradeneeded');
		db = event.target.result;
		db.createObjectStore('expense', { autoIncrement: true });
	};
}

export function addExpense(): void {
	const transaction: IDBTransaction = db.transaction(['expense'], 'readwrite');

	transaction.oncomplete = (event: any) => {
		console.log('transaction complete', event);
	};

	transaction.onerror = (event: any) => {
		console.log('transaction error', event);
	};

	const objectStore = transaction.objectStore('expense');

	const request = objectStore.add({ name: 'breakfast', price: 12, description: 'food' });

	request.onsuccess = (event: any) => {
		console.log('transaction ok', event);
	};

	request.onerror = (event: any) => {
		console.log('transaction failed', event);
	};
}

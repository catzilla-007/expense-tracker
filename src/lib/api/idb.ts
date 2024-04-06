export async function getExpenseCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    function getCount(db: IDBDatabase) {
      const transaction = db.transaction(['expense'], 'readonly');
      const objectStore = transaction.objectStore('expense');

      const countRequest = objectStore.count();
      countRequest.onsuccess = () => {
        resolve(countRequest.result);
      };

      countRequest.onerror = () => {
        reject();
      };
    }

    const request = indexedDB.open('expenseDB', 1);
    request.onsuccess = (event: any) => {
      getCount(event.target.result);
    };
  });
}

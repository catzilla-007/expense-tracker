export function registerSync(): Promise<boolean> {
  return new Promise((resolve) => {
    navigator.serviceWorker.ready.then((registration: any) => {
      if (registration.sync) {
        console.log('client: send-expense');
        registration.sync.register('send-expense');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

import { sanitizeDateRequest } from './date';

export interface IExpense {
  name: string;
  price: number;
  description?: string;
  date: string;
}

export function addExpense(expense: IExpense, callback?: () => void): void {
  const { name, price, description, date } = expense;

  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.ready
    .then((registration) => {
      if (!registration.active) return;
      const payload = {
        name,
        price,
        description,
        date: sanitizeDateRequest(date)
      };
      registration.active.postMessage(payload);
    })
    .catch((error) => {
      console.error('some error happened', error);
    })
    .finally(callback);
}

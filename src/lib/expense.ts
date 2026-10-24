import { workerRequest } from './api/broadcast';
import { sanitizeDateRequest } from './date';

export interface IExpense {
  name: string;
  price: number;
  description?: string;
  date: string;
}

export async function addExpense(expense: IExpense): Promise<void> {
  await workerRequest('add-expense', {
    expense: { ...expense, date: sanitizeDateRequest(expense.date) }
  });
}

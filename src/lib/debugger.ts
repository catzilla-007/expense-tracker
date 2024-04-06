import { logs } from './store/logs';

export function debug(message: string) {
  logs.update((l) => [...l, `c: ${message}`]);
  console.log(`c: ${message}`);
}

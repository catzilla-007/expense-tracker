import { logs } from './store/logs';

export function debug(message: string) {
  logs.update((l) => [...l, `ct: ${message}`]);
  console.log(` c: ${message}`);
}

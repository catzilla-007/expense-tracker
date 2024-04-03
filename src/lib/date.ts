export function formatDate(date: Date): string {
  const parsedDate: Array<string> = date.toLocaleDateString().split('/');
  return `${parsedDate[2]}-${parsedDate[0].padStart(2, '0')}-${parsedDate[1].padStart(2, '0')}`;
}

export function sanitizeDateRequest(date: string) {
  const parsedDate: Array<string> = date.split('-');
  return `${parsedDate[1]}/${parsedDate[2]}/${parsedDate[0]}`;
}

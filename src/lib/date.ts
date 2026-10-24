export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function sanitizeDateRequest(date: string) {
  const parsedDate: Array<string> = date.split('-');
  return `${parsedDate[1]}/${parsedDate[2]}/${parsedDate[0]}`;
}

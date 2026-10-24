/** @param {string} value */
export function normalizeSheetUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error('Enter a deployed Apps Script URL ending in /exec.');
  }
  if (
    url.protocol !== 'https:' ||
    url.host !== 'script.google.com' ||
    !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'Use https://script.google.com/macros/s/<deployment-id>/exec without query parameters.'
    );
  }
  return url.href;
}

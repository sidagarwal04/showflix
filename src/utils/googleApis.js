/**
 * Base URL for **fetch()** to Google APIs (e.g. Drive `files.list`).
 *
 * In dev, `/googleapis` is proxied by Vite → `https://www.googleapis.com` so `files.list` works
 * from localhost without CORS blocking.
 *
 * **Do not** use this for `<img src>`. Use `driveImageUrl()` / `driveAltMediaUrl()` in `driveUrls.js`.
 */
export function googleApisBaseUrl() {
  if (import.meta.env.DEV) return '/googleapis'
  return 'https://www.googleapis.com'
}

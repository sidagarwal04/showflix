/**
 * Picks which Google API key to use for Drive (list + image `alt=media`).
 *
 * - **Production:** only `VITE_GOOGLE_DRIVE_API_KEY` (set on Netlify).
 * - **Local dev (`npm run dev`):** if `VITE_GOOGLE_DRIVE_API_KEY_LOCAL` is set, use it so you can
 *   keep the production key restricted to Netlify referrers only.
 *   Otherwise fall back to `VITE_GOOGLE_DRIVE_API_KEY` from `.env.local` (e.g. same key + localhost referrer).
 */
export function getGoogleDriveApiKey() {
  const main = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY?.trim() || ''
  const local = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY_LOCAL?.trim() || ''

  if (import.meta.env.DEV) {
    if (local) return local
    return main
  }

  return main
}

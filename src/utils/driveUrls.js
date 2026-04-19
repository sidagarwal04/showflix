/**
 * Google Drive URL helpers for public files.
 * Replace FILE_ID values in mediaConfig with your own shared Drive file IDs.
 */

/**
 * Best `<img src>` for Drive photos when you use the same API key as `files.list`:
 * **`files` GET + `alt=media`** returns real image bytes for publicly shared files.
 *
 * Falls back to **`thumbnail`** only if `VITE_GOOGLE_DRIVE_API_KEY` is unset (then large
 * files often break — set the env var in Netlify / `.env.local`).
 *
 * @param {string} fileId
 * @param {number} [_maxWidth=2400] Used only for thumbnail fallback (`sz=w…`).
 * @param {string} [apiKeyOverride] Optional key; defaults to `import.meta.env.VITE_GOOGLE_DRIVE_API_KEY`.
 */
export function driveImageUrl(fileId, _maxWidth = 2400, apiKeyOverride) {
  if (!fileId) return ''
  const key =
    (apiKeyOverride && String(apiKeyOverride).trim()) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_DRIVE_API_KEY) ||
    ''
  if (key) {
    return `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${encodeURIComponent(key.trim())}`
  }
  const w = Math.min(Math.max(Number(_maxWidth) || 2400, 200), 4096)
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${w}`
}

/**
 * Embedded Drive player (iframe). Works well for gallery modals.
 * @see https://drive.google.com/file/d/FILE_ID/preview
 */
export function driveVideoPreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Raw video URL for `<video>` tags. Drive may redirect or throttle; if playback fails,
 * prefer preview URL inside an iframe in the modal instead.
 */
export function driveVideoDirectUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

/**
 * Smaller thumbnail for carousel cards (video poster–style or dense grids).
 */
export function driveThumbnailUrl(fileId, width = 640) {
  if (!fileId) return ''
  const w = Math.min(Math.max(width, 100), 2000)
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${w}`
}

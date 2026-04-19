/**
 * Google Drive URL helpers for public files.
 *
 * **`<img src>`:** Use `driveImageUrl()` — `drive.google.com/thumbnail` — for typical
 * “Anyone with the link” shares. No API key in the URL (avoids 403s from key restrictions and
 * keeps the key out of DevTools for every image).
 *
 * **`alt=media`:** `driveAltMediaUrl()` — full file bytes; optional fallback when thumbnails fail.
 * Can still return 403 if the key or sharing setup is wrong.
 */

import { getGoogleDriveApiKey } from './googleDriveEnv.js'

const GOOGLE_APIS_ORIGIN = 'https://www.googleapis.com'

/**
 * Resized image via Drive’s thumbnail endpoint (good default for gallery + modals).
 */
export function driveImageUrl(fileId, maxWidth = 2400) {
  if (!fileId) return ''
  const w = Math.min(Math.max(Number(maxWidth) || 2400, 200), 4096)
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${w}`
}

/**
 * Full file via Drive REST `files.get` + `alt=media`. Use as fallback only; requires API key.
 */
export function driveAltMediaUrl(fileId, apiKeyOverride) {
  if (!fileId) return ''
  const key =
    (apiKeyOverride && String(apiKeyOverride).trim()) || getGoogleDriveApiKey() || ''
  if (!key) return ''
  return `${GOOGLE_APIS_ORIGIN}/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${encodeURIComponent(key.trim())}`
}

export function driveVideoPreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

export function driveVideoDirectUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export function driveThumbnailUrl(fileId, width = 640) {
  if (!fileId) return ''
  const w = Math.min(Math.max(width, 100), 2000)
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${w}`
}

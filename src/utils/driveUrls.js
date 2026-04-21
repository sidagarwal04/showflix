/**
 * Google Drive URL helpers for public files.
 *
 * **`<img src>`:** Use `driveImageUrl()` — `drive.google.com/thumbnail` — for typical
 * “Anyone with the link” shares. No API key in the URL (avoids 403s from key restrictions and
 * keeps the key out of DevTools for every image).
 *
 * **`<img>` on error:** use a static placeholder. We do not chain `uc?export=view` (often 403 when hotlinking)
 * or `files.get` + `alt=media` (403 with API keys in the browser).
 */

/** Resized image via Drive’s thumbnail endpoint (good default for gallery + modals). */
export function driveImageUrl(fileId, maxWidth = 2400) {
  if (!fileId) return ''
  const w = Math.min(Math.max(Number(maxWidth) || 2400, 200), 4096)
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${w}`
}

/**
 * Masonry / cards / modal: optional `item.imageSrc` (full https URL) overrides Drive `item.id`.
 * Use for non-Drive placeholders so the grid does not request the same thumbnail many times (429).
 */
export function galleryItemImageSrc(item, maxWidth = 2400) {
  const direct = typeof item?.imageSrc === 'string' ? item.imageSrc.trim() : ''
  if (direct) return direct
  return driveImageUrl(item?.id, maxWidth)
}

/** Last-resort image when Drive embeds fail. */
export const STATIC_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=1200&q=80'

/** One-shot fallback — do not chain other Drive URLs (403/429). */
export function onDriveImageError(e, _item, finalFallback = STATIC_IMG_FALLBACK) {
  const el = e.currentTarget
  el.onerror = null
  el.src = finalFallback
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

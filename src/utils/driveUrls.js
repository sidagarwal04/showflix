/**
 * Google Drive URL helpers for public files.
 * Replace FILE_ID values in mediaConfig with your own shared Drive file IDs.
 */

/** Thumbnail / <img> src for images shared as "Anyone with the link can view". */
export function driveImageUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

/**
 * Embedded Drive player (iframe). Works well for gallery modals.
 * @see https://drive.google.com/file/d/FILE_ID/preview
 */
export function driveVideoPreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Raw video URL for <video> tags. Drive may redirect or throttle; if playback fails,
 * prefer preview URL inside an iframe in the modal instead.
 */
export function driveVideoDirectUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

/**
 * Drive-generated thumbnail (works for many public video/image files).
 * Falls back gracefully in the UI if Google returns 403 for your file type.
 */
export function driveThumbnailUrl(fileId, width = 640) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`
}

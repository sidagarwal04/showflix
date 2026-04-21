/**
 * Cloudflare Worker in front of Google Drive — GET /list + GET /{filename}
 */

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i

export function isProxyImageFilename(name) {
  return typeof name === 'string' && IMAGE_EXT.test(name.trim())
}

function stripExtension(filename) {
  const s = String(filename).replace(/\.[^/.]+$/, '')
  return s || filename
}

/** Encode path segments for URLs like GET /my%20photo.jpg */
function encodePathForProxy(name) {
  return String(name)
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

/** @returns {string | null} trimmed folder id for query params, or null to omit */
function normalizeFolderParam(folder) {
  if (folder === undefined || folder === null) return null
  const s = String(folder).trim()
  return s === '' ? null : s
}

/** Full-size image URL: `/{name}` or `/{name}?folder=n` */
function proxyFileUrl(base, name, folder) {
  const path = `${base.replace(/\/$/, '')}/${encodePathForProxy(name)}`
  const f = normalizeFolderParam(folder)
  if (!f) return path
  return `${path}?folder=${encodeURIComponent(f)}`
}

/** Thumbnail: `?size=thumb` or `?folder=n&size=thumb` */
function proxyThumbnailUrl(fileUrl) {
  const sep = fileUrl.includes('?') ? '&' : '?'
  return `${fileUrl}${sep}size=thumb`
}

/**
 * @param {string} baseUrl e.g. https://drive-image-proxy.sidaxy.workers.dev
 * @param {{ folder?: string | number }} [options] — e.g. `{ folder: 2 }` → `/list?folder=2` and `/{name}?folder=2`
 * @returns {Promise<Array<{ id: string, name: string, title: string, description: string, imageSrc: string, thumbnailSrc: string }>>}
 */
export async function fetchDriveProxyImageList(baseUrl, options = {}) {
  const base = baseUrl.replace(/\/$/, '')
  const folder = options.folder
  const f = normalizeFolderParam(folder)
  const listUrl = f ? `${base}/list?folder=${encodeURIComponent(f)}` : `${base}/list`
  const res = await fetch(listUrl)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Proxy list ${res.status}`)
  }
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error('Invalid /list response')
  }

  const items = data
    .filter((row) => row && typeof row.name === 'string' && isProxyImageFilename(row.name))
    .map((row) => {
      const name = row.name.trim()
      const id = row.id != null && String(row.id).trim() ? String(row.id).trim() : name
      const imageSrc = proxyFileUrl(base, name, folder)
      return {
        id,
        name,
        title: stripExtension(name.split('/').pop() || name),
        description: '',
        imageSrc,
        thumbnailSrc: proxyThumbnailUrl(imageSrc),
      }
    })

  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))

  return items
}

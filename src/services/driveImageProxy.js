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

/**
 * @param {string} baseUrl e.g. https://drive-image-proxy.sidaxy.workers.dev
 * @returns {Promise<Array<{ id: string, name: string, title: string, description: string, imageSrc: string, thumbnailSrc: string }>>}
 */
export async function fetchDriveProxyImageList(baseUrl) {
  const base = baseUrl.replace(/\/$/, '')
  const res = await fetch(`${base}/list`)
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
      const imageSrc = `${base}/${encodePathForProxy(name)}`
      return {
        id,
        name,
        title: stripExtension(name.split('/').pop() || name),
        description: '',
        imageSrc,
        thumbnailSrc: `${imageSrc}?size=thumb`,
      }
    })

  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))

  return items
}

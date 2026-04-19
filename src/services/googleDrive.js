/**
 * Google Drive API v3 — list image files in a folder.
 */

import { googleApisBaseUrl } from '../utils/googleApis.js'

function driveFilesListUrl() {
  return `${googleApisBaseUrl()}/drive/v3/files`
}

function stripExtension(filename) {
  if (!filename) return 'Photo'
  return String(filename).replace(/\.[^/.]+$/, '') || 'Photo'
}

/**
 * @param {string} folderId
 * @param {string} apiKey
 * @param {{ orderBy?: string }} [options] — Drive `files.list` sort, e.g. `'name'` (default), `'createdTime'`, `'modifiedTime'`.
 */
export async function fetchDriveFolderImageFiles(folderId, apiKey, options = {}) {
  if (!folderId?.trim() || !apiKey?.trim()) {
    throw new Error('Missing Drive folder id or API key')
  }

  const orderBy = options.orderBy?.trim() || 'name'

  const collected = []
  let pageToken

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, imageMediaMetadata(width, height))',
      pageSize: '100',
      orderBy,
      key: apiKey.trim(),
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`${driveFilesListUrl()}?${params.toString()}`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Drive API ${res.status}`)
    }

    const data = await res.json()
    for (const f of data.files || []) {
      if (!f.mimeType?.startsWith('image/')) continue
      const w = f.imageMediaMetadata?.width
      const h = f.imageMediaMetadata?.height
      collected.push({
        id: f.id,
        title: stripExtension(f.name),
        description: '',
        ...(typeof w === 'number' && typeof h === 'number' ? { width: w, height: h } : {}),
      })
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return collected
}

/**
 * Google Drive API v3 — list image files in a folder.
 *
 * Setup (summary):
 * 1. Google Cloud Console → enable “Google Drive API”.
 * 2. Credentials → API key; restrict it to Drive API (for production, add HTTP referrer / Netlify domain).
 * 3. Share the Drive folder: “Anyone with the link” → Viewer (so the key can list files).
 * 4. Put `VITE_GOOGLE_DRIVE_API_KEY` (and optional `VITE_GOOGLE_DRIVE_FOLDER_ID`) in `.env.local`.
 *
 * Note: A browser-exposed key is visible to visitors. For a private folder or stricter security,
 * use a Netlify Function or small backend to hold the key server-side.
 */

const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files'

function stripExtension(filename) {
  if (!filename) return 'Photo'
  return String(filename).replace(/\.[^/.]+$/, '') || 'Photo'
}

/**
 * Lists image files in a folder. Returns Drive `imageMediaMetadata` width/height when Google provides it
 * (often JPEG/HEIC; some formats may omit — the gallery still measures in the browser on load).
 *
 * @param {string} folderId Folder id from the URL `.../folders/FOLDER_ID`
 * @param {string} apiKey Google API key
 * @returns {Promise<Array<{ id: string, title: string, description?: string, width?: number, height?: number }>>}
 */
export async function fetchDriveFolderImageFiles(folderId, apiKey) {
  if (!folderId?.trim() || !apiKey?.trim()) {
    throw new Error('Missing Drive folder id or API key')
  }

  const collected = []
  let pageToken

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, imageMediaMetadata(width, height))',
      pageSize: '100',
      orderBy: 'name',
      key: apiKey.trim(),
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`${DRIVE_FILES}?${params.toString()}`)
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

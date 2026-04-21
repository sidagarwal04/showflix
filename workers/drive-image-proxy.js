/**
 * Cloudflare Worker — Google Drive image proxy + cache
 * ------------------------------------------------------
 * Deploy this in Cloudflare Dashboard → Workers & Pages → Create → paste → Deploy,
 * or use Wrangler with this file as the module entry.
 *
 * Secrets / vars (Worker → Settings → Variables):
 *   GOOGLE_API_KEY  — Google Cloud API key (Drive API enabled; restrict to Drive API only).
 *   FOLDER_ID       — Primary Drive folder ID (Bump Era gallery).
 *   FOLDER_ID_2     — Second folder (e.g. Sprinkle Season); optional if you only use one folder.
 *
 * Drive folders should allow link sharing so `files.get` + `alt=media` works with an API key.
 *
 * Endpoints:
 *   GET /list                    — JSON [{ id, name }, …] for FOLDER_ID
 *   GET /list?folder=2         — same for FOLDER_ID_2
 *   GET /{filename}?size=thumb — resized thumbnail (Google thumbnail CDN, w800)
 *   GET /{filename}            — full file via Drive API alt=media
 *   Add ?folder=2 on image URLs to resolve names inside the second folder.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname.replace(/^\//, '')
    const size = url.searchParams.get('size')
    const folder = url.searchParams.get('folder') // "1" or "2"

    const cache = caches.default
    const cacheKey = new Request(request.url, request)

    // Pick folder ID based on ?folder=1 or ?folder=2 (defaults to folder 1)
    const folderId = folder === '2' ? env.FOLDER_ID_2 : env.FOLDER_ID

    // ─── /list?folder=1 or /list?folder=2 ───
    if (pathname === 'list') {
      let response = await cache.match(cacheKey)
      if (response) return response

      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&key=${env.GOOGLE_API_KEY}&fields=files(id,name)&pageSize=1000`
      const listRes = await fetch(listUrl)
      const listData = await listRes.json()

      if (listData.error) {
        return new Response(`Drive API error: ${JSON.stringify(listData.error)}`, { status: 500 })
      }

      response = new Response(JSON.stringify(listData.files, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'Access-Control-Allow-Origin': '*',
        },
      })

      ctx.waitUntil(cache.put(cacheKey, response.clone()))
      return response
    }

    // ─── /filename.jpg?folder=1 or /filename.jpg?folder=2 ───
    if (!pathname) {
      return new Response('Missing filename or file ID', { status: 400 })
    }

    let response = await cache.match(cacheKey)
    if (response) return response

    let fileId = pathname

    if (pathname.includes('.')) {
      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name='${pathname}'+and+trashed=false&key=${env.GOOGLE_API_KEY}&fields=files(id,name)`
      const listRes = await fetch(listUrl)
      const listData = await listRes.json()

      if (listData.error) {
        return new Response(`Drive API error: ${JSON.stringify(listData.error)}`, { status: 500 })
      }

      if (!listData.files || listData.files.length === 0) {
        return new Response(`File not found: ${pathname}`, { status: 404 })
      }

      fileId = listData.files[0].id
    }

    const driveUrl =
      size === 'thumb'
        ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
        : `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${env.GOOGLE_API_KEY}`

    let driveResponse
    try {
      driveResponse = await fetch(driveUrl)
    } catch (err) {
      return new Response(`Fetch failed: ${err.message}`, { status: 502 })
    }

    if (!driveResponse.ok) {
      const errText = await driveResponse.text()
      return new Response(`Drive error ${driveResponse.status}: ${errText}`, {
        status: driveResponse.status,
      })
    }

    const contentType = driveResponse.headers.get('content-type') || 'image/jpeg'

    response = new Response(driveResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
      },
    })

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  },
}

/**
 * YouTube helpers — hero background + fullscreen modal use embed URLs.
 * Paste either a watch URL or the 11-character video id in `mediaConfig`.
 */

/** Extract video id from watch / youtu.be / embed URLs, or pass through a bare id. */
export function parseYoutubeVideoId(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  try {
    const u = new URL(trimmed)
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0]?.slice(0, 11) || null
    }
    const v = u.searchParams.get('v')
    if (v) return v
    const embed = u.pathname.match(/\/embed\/([^/?]+)/)
    if (embed) return embed[1]
  } catch {
    return null
  }
  return null
}

/** Background-style embed: autoplay, loop, minimal chrome. */
export function youtubeHeroEmbedUrl(videoId, { muted = true } = {}) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: muted ? '1' : '0',
    loop: '1',
    playlist: videoId,
    controls: '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

/** Fullscreen “Play” modal: autoplay with controls. */
export function youtubeModalEmbedUrl(videoId) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

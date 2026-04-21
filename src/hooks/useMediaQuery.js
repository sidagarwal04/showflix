import { useEffect, useState } from 'react'

function getMediaQueryMatches(query) {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

/**
 * Returns whether the query matches.
 * Initial state reads `matchMedia` synchronously on the client so layout/asset choices
 * (e.g. mobile vs desktop video) are correct on the first paint — not one frame late.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => getMediaQueryMatches(query))

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

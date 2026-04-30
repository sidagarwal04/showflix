import { useEffect } from 'react'
import Home from './Home'

/**
 * `/gallery-one` — scrolls to the gallery one masonry on Home (Back to top lives in `Home`).
 */
export default function GalleryOne() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('gallery-one')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  return <Home />
}

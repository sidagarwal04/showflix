import { useEffect } from 'react'
import Home from './Home'

/**
 * `/bump-era` — scrolls to the maternity shoot masonry on Home.
 */
export default function BumpEra() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('maternity-shoot')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  return <Home />
}

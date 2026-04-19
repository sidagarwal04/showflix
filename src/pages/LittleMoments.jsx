import { useEffect } from 'react'
import Home from './Home'

export default function LittleMoments() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('little-moments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  return <Home />
}

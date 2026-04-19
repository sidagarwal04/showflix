import { useEffect } from 'react'
import Home from './Home'

export default function BabyShower() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('maternity-function')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  return <Home />
}

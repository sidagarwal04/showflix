import { useEffect } from 'react'
import Home from './Home'

/**
 * Scrolls to maternity content on Home (currently the shoot row while “Maternity Films” is disabled in config).
 */
export default function Maternity() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('maternity-shoot')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  return <Home />
}

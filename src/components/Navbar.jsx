import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const linkClass = ({ isActive }) =>
  [
    'text-sm font-medium transition-colors md:text-[15px]',
    isActive ? 'text-white' : 'text-white/70 hover:text-white',
  ].join(' ')

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Navbar({ brandName = 'SIDFLIX' }) {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      initial={false}
      animate={{
        backgroundColor: solid ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0)',
        boxShadow: solid ? '0 8px 24px rgba(0,0,0,0.45)' : '0 0 0 rgba(0,0,0,0)',
      }}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 md:px-10">
        <Link
          to="/"
          onClick={scrollToTop}
          className="shrink-0 font-[family-name:var(--font-body)] text-2xl font-extrabold tracking-tight"
          style={{ color: '#E50914' }}
        >
          {brandName}
        </Link>

        <nav className="scrollbar-hide flex max-w-[60vw] flex-1 justify-center gap-4 overflow-x-auto whitespace-nowrap px-1 md:max-w-none md:gap-8">
          <NavLink to="/" className={linkClass} end onClick={scrollToTop}>
            Home
          </NavLink>
          <NavLink to="/maternity" className={linkClass}>
            Maternity
          </NavLink>
          <NavLink to="/baby-shower" className={linkClass}>
            Baby Shower
          </NavLink>
          <NavLink to="/little-moments" className={linkClass}>
            Little Moments
          </NavLink>
        </nav>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-white/40"
          >
            <span className="sr-only">Profile menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded border border-white/10 bg-black/95 py-1 text-sm shadow-xl backdrop-blur-md"
                role="menu"
              >
                <div className="px-3 py-2 text-white/60">Family</div>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-white/90 hover:bg-white/10"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Saved for later
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-white/90 hover:bg-white/10"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Share link
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

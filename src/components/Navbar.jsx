import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const linkClass = ({ isActive }) =>
  [
    'text-[13px] font-medium transition-colors md:text-[15px]',
    isActive ? 'text-white' : 'text-white/75 hover:text-white',
  ].join(' ')

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Served from `public/sr-originals-logo.png` */
const BRAND_LOGO_SRC = '/sr-originals-logo.png'

export default function Navbar({ brandName = 'SIDFLIX' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <header className="relative z-40 w-full bg-black shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex h-[68px] max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6 md:h-[70px] md:gap-6 md:px-10">
        <Link
          to="/"
          onClick={scrollToTop}
          className="shrink-0 py-1 transition-opacity hover:opacity-90"
        >
          <img
            src={BRAND_LOGO_SRC}
            alt={brandName}
            className="block h-8 w-auto md:h-9"
            decoding="async"
          />
        </Link>

        <nav className="scrollbar-hide flex min-w-0 max-w-[56vw] flex-1 justify-center gap-3 overflow-x-auto whitespace-nowrap px-1 sm:gap-5 md:max-w-none md:gap-8">
          <NavLink to="/" className={linkClass} end onClick={scrollToTop}>
            Home
          </NavLink>
          <NavLink to="/bump-era" className={linkClass}>
            Bump Era
          </NavLink>
          <NavLink to="/sprinkle-season" className={linkClass}>
            Sprinkle Season
          </NavLink>
          {/* Little Moments — add back with route in App.jsx when ready
          <NavLink to="/little-moments" className={linkClass}>
            Little Moments
          </NavLink>
          */}
        </nav>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1 rounded p-0.5 text-white transition hover:opacity-90"
          >
            <span className="sr-only">Profile menu</span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#E50914] text-lg leading-none shadow-md md:h-9 md:w-9"
              aria-hidden
            >
              🙂
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white/80"
              aria-hidden
            >
              <path d="M7 10l5 5 5-5H7z" />
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
    </header>
  )
}

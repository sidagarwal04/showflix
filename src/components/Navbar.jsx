import { Link, NavLink } from 'react-router-dom'

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
/** Decorative baby footprints — `public/baby-footprints.png` */
const DECOR_FOOTPRINTS_SRC = '/baby-footprints.png'

export default function Navbar({ brandName = 'SIDFLIX' }) {
  return (
    <header className="relative z-40 w-full bg-black shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex h-[68px] max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6 md:h-[70px] md:gap-6 md:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6 md:gap-10">
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

          <nav className="scrollbar-hide flex min-w-0 gap-3 overflow-x-auto whitespace-nowrap sm:gap-5 md:gap-8">
            <NavLink to="/" className={linkClass} end onClick={scrollToTop}>
              Home
            </NavLink>
            <NavLink to="/gallery-one" className={linkClass}>
              Gallery One
            </NavLink>
            <NavLink to="/gallery-two" className={linkClass}>
              Gallery Two
            </NavLink>
            {/* Little Moments — add back with route in App.jsx when ready
            <NavLink to="/little-moments" className={linkClass}>
              Little Moments
            </NavLink>
            */}
          </nav>
        </div>

        <div
          className="pointer-events-none flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm md:h-10 md:w-10 md:p-2"
          aria-hidden
        >
          <img
            src={DECOR_FOOTPRINTS_SRC}
            alt=""
            className="h-full w-full object-contain"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </header>
  )
}

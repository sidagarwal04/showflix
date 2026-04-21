import { useEffect, useState } from 'react'

/**
 * End-of-page block + fixed control so “Back to top” is easy to find.
 * Floating button appears after the user scrolls (e.g. on /bump-era after jump to the gallery).
 */
export default function BackToTop({ className = '' }) {
  const [showFab, setShowFab] = useState(false)

  useEffect(() => {
    const update = () => {
      setShowFab(window.scrollY > 120)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section
        id="back-to-top-section"
        aria-label="End of page"
        className={`bg-[#141414] px-4 py-12 sm:py-16 ${className}`.trim()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={goTop}
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-lg transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span aria-hidden className="text-lg leading-none">
              ↑
            </span>
            Back to top
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={goTop}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-6 right-4 z-50 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border-2 border-white/40 bg-[#E50914] text-2xl leading-none text-white shadow-[0_8px_28px_rgba(0,0,0,0.55)] transition hover:scale-[1.05] hover:bg-[#f40612] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-8 sm:right-6 md:h-16 md:w-16 md:text-3xl ${
          showFab ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span aria-hidden>↑</span>
      </button>
    </>
  )
}

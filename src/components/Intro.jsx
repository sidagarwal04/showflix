import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'

const SPLASH_VIDEO_DESKTOP = '/sr-originals-splash.mp4'
const SPLASH_VIDEO_MOBILE = '/sr-originals-splash-mobile.mp4'
const FALLBACK_IMG = '/sr-originals-splash-logo-bgremove.png'

/**
 * Full-screen intro. One tap unlocks unmuted playback (browser policy).
 */
export default function Intro({ onDone }) {
  const videoRef = useRef(null)
  const safetyTimerRef = useRef(null)
  const finishedRef = useRef(false)
  const [useFallback, setUseFallback] = useState(false)
  /** Must be true before we call play() — that gesture unlocks unmuted audio every time. */
  const [started, setStarted] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [splashVideoSrc, setSplashVideoSrc] = useState(SPLASH_VIDEO_DESKTOP)

  useEffect(() => {
    if (started) return
    setSplashVideoSrc(isMobile ? SPLASH_VIDEO_MOBILE : SPLASH_VIDEO_DESKTOP)
  }, [isMobile, started])

  const clearSafety = () => {
    if (safetyTimerRef.current != null) {
      window.clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }
  }

  const finishOnce = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearSafety()
    onDone()
  }

  const scheduleSafetyFromDuration = (v) => {
    const d = v.duration
    if (!Number.isFinite(d) || d <= 0) return
    clearSafety()
    safetyTimerRef.current = window.setTimeout(finishOnce, Math.ceil(d * 1000) + 1000)
  }

  const startIntro = () => setStarted(true)

  useEffect(() => {
    if (!useFallback) return
    const t = window.setTimeout(finishOnce, 3200)
    return () => window.clearTimeout(t)
  }, [useFallback])

  useEffect(() => {
    if (!started || useFallback) return
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    void v
      .play()
      .then(() => scheduleSafetyFromDuration(v))
      .catch(() => setUseFallback(true))
  }, [started, useFallback])

  const onLoadedMetadata = (e) => {
    if (!started) return
    scheduleSafetyFromDuration(e.currentTarget)
  }

  const videoShell =
    'relative h-auto w-full max-h-[min(50vh,380px)] object-contain md:absolute md:inset-0 md:h-full md:w-full md:max-h-none md:object-cover'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 md:block md:p-0"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-[min(92vw,960px)] items-center justify-center md:absolute md:inset-0 md:max-w-none"
        >
          <div
            className="pointer-events-none absolute inset-0 max-md:blur-3xl max-md:opacity-50 md:hidden"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(229, 9, 20, 0.35) 0%, transparent 55%)',
            }}
          />
          {useFallback ? (
            <img
              src={FALLBACK_IMG}
              alt="SR Originals"
              className="relative h-auto w-full max-h-[min(28vh,200px)] object-contain md:absolute md:inset-0 md:h-full md:w-full md:max-h-none md:object-cover"
              width={13156}
              height={3100}
              draggable={false}
            />
          ) : (
            <video
              ref={videoRef}
              className={`${videoShell} ${started ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              src={splashVideoSrc}
              playsInline
              preload="auto"
              aria-label="SR Originals"
              onLoadedMetadata={onLoadedMetadata}
              onEnded={finishOnce}
              onError={() => setUseFallback(true)}
            />
          )}
        </motion.div>

        {!useFallback && !started && (
          <button
            type="button"
            className="absolute inset-0 z-[110] flex cursor-pointer flex-col items-center justify-center bg-black px-6 md:px-0"
            aria-label="Now playing. Let's go — start intro"
            onClick={startIntro}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                startIntro()
              }
            }}
          >
            <span className="flex flex-col items-center gap-2 text-center md:gap-3">
              <span className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-white/55 md:text-base">
                Now Playing.
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white md:text-3xl">
                Let&apos;s Go!
              </span>
            </span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

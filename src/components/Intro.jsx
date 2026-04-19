import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { INTRO_STORAGE_KEY } from '../constants/introStorage'

/**
 * Plays a short synthesized "swoosh" (no external audio asset required).
 * Browsers may block autoplay until a user gesture; failures are ignored.
 */
function playIntroSwoosh() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    osc.type = 'sawtooth'
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.38)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    osc.start(now)
    osc.stop(now + 0.48)
    setTimeout(() => ctx.close(), 600)
  } catch {
    // Autoplay policies or missing Web Audio — intro stays visual-only
  }
}

/** Netflix-inspired red “N” mark — original geometry (not a trademarked logo). */
function NMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="nGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4b54" />
          <stop offset="100%" stopColor="#E50914" />
        </linearGradient>
      </defs>
      <motion.path
        d="M18 12 L18 148 L38 148 L38 12 Z"
        fill="url(#nGlow)"
        initial={{ opacity: 0, scaleY: 0.3, originY: 1 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M38 148 L38 120 L92 28 L108 28 L108 148 L88 148 L88 56 L44 132 Z"
        fill="url(#nGlow)"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M88 12 L108 12 L108 148 L88 148 Z"
        fill="url(#nGlow)"
        initial={{ opacity: 0, scaleY: 0.3, originY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/**
 * First-visit-only intro. Parent should mount this only when the user has not
 * completed it yet; on completion we persist to localStorage and call onDone().
 */
export default function Intro({ onDone }) {
  useEffect(() => {
    playIntroSwoosh()
    const t = setTimeout(() => {
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, '1')
      } catch {
        /* private mode */
      }
      onDone()
    }, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute inset-0 blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #E50914 0%, transparent 55%)',
            }}
          />
          <NMark className="relative h-40 w-28 md:h-52 md:w-36" />
        </motion.div>
        <motion.p
          className="mt-10 font-[family-name:var(--font-display)] text-2xl tracking-[0.35em] text-white/90 md:text-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          ORIGINALS
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}

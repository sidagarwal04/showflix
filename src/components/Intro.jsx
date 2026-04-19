import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

/**
 * Full-screen intro shown on every page load. Calls onDone when the sequence ends.
 */
export default function Intro({ onDone }) {
  useEffect(() => {
    playIntroSwoosh()
    const t = setTimeout(() => {
      onDone()
    }, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-[720px] items-center justify-center"
        >
          <div
            className="pointer-events-none absolute inset-0 blur-3xl opacity-50"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(229, 9, 20, 0.35) 0%, transparent 55%)',
            }}
          />
          <img
            src="/sr-originals-splash-logo-bgremove.png"
            alt="SR Originals"
            className="relative h-auto w-full max-h-[min(28vh,200px)] object-contain md:max-h-[min(32vh,240px)]"
            width={13156}
            height={3100}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

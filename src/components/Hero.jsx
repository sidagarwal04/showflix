import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { driveVideoDirectUrl } from '../utils/driveUrls'
import { parseYoutubeVideoId, youtubeHeroEmbedUrl } from '../utils/youtube'
import { PLACEHOLDER_HERO_VIDEO_SRC } from '../data/mediaConfig'

/**
 * Hero below static nav: fills `100dvh − nav` (match Navbar `h-[68px]` / `md:h-[70px]`).
 */
export default function Hero({
  hero,
  onPlay,
  onMoreInfo,
}) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const youtubeId = useMemo(
    () => parseYoutubeVideoId(hero.youtubeUrl || hero.youtubeVideoId || ''),
    [hero.youtubeUrl, hero.youtubeVideoId],
  )

  const videoSrc = hero.usePlaceholderVideo
    ? PLACEHOLDER_HERO_VIDEO_SRC
    : driveVideoDirectUrl(hero.videoId)

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m
      if (videoRef.current) videoRef.current.muted = next
      return next
    })
  }

  const embedSrc = youtubeId ? youtubeHeroEmbedUrl(youtubeId, { muted }) : null

  return (
    <section className="relative isolate h-[calc(100svh-68px)] min-h-[calc(100svh-68px)] w-full flex-shrink-0 overflow-hidden bg-black md:h-[calc(100svh-70px)] md:min-h-[calc(100svh-70px)]">
      {youtubeId ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <iframe
            key={muted ? 'muted' : 'unmuted'}
            title="Hero background video"
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.77vh] max-w-none origin-center scale-[1.22] -translate-x-1/2 translate-y-[calc(-50%+clamp(0.15rem,0.8vh,1rem))] border-0"
            src={embedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted={muted}
          loop
          playsInline
        />
      )}

      {/* Netflix-style readability: strong left + bottom fade */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/10 md:from-black/85 md:via-black/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414] via-black/55 to-black/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_20%,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.65)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-[1920px] flex-col justify-end px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-10 md:pb-[clamp(2.5rem,6vw,5rem)] md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[min(36rem,100%)]"
        >
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/90 sm:mb-3 sm:text-xs md:text-sm md:tracking-[0.4em]">
            {hero.subtitle}
          </p>

          <div className="mb-3 flex flex-wrap items-end gap-3 sm:mb-4 sm:gap-4">
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.95] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] md:text-[clamp(3rem,7vw,5.5rem)]">
              {hero.title}
            </h1>
            <span className="inline-flex shrink-0 items-center justify-center rounded-sm bg-[#E50914] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-lg sm:text-xs md:px-3 md:text-sm">
              Top 10
            </span>
          </div>

          <p className="mb-4 max-w-xl text-[0.95rem] leading-relaxed text-[#EBEBEB] drop-shadow-md sm:text-base md:mb-5 md:text-lg">
            {hero.description}
          </p>

          <p className="mb-0 text-xs text-white/90 drop-shadow sm:text-sm md:text-base">
            {hero.tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="text-white/45"> • </span>}
                {t}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Same row as Netflix: Play + More Info (left) · volume (right, vertically centered with buttons) */}
        <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:mt-10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex h-11 min-h-[2.75rem] items-center gap-2 rounded-md bg-white px-7 text-base font-bold text-black shadow-lg transition hover:bg-white/90 sm:h-12 sm:min-h-[3rem] sm:px-10 sm:text-lg"
            >
              <span className="text-[0.85em]" aria-hidden>
                ▶
              </span>{' '}
              Play
            </button>
            <button
              type="button"
              onClick={onMoreInfo}
              className="inline-flex h-11 min-h-[2.75rem] items-center gap-2 rounded-md border border-white/35 bg-white/[0.13] px-7 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:h-12 sm:min-h-[3rem] sm:px-9 sm:text-lg"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80 text-xs font-bold" aria-hidden>
                i
              </span>
              More Info
            </button>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:bg-black/65 sm:h-12 sm:w-12"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? (
              <span className="text-xl leading-none sm:text-2xl" aria-hidden>
                🔇
              </span>
            ) : (
              <span className="text-xl leading-none sm:text-2xl" aria-hidden>
                🔊
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

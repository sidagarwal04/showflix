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

  /** Uniform stroke for volume glyph (viewBox 48×48) */
  const sw = 1.4

  return (
    <section className="relative isolate h-[calc(100svh-68px)] min-h-[calc(100svh-68px)] w-full flex-shrink-0 overflow-hidden bg-black md:h-[calc(100svh-70px)] md:min-h-[calc(100svh-70px)]">
      {youtubeId ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/*
            Shift the embed **down** inside the hero (same box): larger +translate-y after -50%
            so the focal area sits lower and doesn’t read as “under” the nav strip.
          */}
          <iframe
            key={muted ? 'muted' : 'unmuted'}
            title="Hero background video"
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.77vh] max-w-none origin-center scale-[1.22] -translate-x-1/2 translate-y-[calc(-50%+clamp(2.25rem,6.5vh,5.25rem))] border-0"
            src={embedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[center_58%]"
          src={videoSrc}
          autoPlay
          muted={muted}
          loop
          playsInline
        />
      )}

      {/* Soft top edge so the picture doesn’t visually merge with the black nav above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-black/50 to-transparent"
        aria-hidden
      />

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
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0 text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:h-12 sm:w-12"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {/* Frosted white disk behind the line icon (legibility on dark video) */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-white/35 backdrop-blur-[6px]"
              aria-hidden
            />
            <svg
              viewBox="0 0 48 48"
              className="relative z-10 h-[2.125rem] w-[2.125rem] sm:h-9 sm:w-9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle cx="24" cy="24" r="19.75" stroke="currentColor" strokeWidth={sw} />
              {/* Speaker: rounded back + flared cone (reference-style) */}
              <rect
                x="11.75"
                y="18.5"
                width="3.5"
                height="11"
                rx="1"
                stroke="currentColor"
                strokeWidth={sw}
              />
              <path
                d="M 15.25 18.75 L 22.75 14.75 L 22.75 33.25 L 15.25 29.25 Z"
                stroke="currentColor"
                strokeWidth={sw}
                strokeLinejoin="round"
              />
              {muted ? (
                <>
                  <path
                    d="M 27 16.5 L 36.25 31.5"
                    stroke="currentColor"
                    strokeWidth={sw}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 36.25 16.5 L 27 31.5"
                    stroke="currentColor"
                    strokeWidth={sw}
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 25.25 17.5 Q 29.25 24 25.25 30.5"
                    stroke="currentColor"
                    strokeWidth={sw}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 29 14.75 Q 36.25 24 29 33.25"
                    stroke="currentColor"
                    strokeWidth={sw}
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

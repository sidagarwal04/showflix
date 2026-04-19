import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { driveVideoDirectUrl } from '../utils/driveUrls'
import { parseYoutubeVideoId, youtubeHeroEmbedUrl } from '../utils/youtube'
import { PLACEHOLDER_HERO_VIDEO_SRC } from '../data/mediaConfig'

/**
 * Full-bleed hero: YouTube embed, Drive / direct MP4, or placeholder clip.
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
    <section className="relative h-[min(78vh,820px)] w-full overflow-hidden bg-black md:h-[min(88vh,900px)]">
      {youtubeId ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/*
            True 16:9 “cover” for the hero box (avoids extra scale that crops unevenly).
            Slight downward shift shows a bit more of the upper part of the frame when letterboxing kicks in.
          */}
          <iframe
            key={muted ? 'muted' : 'unmuted'}
            title="Hero background video"
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.77vh] max-w-none -translate-x-1/2 translate-y-[calc(-50%+clamp(0.5rem,2vh,2.5rem))] border-0"
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

      {/* Bottom fade + slight vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414] via-black/50 to-black/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1920px] flex-col justify-end px-4 pb-16 pt-28 md:px-10 md:pb-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/85 md:text-sm">
            {hero.subtitle}
          </p>

          <div className="mb-4 flex flex-wrap items-end gap-4">
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-white drop-shadow-lg md:text-7xl">
              {hero.title}
            </h1>
            <span className="inline-flex items-center justify-center rounded-sm bg-[#E50914] px-2 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg md:text-sm">
              Top 10
            </span>
          </div>

          <p className="mb-5 max-w-xl text-base leading-relaxed text-[#EBEBEB]/95 md:text-lg">
            {hero.description}
          </p>

          <p className="mb-8 text-sm text-white/85 md:text-base">
            {hero.tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="text-white/40"> • </span>}
                {t}
              </span>
            ))}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg transition hover:bg-white/90"
            >
              <span aria-hidden>▶</span> Play
            </button>
            <button
              type="button"
              onClick={onMoreInfo}
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span aria-hidden>ℹ</span> More Info
            </button>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-6 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 md:bottom-10 md:right-10"
        aria-label={muted ? 'Unmute video' : 'Mute video'}
      >
        {muted ? (
          <span className="text-lg" aria-hidden>
            🔇
          </span>
        ) : (
          <span className="text-lg" aria-hidden>
            🔊
          </span>
        )}
      </button>
    </section>
  )
}

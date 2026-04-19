import { motion } from 'framer-motion'
import { driveAltMediaUrl, driveImageUrl, driveThumbnailUrl } from '../utils/driveUrls'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=1200&q=80'

export default function Card({
  item,
  variant,
  onOpen,
  layoutId,
}) {
  const isVideo = variant === 'video'
  const thumb = isVideo ? driveThumbnailUrl(item.id) : driveImageUrl(item.id)

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={() => onOpen(item)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative aspect-video w-[min(72vw,280px)] shrink-0 cursor-pointer overflow-hidden rounded-sm bg-zinc-900 shadow-lg shadow-black/50 outline-none ring-0 transition-[box-shadow] duration-300 hover:shadow-[0_0_24px_rgba(229,9,20,0.35)] md:w-[260px]"
    >
      <img
        src={thumb}
        alt=""
        className="h-full w-full object-cover transition duration-300 group-hover:brightness-75"
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget
          if (el.dataset.driveFallback === 'alt') {
            el.onerror = null
            el.src = FALLBACK_IMG
            return
          }
          const alt = driveAltMediaUrl(item.id)
          if (alt) {
            el.dataset.driveFallback = 'alt'
            el.src = alt
            return
          }
          el.onerror = null
          el.src = FALLBACK_IMG
        }}
      />

      {isVideo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-90">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-xl text-white shadow-lg backdrop-blur-sm">
            ▶
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
        <p className="font-[family-name:var(--font-display)] text-lg leading-tight text-white">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-left text-xs text-white/80">{item.description}</p>
        )}
      </div>
    </motion.button>
  )
}

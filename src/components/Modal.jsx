import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { driveImageUrl, driveVideoPreviewUrl } from '../utils/driveUrls'
import { youtubeModalEmbedUrl } from '../utils/youtube'

/**
 * Fullscreen lightbox (photos with prev/next) or Drive video preview (iframe).
 */
export default function Modal({ state, onClose, onPrev, onNext }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (state?.kind === 'photo') {
        if (e.key === 'ArrowLeft') onPrev?.()
        if (e.key === 'ArrowRight') onNext?.()
      }
    },
    [onClose, onPrev, onNext, state?.kind],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (!state) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state])

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[92vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -right-1 -top-10 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md transition hover:bg-white/20 md:-right-2 md:-top-12"
            >
              ✕ Close
            </button>

            {state.kind === 'photo' && (
              <>
                <img
                  src={driveImageUrl(state.item.id)}
                  alt={state.item.title}
                  className="mx-auto max-h-[85vh] w-auto max-w-full rounded object-contain shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                    {state.item.title}
                  </p>
                  {state.item.description && (
                    <p className="mt-1 text-sm text-white/70">{state.item.description}</p>
                  )}
                  <p className="mt-2 text-xs text-white/45">
                    {state.index + 1} / {state.total}
                  </p>
                </div>

                {state.total > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={onPrev}
                      className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-black/70 md:-translate-x-4"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={onNext}
                      className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-black/70 md:translate-x-4"
                    >
                      ›
                    </button>
                  </>
                )}
              </>
            )}

            {state.kind === 'video' && (
              <div className="overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="aspect-video w-full">
                  <iframe
                    title={state.title}
                    src={driveVideoPreviewUrl(state.fileId)}
                    className="h-full w-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="font-[family-name:var(--font-display)] text-xl text-white">{state.title}</p>
                  {state.description && (
                    <p className="mt-1 text-sm text-white/70">{state.description}</p>
                  )}
                </div>
              </div>
            )}

            {state.kind === 'youtube' && (
              <div className="overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="aspect-video w-full">
                  <iframe
                    title={state.title}
                    src={youtubeModalEmbedUrl(state.youtubeId)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="font-[family-name:var(--font-display)] text-xl text-white">{state.title}</p>
                  {state.description && (
                    <p className="mt-1 text-sm text-white/70">{state.description}</p>
                  )}
                </div>
              </div>
            )}

            {state.kind === 'stream' && (
              <div className="overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="aspect-video w-full bg-black">
                  <video
                    className="h-full w-full"
                    src={state.src}
                    controls
                    autoPlay
                    playsInline
                  />
                </div>
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="font-[family-name:var(--font-display)] text-xl text-white">{state.title}</p>
                  {state.description && (
                    <p className="mt-1 text-sm text-white/70">{state.description}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

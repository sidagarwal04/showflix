import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryItemImageSrc, driveVideoPreviewUrl, onDriveImageError, STATIC_IMG_FALLBACK } from '../utils/driveUrls'
import { youtubeModalEmbedUrl } from '../utils/youtube'

const closeBtnClassName =
  'touch-manipulation rounded-full border border-white/25 bg-black/70 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-black/85'

function ModalCloseButton({ onClose, className = '' }) {
  return (
    <button type="button" onClick={onClose} className={`${closeBtnClassName} ${className}`.trim()}>
      ✕ Close
    </button>
  )
}

/**
 * Fullscreen lightbox (photos with prev/next) or Drive video preview (iframe).
 */
export default function Modal({ state, onClose, onPrev, onNext }) {
  const panelRef = useRef(null)

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault()
        onClose()
        return
      }
      if (state?.kind === 'photo') {
        if (e.key === 'ArrowLeft') onPrev?.()
        if (e.key === 'ArrowRight') onNext?.()
      }
    },
    [onClose, onPrev, onNext, state?.kind],
  )

  /** Capture on `window` so Escape is seen before nested handlers; focus panel on open for keyboard. */
  useEffect(() => {
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [handleKey])

  useEffect(() => {
    if (!state) return
    const id = requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [state])

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
          className="fixed inset-0 z-[90] flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-black/90 p-3 backdrop-blur-sm sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex max-h-[min(92dvh,100dvh)] w-full min-w-0 max-w-6xl flex-col overflow-hidden outline-none focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {state.kind === 'photo' && (
              <>
                <div className="flex min-h-0 w-full min-w-0 flex-row items-start gap-2 sm:gap-3">
                  <div className="relative min-h-0 min-w-0 flex-1">
                    <img
                      src={galleryItemImageSrc(state.item, 1920)}
                      alt={`Photo ${state.index + 1} of ${state.total}`}
                      className="mx-auto max-h-[min(78dvh,85vh)] w-auto max-w-full rounded object-contain shadow-2xl"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => onDriveImageError(e, state.item, STATIC_IMG_FALLBACK)}
                    />
                    {state.total > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={onPrev}
                          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-black/70 sm:-translate-x-1 md:-translate-x-2"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={onNext}
                          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-black/70 sm:translate-x-1 md:translate-x-2"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end self-start pt-0.5 sm:pt-1">
                    <ModalCloseButton onClose={onClose} />
                  </div>
                </div>
                <div className="mt-4 min-h-0 shrink text-center">
                  {state.item.description?.trim() && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-white/80">
                      {state.item.description}
                    </p>
                  )}
                  <p
                    className={`text-xs text-white/45 ${state.item.description?.trim() ? 'mt-2' : ''}`}
                  >
                    {state.index + 1} / {state.total}
                  </p>
                </div>
              </>
            )}

            {state.kind === 'video' && (
              <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="flex min-h-0 w-full min-w-0 flex-row items-start gap-2 p-2 sm:gap-3 sm:p-3">
                  <div className="relative min-h-0 min-w-0 flex-1 bg-black aspect-video">
                    <iframe
                      title={state.title}
                      src={driveVideoPreviewUrl(state.fileId)}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex shrink-0 flex-col items-end self-start pt-0.5 sm:pt-1">
                    <ModalCloseButton onClose={onClose} />
                  </div>
                </div>
                <div className="min-h-0 shrink border-t border-white/10 px-4 py-3">
                  <p className="font-[family-name:var(--font-display)] text-xl text-white">{state.title}</p>
                  {state.description && (
                    <p className="mt-1 text-sm text-white/70">{state.description}</p>
                  )}
                </div>
              </div>
            )}

            {state.kind === 'youtube' && (
              <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="flex min-h-0 w-full min-w-0 flex-row items-start gap-2 p-2 sm:gap-3 sm:p-3">
                  <div className="relative min-h-0 min-w-0 flex-1 bg-black aspect-video">
                    <iframe
                      title={state.title}
                      src={youtubeModalEmbedUrl(state.youtubeId)}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex shrink-0 flex-col items-end self-start pt-0.5 sm:pt-1">
                    <ModalCloseButton onClose={onClose} />
                  </div>
                </div>
                <div className="min-h-0 shrink border-t border-white/10 px-4 py-3">
                  <p className="font-[family-name:var(--font-display)] text-xl text-white">{state.title}</p>
                  {state.description && (
                    <p className="mt-1 text-sm text-white/70">{state.description}</p>
                  )}
                </div>
              </div>
            )}

            {state.kind === 'stream' && (
              <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
                <div className="flex min-h-0 w-full min-w-0 flex-row items-start gap-2 p-2 sm:gap-3 sm:p-3">
                  <div className="relative min-h-0 min-w-0 flex-1 bg-black aspect-video">
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={state.src}
                      controls
                      autoPlay
                      loop
                      playsInline
                    />
                  </div>
                  <div className="flex shrink-0 flex-col items-end self-start pt-0.5 sm:pt-1">
                    <ModalCloseButton onClose={onClose} />
                  </div>
                </div>
                <div className="min-h-0 shrink border-t border-white/10 px-4 py-3">
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

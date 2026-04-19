import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { driveImageUrl } from '../utils/driveUrls'
import {
  autoGridPlacement,
  getImageOrientation,
  loadingGridPlacement,
} from '../utils/masonryLayout'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { fetchDriveFolderImageFiles } from '../services/googleDrive'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=1200&q=80'

/**
 * Editorial masonry: cream panel, white hairline gutters, sharp corners.
 * With `VITE_GOOGLE_DRIVE_API_KEY` + `VITE_GOOGLE_DRIVE_FOLDER_ID`, loads files via Drive API.
 */
export default function MasonryGallery({ section, onOpenItem }) {
  const wide = useMediaQuery('(min-width: 768px)')
  const autoLayout = section.masonryLayout !== 'manual'

  const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY
  const folderId =
    import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID?.trim() || section.driveFolderId?.trim() || ''
  const shouldFetchDrive = Boolean(apiKey && folderId)

  const [loadState, setLoadState] = useState(() =>
    shouldFetchDrive ? { status: 'loading' } : { status: 'idle' },
  )

  /** Sizes measured in-browser when Drive omits `imageMediaMetadata`. */
  const [measured, setMeasured] = useState({})

  useEffect(() => {
    if (!shouldFetchDrive) return undefined
    let cancelled = false
    startTransition(() => setLoadState({ status: 'loading' }))
    fetchDriveFolderImageFiles(folderId, apiKey)
      .then((items) => {
        if (!cancelled) {
          startTransition(() => {
            setLoadState({ status: 'ready', items })
            setMeasured({})
          })
        }
      })
      .catch((err) => {
        if (!cancelled) startTransition(() => setLoadState({ status: 'error', error: err }))
      })
    return () => {
      cancelled = true
    }
  }, [shouldFetchDrive, folderId, apiKey])

  const effectiveItems = useMemo(() => {
    const fallback = section.items ?? []
    if (!shouldFetchDrive) return fallback
    if (loadState.status === 'ready') return loadState.items ?? []
    if (loadState.status === 'error') return fallback
    return []
  }, [shouldFetchDrive, loadState, section.items])

  const sectionForModal = useMemo(
    () => ({ ...section, items: effectiveItems }),
    [section, effectiveItems],
  )

  const dimsFor = useCallback(
    (item, index) => {
      if (item.width && item.height) return { w: item.width, h: item.height }
      return measured[index] ?? null
    },
    [measured],
  )

  const onImgLoad = useCallback((index, e) => {
    const el = e.currentTarget
    const w = el.naturalWidth
    const h = el.naturalHeight
    if (!w || !h) return
    setMeasured((prev) => {
      if (prev[index]?.w === w && prev[index]?.h === h) return prev
      return { ...prev, [index]: { w, h } }
    })
  }, [])

  const placementFor = (item, index) => {
    if (!wide) return { gridColumn: '1 / -1' }

    if (!autoLayout && item.gridColumn && item.gridRow) {
      return { gridColumn: item.gridColumn, gridRow: item.gridRow }
    }

    if (item.layout === 'manual' && item.gridColumn && item.gridRow) {
      return { gridColumn: item.gridColumn, gridRow: item.gridRow }
    }

    const m = dimsFor(item, index)
    const ratio = m ? m.w / m.h : null
    if (ratio == null) return loadingGridPlacement()
    return autoGridPlacement(ratio)
  }

  const aspectClassFor = (item, index) => {
    const m = dimsFor(item, index)
    if (!m) return 'aspect-[3/2]'
    const o = getImageOrientation(m.w, m.h)
    if (o === 'portrait') return 'aspect-[2/3]'
    if (o === 'landscape') return 'aspect-[3/2]'
    return 'aspect-square'
  }

  const showLoading = shouldFetchDrive && loadState.status === 'loading'
  const showError = shouldFetchDrive && loadState.status === 'error'
  const showEmpty =
    shouldFetchDrive && loadState.status === 'ready' && effectiveItems.length === 0

  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-y border-black/5 bg-[#f4f0e8] py-10 text-[#2a2826] md:scroll-mt-28 md:py-14"
    >
      <div className="mx-auto max-w-[1920px] px-4 md:px-10">
        {section.kicker && (
          <p className="mb-1 font-[family-name:var(--font-body)] text-xs font-medium uppercase tracking-[0.25em] text-black/45">
            {section.kicker}
          </p>
        )}
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[#1a1918] md:text-4xl">
          {section.title}
        </h2>

        {showLoading && (
          <p className="mb-6 font-[family-name:var(--font-body)] text-sm text-black/50">Loading…</p>
        )}
        {showError && (
          <p className="mb-6 font-[family-name:var(--font-body)] text-sm text-red-800/90">
            Could not load photos from Drive. Showing backup list from config if available.
          </p>
        )}
        {showEmpty && (
          <p className="mb-6 font-[family-name:var(--font-body)] text-sm text-black/50">
            No images found in this folder.
          </p>
        )}

        {!showLoading && effectiveItems.length > 0 && (
          <div className="rounded-none bg-white p-[4px] md:p-1">
            <div className="grid grid-cols-1 gap-[3px] bg-white md:auto-rows-[minmax(200px,18vw)] md:grid-flow-dense md:grid-cols-12 md:gap-[3px]">
              {effectiveItems.map((item, index) => {
                const placement = placementFor(item, index)
                const mobileAspect = aspectClassFor(item, index)

                return (
                  <motion.button
                    key={`${item.id}-${index}`}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35) }}
                    whileHover={{ scale: wide ? 1.008 : 1 }}
                    className={`group relative w-full overflow-hidden rounded-none bg-[#e8e4dc] ${mobileAspect} min-h-[200px] md:aspect-auto md:min-h-0`}
                    style={placement}
                    onClick={() =>
                      onOpenItem({
                        section: sectionForModal,
                        item,
                        index,
                      })
                    }
                  >
                    <img
                      src={driveImageUrl(item.id)}
                      alt={item.title || ''}
                      className="h-full w-full object-cover transition duration-500 group-hover:brightness-[0.97]"
                      loading="lazy"
                      onLoad={(e) => onImgLoad(index, e)}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = FALLBACK_IMG
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    {item.title && (
                      <span className="pointer-events-none absolute bottom-2 left-2 right-2 font-[family-name:var(--font-display)] text-sm text-white opacity-0 drop-shadow-md transition duration-300 group-hover:opacity-100 md:text-base">
                        {item.title}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

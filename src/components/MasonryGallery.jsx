import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { galleryThumbnailSrc, onDriveImageError, STATIC_IMG_FALLBACK } from '../utils/driveUrls'
import {
  autoGridPlacement,
  computeMasonryDisplayOrder,
  getImageOrientation,
  loadingGridPlacement,
} from '../utils/masonryLayout'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { fetchDriveProxyImageList } from '../services/driveImageProxy.js'

/** Default Worker base; override with `VITE_DRIVE_IMAGE_PROXY_URL` or `section.driveImageProxyBase`. */
const DEFAULT_DRIVE_IMAGE_PROXY_URL = 'https://drive-image-proxy.sidaxy.workers.dev'

/** Spreads thumbnail requests slightly when not using explicit imageSrc (legacy). */
const MASONRY_DRIVE_THUMB_W = 1024
const IMG_TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function MasonryItemImage({ item, visualIndex, className, onImgLoad, onImgError }) {
  const hasGridUrl =
    (typeof item.thumbnailSrc === 'string' && item.thumbnailSrc.trim()) ||
    (typeof item.imageSrc === 'string' && item.imageSrc.trim())
  const [src, setSrc] = useState(() =>
    hasGridUrl ? galleryThumbnailSrc(item, MASONRY_DRIVE_THUMB_W) : IMG_TRANSPARENT_PIXEL,
  )

  useEffect(() => {
    if (hasGridUrl) return undefined
    const ms = Math.min(visualIndex * 140, 3000)
    const timer = window.setTimeout(() => {
      setSrc(galleryThumbnailSrc(item, MASONRY_DRIVE_THUMB_W))
    }, ms)
    return () => clearTimeout(timer)
  }, [visualIndex, hasGridUrl, item.id, item.imageSrc, item.thumbnailSrc])

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 2) return
        onImgLoad(item, e)
      }}
      onError={onImgError}
    />
  )
}

/**
 * Editorial masonry: cream panel, white hairline gutters, sharp corners.
 * Images load from Cloudflare Worker proxy (`GET /list` + `GET /{filename}`).
 */
export default function MasonryGallery({
  section,
  onOpenItem,
  driveFolderId: _driveFolderIdProp,
  sectionClassName = '',
  restrictFolderToProps: _restrictFolderToProps = false,
}) {
  const wide = useMediaQuery('(min-width: 768px)')
  const autoLayout = section.masonryLayout !== 'manual'

  const proxyBase = useMemo(() => {
    const fromSection = typeof section.driveImageProxyBase === 'string' ? section.driveImageProxyBase.trim() : ''
    const fromEnv = import.meta.env.VITE_DRIVE_IMAGE_PROXY_URL?.trim() || ''
    return fromSection || fromEnv || DEFAULT_DRIVE_IMAGE_PROXY_URL
  }, [section.driveImageProxyBase])

  /** Optional Worker `?folder=` for a second Drive folder (e.g. sprinkle-season uses `2`). Bump Era omits this. */
  const proxyFolder = section.driveImageProxyFolder

  const [loadState, setLoadState] = useState(() => ({ status: 'loading' }))

  /** Natural sizes when metadata is measured client-side — keyed by file id for stable order when using `masonryRhythm`. */
  const [measuredById, setMeasuredById] = useState({})

  useEffect(() => {
    let cancelled = false
    startTransition(() => setLoadState({ status: 'loading' }))
    fetchDriveProxyImageList(proxyBase, { folder: proxyFolder })
      .then((items) => {
        if (!cancelled) {
          startTransition(() => {
            setLoadState({ status: 'ready', items })
            setMeasuredById({})
          })
        }
      })
      .catch((err) => {
        if (!cancelled) startTransition(() => setLoadState({ status: 'error', error: err }))
      })
    return () => {
      cancelled = true
    }
  }, [proxyBase, proxyFolder])

  const effectiveItems = useMemo(() => {
    if (loadState.status === 'ready') return loadState.items ?? []
    if (loadState.status === 'error') return section.items ?? []
    return []
  }, [loadState, section.items])

  const sectionForModal = useMemo(
    () => ({ ...section, items: effectiveItems }),
    [section, effectiveItems],
  )

  const dimsFor = useCallback(
    (item) => {
      if (item.width && item.height) return { w: item.width, h: item.height }
      const id = item.id
      if (id && measuredById[id]) return measuredById[id]
      return null
    },
    [measuredById],
  )

  const onImgLoad = useCallback((item, e) => {
    const el = e.currentTarget
    const w = el.naturalWidth
    const h = el.naturalHeight
    if (!w || !h || !item.id) return
    setMeasuredById((prev) => {
      if (prev[item.id]?.w === w && prev[item.id]?.h === h) return prev
      return { ...prev, [item.id]: { w, h } }
    })
  }, [])

  const displayOrder = useMemo(() => {
    if (!section.masonryRhythm || effectiveItems.length === 0) {
      return effectiveItems.map((_, i) => i)
    }
    const chunkSize = section.masonryRhythmChunkSize
    return computeMasonryDisplayOrder(effectiveItems, measuredById, {
      chunkSize: typeof chunkSize === 'number' && chunkSize >= 2 ? chunkSize : undefined,
    })
  }, [effectiveItems, measuredById, section.masonryRhythm, section.masonryRhythmChunkSize])

  const placementFor = (item) => {
    if (!wide) return { gridColumn: '1 / -1' }

    if (!autoLayout && item.gridColumn && item.gridRow) {
      return { gridColumn: item.gridColumn, gridRow: item.gridRow }
    }

    if (item.layout === 'manual' && item.gridColumn && item.gridRow) {
      return { gridColumn: item.gridColumn, gridRow: item.gridRow }
    }

    const m = dimsFor(item)
    const ratio = m ? m.w / m.h : null
    if (ratio == null) return loadingGridPlacement()
    return autoGridPlacement(ratio)
  }

  const aspectClassFor = (item) => {
    const m = dimsFor(item)
    if (!m) return 'aspect-[3/2]'
    const o = getImageOrientation(m.w, m.h)
    if (o === 'portrait') return 'aspect-[2/3]'
    if (o === 'landscape') return 'aspect-[3/2]'
    return 'aspect-square'
  }

  const showLoading = loadState.status === 'loading'
  const showError = loadState.status === 'error'
  const showEmpty = loadState.status === 'ready' && effectiveItems.length === 0

  return (
    <section
      id={section.id}
      className={`scroll-mt-6 border-y border-black/5 bg-[#f4f0e8] py-10 text-[#2a2826] md:scroll-mt-8 md:py-14 ${sectionClassName}`.trim()}
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
            Could not load photos. Showing backup list from config if available.
          </p>
        )}
        {showEmpty && (
          <p className="mb-6 font-[family-name:var(--font-body)] text-sm text-black/50">
            No images found.
          </p>
        )}

        {!showLoading && effectiveItems.length > 0 && (
          <div className="rounded-none bg-white p-[4px] md:p-1">
            <div className="grid grid-cols-1 gap-[3px] bg-white md:auto-rows-[minmax(200px,18vw)] md:grid-flow-dense md:grid-cols-12 md:gap-[3px]">
              {displayOrder.map((originalIndex, visualIndex) => {
                const item = effectiveItems[originalIndex]
                const placement = placementFor(item)
                const mobileAspect = aspectClassFor(item)

                return (
                  <motion.button
                    key={`${item.id}-${originalIndex}`}
                    type="button"
                    aria-label={`Open photo ${originalIndex + 1} of ${effectiveItems.length}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: Math.min(visualIndex * 0.04, 0.35) }}
                    whileHover={{ scale: wide ? 1.008 : 1 }}
                    className={`group relative w-full overflow-hidden rounded-none bg-[#e8e4dc] ${mobileAspect} min-h-[200px] md:aspect-auto md:min-h-0`}
                    style={placement}
                    onClick={() =>
                      onOpenItem({
                        section: sectionForModal,
                        item,
                        index: originalIndex,
                      })
                    }
                  >
                    <MasonryItemImage
                      item={item}
                      visualIndex={visualIndex}
                      className="h-full w-full object-cover transition duration-500 group-hover:brightness-[0.97]"
                      onImgLoad={onImgLoad}
                      onImgError={(e) => onDriveImageError(e, item, STATIC_IMG_FALLBACK)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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

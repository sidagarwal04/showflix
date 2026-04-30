/**
 * Drive / `<img>` natural dimensions → CSS Grid placement.
 *
 * Matches a “Weddfix-style” 3-column gallery:
 * - Three equal columns → each tile is `span 4` on a 12-column grid.
 * - Landscape (~3:2): one row track — reads as a medium-wide frame in its column.
 * - Portrait (~2:3): two row tracks — twice the height of one landscape band so a
 *   column can show either one portrait or two stacked landscapes (same total height).
 * - Very wide panoramas: full-bleed `span 12` × 1 row.
 *
 * Uses `grid-auto-flow: dense` on the gallery so mixed orientations pack cleanly.
 */

/** @typedef {'landscape' | 'portrait' | 'square' | 'unknown'} ImageOrientation */

/**
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @returns {ImageOrientation}
 */
export function getImageOrientation(naturalWidth, naturalHeight) {
  if (!naturalWidth || !naturalHeight) return 'unknown'
  const r = naturalWidth / naturalHeight
  if (r > 1.06) return 'landscape'
  if (r < 0.94) return 'portrait'
  return 'square'
}

/**
 * Map aspect ratio to `grid-column` / `grid-row` span strings (12-column grid).
 * Single-column width is always 4/12 ≈ one of three equal columns.
 *
 * @param {number} ratio naturalWidth / naturalHeight
 * @returns {{ gridColumn: string, gridRow: string }}
 */
export function autoGridPlacement(ratio) {
  // Full-width banner (very wide / panoramic)
  if (ratio >= 1.9) {
    return { gridColumn: 'span 12', gridRow: 'span 1' }
  }

  // Landscape & square: one “band” tall — classic ~3:2 row in a column
  if (ratio >= 0.94) {
    return { gridColumn: 'span 4', gridRow: 'span 1' }
  }

  // Portrait: two row bands (~2:3 in a fixed column)
  if (ratio >= 0.55) {
    return { gridColumn: 'span 4', gridRow: 'span 2' }
  }

  // Extremely tall phone crops
  return { gridColumn: 'span 4', gridRow: 'span 3' }
}

/** Placeholder before decode: one column, landscape band (matches a typical top-row tile). */
export function loadingGridPlacement() {
  return { gridColumn: 'span 4', gridRow: 'span 1' }
}

/**
 * Classify for ordering (slightly looser than {@link getImageOrientation} for grid bands).
 * @param {number} w
 * @param {number} h
 * @returns {'banner' | 'landscape' | 'portrait' | 'unknown'}
 */
function kindForOrder(w, h) {
  if (!w || !h) return 'unknown'
  const r = w / h
  if (r >= 1.9) return 'banner'
  if (r >= 1.06) return 'landscape'
  if (r < 0.94) return 'portrait'
  return 'landscape'
}

/**
 * One contiguous block of items (local indices `0..n-1`).
 *
 * @param {Array<{ id?: string, width?: number, height?: number }>} items
 * @param {Record<string, { w: number, h: number }>} sizeById
 * @returns {number[]} visual order → **local** index
 */
function computeMasonryDisplayOrderSingle(items, sizeById) {
  const n = items.length
  if (n <= 1) return items.map((_, i) => i)

  const meta = items.map((item, i) => {
    const w = item.width ?? sizeById[item.id]?.w ?? 0
    const h = item.height ?? sizeById[item.id]?.h ?? 0
    return { i, kind: kindForOrder(w, h) }
  })

  const banner = []
  const portrait = []
  const landscape = []
  const unknown = []

  for (const m of meta) {
    if (m.kind === 'banner') banner.push(m.i)
    else if (m.kind === 'portrait') portrait.push(m.i)
    else if (m.kind === 'landscape') landscape.push(m.i)
    else unknown.push(m.i)
  }

  const headL = landscape.slice(0, Math.min(3, landscape.length))
  const restL = landscape.slice(headL.length)

  const interleaved = []
  let pi = 0
  let ri = 0
  while (pi < portrait.length || ri < restL.length) {
    for (let k = 0; k < 2 && pi < portrait.length; k++) interleaved.push(portrait[pi++])
    if (ri < restL.length) interleaved.push(restL[ri++])
  }

  let order = [...headL, ...interleaved, ...unknown]

  const sortedBanners = [...banner].sort((a, b) => a - b)
  sortedBanners.forEach((bIdx, j) => {
    const insertAt = Math.min(3 + j * 7, order.length)
    order.splice(insertAt, 0, bIdx)
  })

  const seen = new Set(order)
  for (let i = 0; i < n; i++) {
    if (!seen.has(i)) order.push(i)
  }

  return order
}

/**
 * Reorder gallery indices for layout rhythm. Optional **`chunkSize`**: only reorder **within**
 * consecutive chunks of the **folder order** list so chronological story is preserved in blocks
 * (used for Gallery Two).
 *
 * @param {Array<{ id?: string, width?: number, height?: number }>} items — **folder / API order**
 * @param {Record<string, { w: number, h: number }>} sizeById
 * @param {{ chunkSize?: number }} [options] — e.g. `{ chunkSize: 12 }` for 12-at-a-time rhythm
 * @returns {number[]} permutation: **visual order → original index** in `items`
 */
export function computeMasonryDisplayOrder(items, sizeById = {}, options = {}) {
  const n = items.length
  if (n <= 1) return items.map((_, i) => i)

  const chunkSize = options.chunkSize
  if (!chunkSize || chunkSize < 2 || n <= chunkSize) {
    return computeMasonryDisplayOrderSingle(items, sizeById)
  }

  const out = []
  for (let start = 0; start < n; start += chunkSize) {
    const slice = items.slice(start, start + chunkSize)
    const local = computeMasonryDisplayOrderSingle(slice, sizeById)
    for (const li of local) {
      out.push(start + li)
    }
  }
  return out
}

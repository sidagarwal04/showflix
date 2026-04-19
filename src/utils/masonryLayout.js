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

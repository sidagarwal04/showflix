/**
 * SR Originals — media manifest (Google Drive public links + optional YouTube hero)
 * ---------------------------------------------------------------------------
 * HOW TO UPDATE
 * 1. Upload photos/videos to Google Drive.
 * 2. Share each file: "Anyone with the link" → Viewer.
 * 3. Copy the FILE_ID from the share URL:
 *    https://drive.google.com/file/d/FILE_ID/view
 *    or from: https://drive.google.com/open?id=FILE_ID
 * 4. Paste ids into `videoId` / `items[].id`, OR use Drive API folder mode for masonry:
 *    set `VITE_GOOGLE_DRIVE_API_KEY` and `VITE_GOOGLE_DRIVE_FOLDER_ID` in `.env.local` / Netlify (see `.env.example`).
 *
 * URL formats used in the app:
 *   Images:  https://drive.google.com/uc?export=view&id=FILE_ID
 *   Video embed (iframe): https://drive.google.com/file/d/FILE_ID/preview
 *
 * PLACEHOLDER IDS: Sample public assets / short clips so the UI works before
 * you swap in real family media. Replace every id with your own.
 */

/** Public sample MP4 (W3C test asset) — swap for your Drive `videoId` in production. */
export const PLACEHOLDER_HERO_VIDEO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const mediaConfig = {
  brandName: 'SR Originals',

  hero: {
    /**
     * Hero background + Play modal: YouTube (takes priority when set).
     * Paste a full URL or the 11-char id — both work via `parseYoutubeVideoId` in Hero.
     */
    youtubeUrl: 'https://www.youtube.com/watch?v=BniuMV3YjTk',

    // Google Drive file id when not using YouTube / placeholder MP4 below
    videoId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    /** If true (and no YouTube), Hero uses PLACEHOLDER_HERO_VIDEO_SRC instead of Drive. */
    usePlaceholderVideo: false,
    title: 'Our Story',
    subtitle: 'A FAMILY ORIGINAL',
    description:
      'A cinematic scrapbook of love, anticipation, and the quiet magic before our little one arrived. Press play when you are ready.',
    tags: ['Love', 'Family', 'New Beginnings'],
  },

  sections: [
    /*
     * 🤰 Maternity Films (video carousel) — uncomment when you have short clips / reels ready.
     * ---------------------------------------------------------------------------
    {
      id: 'maternity-films',
      title: '🤰 Maternity Films',
      type: 'video',
      items: [
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'First Kicks',
          description: 'Short film — morning light and nursery plans.',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Bump Diary',
          description: 'Week-by-week memories.',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Lullaby',
          description: 'A soft moment before the world got louder.',
        },
      ],
    },
    */
    {
      id: 'maternity-shoot',
      /**
       * Masonry: `auto` measures each image after load and assigns wide vs tall grid spans.
       * Set `masonryLayout: 'manual'` and per-item `gridColumn` / `gridRow` to hand-place tiles.
       * Single-item override: `layout: 'manual'` + `gridColumn` / `gridRow` on that item only.
       */
      kicker: "Spoiler: the finale's adorable",
      title: "🔥 Bump Era - Director's Cut",
      type: 'masonry',
      masonryLayout: 'auto',
      /** Fallback when API key is missing or fetch fails; Drive folder comes from env only (`VITE_GOOGLE_DRIVE_FOLDER_ID`). */
      items: [
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 1',
          description: 'Replace id with your Drive file id',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 2',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 3',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 4',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 5',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 6',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 7',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 8',
        },
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Frame 9',
        },
      ],
    },
    {
      id: 'little-moments',
      title: '✨ Little Moments',
      type: 'photo',
      items: [
        {
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          title: 'Coming soon',
          description: 'First smiles, tiny toes, and everyday magic.',
        },
      ],
    },
  ],
}

/** `/sprinkle-season` — masonry only; folder id from `VITE_GOOGLE_DRIVE_FOLDER_ID_BABY_SHOWER`. */
export const sprinkleSeasonGallerySection = {
  id: 'sprinkle-season',
  kicker: "The guest list, on film",
  title: "🎀 Sprinkle Season · The Preview Cut",
  type: 'masonry',
  masonryLayout: 'auto',
  /** Matches Drive web “Name” order: natural sort so `…2.jpg` comes before `…10.jpg` (plain `name` does not). */
  driveListOrderBy: 'name_natural',
  items: [
    {
      id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      title: 'Placeholder',
      description: 'Loads from Drive when API key + folder env are set.',
    },
  ],
}

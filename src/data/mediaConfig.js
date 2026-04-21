/**
 * SR Originals — media manifest (Worker image proxy + optional YouTube hero)
 * ---------------------------------------------------------------------------
 * Masonry galleries load from the Cloudflare Worker (`GET /list` + `GET /{filename}`).
 * Optional `section.driveImageProxyFolder` adds `?folder=` to list and image URLs (see sprinkle-season).
 *
 * Hero video when not using YouTube: optional Drive `videoId` or placeholder MP4.
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
    youtubeUrl: 'https://youtu.be/fuK43aXcrp8',

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
      /** Fallback if `/list` fails (normally populated from the Worker). */
      items: [],
    },
    /*
     * ✨ Little Moments — uncomment when this section is ready.
     * ---------------------------------------------------------------------------
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
    */
  ],
}

/** `/sprinkle-season` — second Drive folder via Worker `?folder=2`. */
export const sprinkleSeasonGallerySection = {
  id: 'sprinkle-season',
  kicker: "The guest list, on film",
  title: "🎀 Sprinkle Season · The Preview Cut",
  type: 'masonry',
  masonryLayout: 'auto',
  driveImageProxyFolder: '2',
  items: [],
}

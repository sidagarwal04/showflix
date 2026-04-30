/**
 * ShowFlix  media manifest (Worker image proxy + optional YouTube hero)
 * ---------------------------------------------------------------------------
 * Hero video when not using YouTube: optional Drive `videoId` or placeholder MP4.
 */

const fallbackItems = [
  { id: 'img1', imageSrc: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=800&q=80' }, // Landscape
  { id: 'img2', imageSrc: 'https://images.unsplash.com/photo-1497215848147-380d1d2b826b?auto=format&fit=crop&w=800&h=1200&q=80' }, // Portrait
  { id: 'img3', imageSrc: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&h=1200&q=80' }, // Portrait
  { id: 'img4', imageSrc: 'https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?auto=format&fit=crop&w=1200&h=800&q=80' }, // Landscape
  { id: 'img5', imageSrc: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&h=1000&q=80' }, // Square
  { id: 'img6', imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1200&q=80' }, // Portrait
  { id: 'img7', imageSrc: 'https://images.unsplash.com/photo-1470071131384-001b85755b36?auto=format&fit=crop&w=1200&h=800&q=80' }, // Landscape
  { id: 'img8', imageSrc: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&h=800&q=80' }, // Landscape
  { id: 'img9', imageSrc: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&h=1200&q=80' }, // Portrait
  { id: 'img10', imageSrc: 'https://images.unsplash.com/photo-1520333789090-1afc82d414f5?auto=format&fit=crop&w=1000&h=1000&q=80' }, // Square
  { id: 'img11', imageSrc: 'https://images.unsplash.com/photo-1516589178582-19bb01e05d2c?auto=format&fit=crop&w=800&h=1200&q=80' }, // Portrait
  { id: 'img12', imageSrc: 'https://images.unsplash.com/photo-1504159506876-276ce56616a2?auto=format&fit=crop&w=1200&h=800&q=80' }, // Landscape
];

/** Public sample MP4 (W3C test asset)  swap for your Drive `videoId` in production. */
export const PLACEHOLDER_HERO_VIDEO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const mediaConfig = {
  brandName: 'ShowFlix',

  hero: {
    /**
     * Hero background: full-bleed autoplay (muted until user unmutes). Use a full watch / youtu.be
     * URL or the 11-char id.
     */
    youtubeUrl: 'https://www.youtube.com/watch?v=BniuMV3YjTk',
    /**
     * Play button opens this in the modal (with sound). If omitted, falls back to `youtubeUrl`.
     */
    youtubePlayUrl: 'https://www.youtube.com/watch?v=BniuMV3YjTk',

    // Google Drive file id when not using YouTube / placeholder MP4 below
    videoId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    /** If true (and no YouTube), Hero uses PLACEHOLDER_HERO_VIDEO_SRC instead of Drive. */
    usePlaceholderVideo: false,
    title: 'Hero Title',
    subtitle: 'A Special Presentation',
    description: 'A collection of our favorite moments. Press play to begin.',
    tags: ['Tag One', 'Tag Two', 'Tag Three'],
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
      kicker: "First Collection",
      title: "Gallery One",
      type: 'masonry',
      masonryLayout: 'auto',
      items: fallbackItems,
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

/** `/gallery-two`  second Drive folder via Worker `?folder=2`. */
export const galleryTwoSection = {
  id: 'gallery-two',
  kicker: "Second Collection",
  title: "Gallery Two",
  type: 'masonry',
  masonryLayout: 'auto',
  items: fallbackItems,
}

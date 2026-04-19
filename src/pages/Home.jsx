import { useState } from 'react'
import Hero from '../components/Hero'
import CarouselRow from '../components/Carousel'
import MasonryGallery from '../components/MasonryGallery'
import Modal from '../components/Modal'
import { mediaConfig, PLACEHOLDER_HERO_VIDEO_SRC } from '../data/mediaConfig'
import { parseYoutubeVideoId } from '../utils/youtube'

/**
 * Main hub: hero + Netflix-style rows driven entirely by `mediaConfig`.
 */
export default function Home() {
  const { hero, sections } = mediaConfig

  const [modal, setModal] = useState(null)
  const [moreInfo, setMoreInfo] = useState(false)

  const openFromGallery = ({ section, item, index }) => {
    if (section.type === 'video') {
      setModal({
        kind: 'video',
        fileId: item.id,
        title: item.title,
        description: item.description,
      })
      return
    }
    const items = section.items
    setModal({
      kind: 'photo',
      sectionId: section.id,
      items,
      item,
      index,
      total: items.length,
    })
  }

  const openHeroPlay = () => {
    const ytId = parseYoutubeVideoId(hero.youtubeUrl || hero.youtubeVideoId || '')
    if (ytId) {
      setModal({
        kind: 'youtube',
        youtubeId: ytId,
        title: hero.title,
        description: hero.description,
      })
      return
    }
    if (hero.usePlaceholderVideo) {
      setModal({
        kind: 'stream',
        src: PLACEHOLDER_HERO_VIDEO_SRC,
        title: hero.title,
        description: hero.description,
      })
      return
    }
    setModal({
      kind: 'video',
      fileId: hero.videoId,
      title: hero.title,
      description: hero.description,
    })
  }

  const closeModal = () => setModal(null)

  const stepPhoto = (delta) => {
    setModal((m) => {
      if (!m || m.kind !== 'photo') return m
      const nextIndex = (m.index + delta + m.items.length) % m.items.length
      return {
        ...m,
        index: nextIndex,
        item: m.items[nextIndex],
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#141414] pb-20">
      <Hero
        hero={hero}
        onPlay={openHeroPlay}
        onMoreInfo={() => setMoreInfo(true)}
      />

      <div className="relative z-20 space-y-0">
        {sections.map((section) =>
          section.type === 'masonry' ? (
            <MasonryGallery key={section.id} section={section} onOpenItem={openFromGallery} />
          ) : (
            <CarouselRow key={section.id} section={section} onOpenItem={openFromGallery} />
          ),
        )}
      </div>

      <Modal
        state={modal}
        onClose={closeModal}
        onPrev={modal?.kind === 'photo' ? () => stepPhoto(-1) : undefined}
        onNext={modal?.kind === 'photo' ? () => stepPhoto(1) : undefined}
      />

      {moreInfo && (
        <button
          type="button"
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setMoreInfo(false)}
          aria-label="Close details"
        >
          <div
            role="dialog"
            className="max-w-lg rounded-md border border-white/10 bg-[#141414] p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-[family-name:var(--font-display)] text-3xl text-white">{hero.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#EBEBEB]/90">{hero.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">Genres</p>
            <p className="mt-1 text-sm text-white/80">{hero.tags.join(' • ')}</p>
            <button
              type="button"
              className="mt-6 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-black"
              onClick={() => setMoreInfo(false)}
            >
              Close
            </button>
          </div>
        </button>
      )}
    </main>
  )
}

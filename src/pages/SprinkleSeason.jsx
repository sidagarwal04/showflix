import { useCallback, useMemo, useState } from 'react'
import BackToTop from '../components/BackToTop'
import MasonryGallery from '../components/MasonryGallery'
import Modal from '../components/Modal'
import { sprinkleSeasonGallerySection } from '../data/mediaConfig'

/**
 * `/gallery-two` — standalone gallery (Gallery One-style heading + masonry).
 * Images from Cloudflare Worker (`VITE_DRIVE_IMAGE_PROXY_URL` or default base URL).
 */
export default function GalleryTwo() {
  const section = useMemo(() => sprinkleSeasonGallerySection, [])

  const [modal, setModal] = useState(null)

  const openFromGallery = useCallback(({ section: sec, item, index }) => {
    const items = sec.items
    setModal({
      kind: 'photo',
      sectionId: sec.id,
      items,
      item,
      index,
      total: items.length,
    })
  }, [])

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
      <MasonryGallery
        section={section}
        onOpenItem={openFromGallery}
        sectionClassName="!border-t-0 pt-5 md:pt-7"
      />

      <BackToTop />

      <Modal
        state={modal}
        onClose={closeModal}
        onPrev={modal?.kind === 'photo' ? () => stepPhoto(-1) : undefined}
        onNext={modal?.kind === 'photo' ? () => stepPhoto(1) : undefined}
      />
    </main>
  )
}

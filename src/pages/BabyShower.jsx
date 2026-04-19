import { useCallback, useMemo, useState } from 'react'
import MasonryGallery from '../components/MasonryGallery'
import Modal from '../components/Modal'
import { babyShowerGallerySection } from '../data/mediaConfig'

/**
 * Standalone gallery: starts below the nav with a Bump Era–style kicker + title, then the masonry grid.
 * Images load from `VITE_GOOGLE_DRIVE_FOLDER_ID_BABY_SHOWER` (see `.env.example`).
 */
export default function BabyShower() {
  const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID_BABY_SHOWER?.trim() || ''
  const section = useMemo(() => babyShowerGallerySection, [])

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
        driveFolderId={folderId}
        restrictFolderToProps
        onOpenItem={openFromGallery}
        sectionClassName="!border-t-0 pt-5 md:pt-7"
      />

      <Modal
        state={modal}
        onClose={closeModal}
        onPrev={modal?.kind === 'photo' ? () => stepPhoto(-1) : undefined}
        onNext={modal?.kind === 'photo' ? () => stepPhoto(1) : undefined}
      />
    </main>
  )
}

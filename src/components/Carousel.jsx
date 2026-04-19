import { useRef } from 'react'
import Card from './Card'

export default function CarouselRow({ section, onOpenItem }) {
  const scrollerRef = useRef(null)

  return (
    <section id={section.id} className="mb-10 scroll-mt-24 md:mb-14">
      <h2 className="mb-4 px-4 text-lg font-semibold text-white md:px-10 md:text-xl">
        {section.title}
      </h2>
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:gap-4 md:px-10"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {section.items.map((item, index) => (
          <Card
            key={item.id + index}
            item={item}
            variant={section.type === 'video' ? 'video' : 'photo'}
            layoutId={`${section.id}-${item.id}-${index}`}
            onOpen={(it) =>
              onOpenItem({
                section,
                item: it,
                index,
              })
            }
          />
        ))}
      </div>
    </section>
  )
}

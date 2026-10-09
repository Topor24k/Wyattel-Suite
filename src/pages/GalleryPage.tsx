import { useEffect } from 'react'
import { Expand } from 'lucide-react'
import { galleryPhotos, type GalleryPhoto } from '../data/photos'
import { PageHeader } from '../components/ui/PageHeader'
import { Picture } from '../components/ui/Picture'
import { containerClass } from '../components/ui/Section'
import { cx } from '../utils/cx'
import { pad } from '../utils/format'

type Props = { search: string; onView: (photos: GalleryPhoto[], id: string) => void }

const chapters = [
  { category: 'Hotel', id: 'gallery-hotel', title: 'The art of arriving.', note: 'A familiar welcome, before you even step inside.' },
  { category: 'Suites', id: 'gallery-suites', title: 'Rooms with a point of view.', note: 'Little details. Quiet corners. A space to make your own.' },
  { category: 'Weddings', id: 'gallery-weddings', title: 'The beginning of something.', note: 'A setting for the moments you will want to remember.' },
  { category: 'Dining', id: 'gallery-dining', title: 'A seat at our table.', note: 'View and zoom the Filipino menu. Confirm current dishes and prices with the hotel.' },
]

function PhotoTile({ photo, onOpen }: { photo: GalleryPhoto; onOpen: () => void }) {
  const contain = photo.fit === 'contain'
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${photo.caption}`}
      aria-haspopup="dialog"
      data-photo={photo.id}
      data-fit={contain ? 'contain' : 'cover'}
      className="group relative mb-2 block w-full break-inside-avoid overflow-hidden bg-cream-200 transition-[scale] duration-150 active:scale-98 max-md:rounded-xl sm:mb-4"
    >
      <Picture
        src={photo.src}
        alt={photo.alt}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        placeholder={!contain}
        className={cx('w-full transition-transform duration-300 ease-out-soft group-hover:scale-105 motion-reduce:transform-none', contain ? 'object-contain p-4' : 'object-cover')}
      />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-navy-950/80 to-transparent p-4 pt-12 text-left text-sm text-cream-50 opacity-100 transition-opacity duration-200 max-md:hidden md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        {photo.caption}
        <Expand aria-hidden="true" size={16} strokeWidth={1.5} className="shrink-0" />
      </span>
    </button>
  )
}

export default function GalleryPage({ search, onView }: Props) {
  // Older dining links now scroll to a chapter instead of hiding other photos.
  useEffect(() => {
    const chapter = chapters.find((item) => item.category === new URLSearchParams(search).get('category'))
    if (!chapter || window.location.hash) return
    const timer = window.setTimeout(() => document.getElementById(chapter.id)?.scrollIntoView(), 80)
    return () => window.clearTimeout(timer)
  }, [search])

  return (
    <>
      <PageHeader
        id="gallery"
        eyebrow="The Wyattel collection"
        title={<>A closer <em>look.</em></>}
        description="Our suites, welcoming spaces, wedding moments, and Filipino dining, in photographs. Select any image to view it in full."
      >
        <nav aria-label="Gallery chapters" className="mt-8 flex flex-wrap gap-2 max-md:-mx-4 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-4 sm:max-md:-mx-8 sm:max-md:px-8 scrollbar-none">
          {chapters.map((chapter) => (
            <a key={chapter.id} href={`#${chapter.id}`} className="inline-flex min-h-10 shrink-0 items-center border border-ink/20 px-4 max-md:rounded-full text-eyebrow font-semibold uppercase text-navy-950 transition-colors hover:border-navy-950 hover:bg-navy-950 hover:text-cream-50">
              {chapter.category}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className={cx(containerClass, 'pb-20 md:pb-32')}>
        {chapters.map((chapter, index) => {
          const photos = galleryPhotos.filter((photo) => photo.category === chapter.category)
          return (
            <section key={chapter.id} id={chapter.id} data-chapter={chapter.category} aria-labelledby={`${chapter.id}-title`} className="grid scroll-mt-24 gap-6 border-t border-ink/15 py-10 first:border-t-0 md:gap-10 md:py-20 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <p className="text-eyebrow font-semibold uppercase text-gold-700">{pad(index + 1)} · {chapter.category} · {photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
                  <h2 id={`${chapter.id}-title`} className="mt-3 text-title tracking-tight text-navy-950 md:mt-4 md:text-heading">{chapter.title}</h2>
                  <p className="mt-3 max-w-sm text-sm text-ink-muted md:mt-4 md:text-base">{chapter.note}</p>
                </div>
              </div>
              <div className={cx('lg:col-span-8', photos.length > 1 && 'columns-2 gap-2 sm:gap-4')}>
                {photos.map((photo) => <PhotoTile key={photo.id} photo={photo} onOpen={() => onView(galleryPhotos, photo.id)} />)}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

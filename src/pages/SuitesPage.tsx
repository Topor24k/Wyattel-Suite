import { Images } from 'lucide-react'
import { rooms } from '../data'
import { photosForRoom, type GalleryPhoto } from '../data/photos'
import { PageHeader } from '../components/ui/PageHeader'
import { Picture } from '../components/ui/Picture'
import { Button, ButtonLink } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import type { OpenBooking, Room } from '../types'
import { roomPath } from '../utils/siteRoutes'
import { formatRate, pad } from '../utils/format'
import { cx } from '../utils/cx'

type ViewPhotos = (photos: GalleryPhoto[], id: string) => void

function SuiteCard({ room, index, onView, onBook }: { room: Room; index: number; onView: ViewPhotos; onBook: OpenBooking }) {
  const { photos, representative } = photosForRoom(room)
  const cover = photos[0]
  const reversed = index % 2 === 1
  return (
    <article data-suite={room.name} aria-labelledby={`suite-${index}-title`} className="reveal grid md:gap-8 md:border-t md:border-ink/15 md:py-20 md:first:border-t-0 lg:grid-cols-12 lg:items-center lg:gap-8 max-md:mb-5 max-md:overflow-hidden max-md:rounded-3xl max-md:bg-cream-50 max-md:shadow-sm">
      <div className={cx('relative lg:col-span-7', reversed && 'lg:col-start-6 lg:row-start-1')}>
        {cover && (
          <button
            type="button"
            onClick={() => onView(photos, cover.id)}
            aria-label={`View ${room.name} photos`}
            aria-haspopup="dialog"
            className="group block w-full overflow-hidden"
          >
            <Picture
              src={cover.src}
              alt={cover.alt}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-4/3 w-full object-cover transition-transform duration-300 md:aspect-3/2 ease-out-soft group-hover:scale-105 motion-reduce:transform-none"
            />
            <span className="absolute bottom-4 left-4 inline-flex min-h-10 items-center gap-2 bg-cream-50 px-4 max-md:rounded-full text-eyebrow font-semibold uppercase text-navy-950">
              <Images aria-hidden="true" size={14} strokeWidth={1.5} />
              {representative ? 'Representative photo' : `${photos.length} photos`}
            </span>
          </button>
        )}
      </div>

      <div className={cx('max-md:px-5 max-md:pt-5 max-md:pb-6 lg:col-span-4', reversed ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-9')}>
        <p className="text-eyebrow font-medium uppercase text-gold-700">{pad(index + 1)} — {room.tagline}</p>
        <h2 id={`suite-${index}-title`} className="mt-3 text-title tracking-tight text-navy-950 md:mt-4 md:text-heading">
          <a href={roomPath(room.name)} className="hover:text-navy-700">{room.name}</a>
        </h2>
        <p className="mt-3 text-sm text-ink-muted md:mt-6 md:text-base" data-selectable="true">{room.text}</p>
        <dl className="mt-5 grid grid-cols-2 gap-6 border-t border-ink/15 pt-5 md:mt-8 md:pt-6">
          <div>
            <dt className="text-xs text-ink-muted">Listed rate</dt>
            <dd className="mt-1 font-serif text-title text-navy-950">{formatRate(room.rate)}<span className="font-sans text-xs text-ink-muted"> / night</span></dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Highlights</dt>
            <dd className="mt-1 text-sm text-ink">{room.features.join(' · ')}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 max-md:flex-col max-md:items-stretch md:mt-10">
          <Button arrow onClick={() => onBook({ room: room.name })} className="max-md:rounded-full">Request this suite</Button>
          <ButtonLink variant="text" href={roomPath(room.name)} className="max-md:self-center">Suite details<span className="sr-only"> for {room.name}</span></ButtonLink>
        </div>
      </div>
    </article>
  )
}

export default function SuitesPage({ onView, onBook }: { onView: ViewPhotos; onBook: OpenBooking }) {
  return (
    <>
      <PageHeader
        id="suites"
        eyebrow="Our suites"
        title={<>Find your <em>kind of stay.</em></>}
        description="Five suite types, each with its own character. Take a closer look at every room, then request the one that feels right."
      >
        <p className="mt-6 text-eyebrow font-semibold uppercase text-ink-muted">{pad(rooms.length)} suites · rates confirmed by the hotel</p>
      </PageHeader>
      <div className={cx(containerClass, 'pb-20 md:pb-32')}>
        {rooms.map((room, index) => <SuiteCard key={room.name} room={room} index={index} onView={onView} onBook={onBook} />)}
      </div>
    </>
  )
}

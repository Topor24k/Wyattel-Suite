import { useState } from 'react'
import { Phone } from 'lucide-react'
import type { OpenBooking, Room } from '../types'
import { photosForRoom, type GalleryPhoto } from '../data/photos'
import { rooms } from '../data'
import { hotelPhones } from '../data/site'
import { Picture } from '../components/ui/Picture'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button, ButtonLink } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import { roomPath } from '../utils/siteRoutes'
import { formatRate, pad } from '../utils/format'
import { cx } from '../utils/cx'

type Props = { room: Room; onBook: OpenBooking; onView: (photos: GalleryPhoto[], id: string) => void }

/** Phones: full-width swipeable photos under the floating top bar, as in booking apps. */
function PhotoCarousel({ photos, representative, onOpen }: { photos: GalleryPhoto[]; representative: boolean; onOpen: (id: string) => void }) {
  const [current, setCurrent] = useState(0)
  return (
    <div className="relative md:hidden">
      <div
        role="group"
        aria-label="Suite photographs"
        onScroll={(event) => {
          const rail = event.currentTarget
          setCurrent(Math.round(rail.scrollLeft / Math.max(rail.clientWidth, 1)))
        }}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {photos.map((photo, position) => (
          <button key={photo.id} type="button" onClick={() => onOpen(photo.id)} aria-label={`Open ${photo.caption}`} aria-haspopup="dialog" className="w-full shrink-0 snap-center">
            <Picture src={photo.src} alt={photo.alt} priority={position === 0} sizes="100vw" className="aspect-4/3 w-full object-cover" />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <span aria-hidden="true" className="absolute right-4 bottom-10 rounded-full bg-navy-950/70 px-3 py-1 text-xs tabular-nums text-cream-50 backdrop-blur-sm">
          {current + 1} / {photos.length}
        </span>
      )}
      {representative && (
        <span className="absolute bottom-10 left-4 rounded-full bg-cream-50 px-3 py-1.5 text-eyebrow font-semibold uppercase text-navy-950">Representative photo</span>
      )}
    </div>
  )
}

export default function SuiteDetailPage({ room, onBook, onView }: Props) {
  const { photos, representative } = photosForRoom(room)
  const index = rooms.findIndex((item) => item.name === room.name)
  const previous = rooms[(index - 1 + rooms.length) % rooms.length]
  const next = rooms[(index + 1) % rooms.length]
  const [lead, ...rest] = photos
  const request = () => onBook({ room: room.name })

  return (
    <article aria-labelledby="suite-title" className="pb-24 lg:pb-0">
      <PhotoCarousel photos={photos} representative={representative} onOpen={(id) => onView(photos, id)} />

      {/* On phones the details sit on a rounded sheet that overlaps the photos. */}
      <header className={cx(containerClass, 'relative pt-8 max-md:-mt-6 max-md:rounded-t-3xl max-md:bg-cream-100 md:pt-36')}>
        <ButtonLink href="/suites" variant="text" arrow="back" className="max-md:hidden">All suites</ButtonLink>
        <div className="grid gap-4 md:mt-10 md:gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow rule>Suite {pad(index + 1)} of {pad(rooms.length)} · {room.tagline}</Eyebrow>
            <h1 id="suite-title" tabIndex={-1} data-page-heading className="mt-4 text-heading tracking-tight text-navy-950 md:mt-6 md:text-display">{room.name}</h1>
          </div>
          <p className="font-serif text-lede text-ink-muted lg:col-span-4" data-selectable="true">{room.text}</p>
        </div>
      </header>

      <section aria-label={`${room.name} photographs`} className={cx(containerClass, 'mt-16 max-md:hidden')}>
        <div className={cx('grid gap-3 md:gap-4', rest.length > 0 && 'md:grid-cols-3')}>
          {lead && (
            <button
              type="button"
              onClick={() => onView(photos, lead.id)}
              aria-label={`Open ${lead.caption}`}
              aria-haspopup="dialog"
              className={cx('group relative overflow-hidden', rest.length > 0 && 'md:col-span-2 md:row-span-2')}
            >
              <Picture src={lead.src} alt={lead.alt} priority sizes="(min-width: 768px) 66vw, 100vw" className="aspect-3/2 h-full w-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-105 motion-reduce:transform-none" />
              {representative && (
                <span className="absolute top-4 left-4 bg-cream-50 px-3 py-2 text-eyebrow font-semibold uppercase text-navy-950">Representative photo</span>
              )}
            </button>
          )}
          {rest.map((photo) => (
            <button key={photo.id} type="button" onClick={() => onView(photos, photo.id)} aria-label={`Open ${photo.caption}`} aria-haspopup="dialog" className="group overflow-hidden">
              <Picture src={photo.src} alt={photo.alt} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-3/2 h-full w-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-105 motion-reduce:transform-none" />
            </button>
          ))}
        </div>
        {representative && (
          <p className="mt-4 text-sm text-ink-muted" data-selectable="true">
            A representative Wyattel room is shown. Ask the hotel for current {room.name} photographs.
          </p>
        )}
      </section>

      <section className={cx(containerClass, 'grid gap-14 py-12 md:py-28 lg:grid-cols-12 lg:gap-8')}>
        <div className="lg:col-span-6">
          <Eyebrow rule>Space to settle in</Eyebrow>
          <h2 className="mt-6 text-heading tracking-tight text-navy-950">A stay that feels <em className="text-gold-700">like yours.</em></h2>
          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-sm text-ink-muted">Listed rate</dt>
              <dd className="text-sm text-ink">{formatRate(room.rate)} per night</dd>
            </div>
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-sm text-ink-muted">Highlights</dt>
              <dd className="text-right text-sm text-ink">{room.features.join(" · ")}</dd>
            </div>
          </dl>
          <p className="mt-8 max-w-prose text-sm text-ink-muted" data-selectable="true">
            These are listed reference details. The hotel will confirm current rates, maximum guests, bed arrangements, accessibility needs, and any inclusions before your reservation is confirmed.
          </p>
        </div>

        <aside aria-label="Request this suite" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28 bg-cream-50 p-8">
            <p className="text-eyebrow font-semibold uppercase text-gold-700">Listed from</p>
            <p className="mt-2 font-serif text-heading text-navy-950">{formatRate(room.rate)}</p>
            <p className="text-sm text-ink-muted">per night, confirmed by the hotel</p>
            <Button arrow size="lg" className="mt-8 w-full" onClick={request}>Request this suite</Button>
            <ButtonLink href="/plan-your-stay" variant="text" className="mt-6">Before you arrive</ButtonLink>
            {hotelPhones[0] && (
              <a href={hotelPhones[0].href} className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-6 text-sm text-ink">
                <Phone aria-hidden="true" size={16} strokeWidth={1.5} className="text-gold-700" />
                Prefer to talk? Call {hotelPhones[0].label}
              </a>
            )}
          </div>
        </aside>
      </section>

      {previous && next && (
        <nav aria-label="More suites" className="border-t border-ink/15 bg-cream-200">
          <div className={cx(containerClass, 'grid sm:grid-cols-2')}>
            {[{ label: 'Previous suite', item: previous }, { label: 'Next suite', item: next }].map(({ label, item }, position) => (
              <a key={label} href={roomPath(item.name)} className={cx('group flex flex-col gap-2 py-10 md:py-14', position === 1 && 'border-t border-ink/15 sm:border-t-0 sm:border-l sm:pl-8 sm:text-right')}>
                <span className="text-eyebrow font-semibold uppercase text-gold-700">{label}</span>
                <span className="font-serif text-title text-navy-950 group-hover:text-navy-700">{item.name}</span>
                <span className="text-sm text-ink-muted">{formatRate(item.rate)} per night</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Phones and tablets: keep the request one tap away. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream-50/95 pb-safe backdrop-blur-md lg:hidden">
        <div className={cx(containerClass, 'flex items-center justify-between gap-4 pt-3 pb-3')}>
          <p className="leading-tight">
            <span className="block font-serif text-lede text-navy-950">{formatRate(room.rate)}</span>
            <span className="text-xs text-ink-muted">per night</span>
          </p>
          <Button arrow onClick={request} className="rounded-full">Request this suite</Button>
        </div>
      </div>
    </article>
  )
}

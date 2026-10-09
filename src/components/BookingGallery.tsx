import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Picture } from './ui/Picture'
import { Logo } from './ui/Logo'
import { photosForRoom } from '../data/photos'
import type { Room } from '../types'
import { formatRate, pad } from '../utils/format'
import { cx } from '../utils/cx'

type Props = {
  room: Room
  expanded: boolean
  onExpand: () => void
  onCollapse: () => void
}

/**
 * Suite photo panel beside the booking form. Selecting it widens the panel
 * over the form into a full photo viewer; "Back to booking" or Escape returns
 * to the form exactly as it was left.
 */
export default function BookingGallery({ room, expanded, onExpand, onCollapse }: Props) {
  const { photos, representative } = photosForRoom(room)
  const [index, setIndex] = useState(0)
  const backRef = useRef<HTMLButtonElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)
  const photo = photos[index] ?? photos[0]
  const many = photos.length > 1
  const step = (direction: number) => setIndex((current) => (current + direction + photos.length) % photos.length)

  useEffect(() => {
    if (expanded) backRef.current?.focus({ preventScroll: true })
  }, [expanded])

  useEffect(() => {
    thumbsRef.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [index])

  if (!photo) return null

  return (
    <div
      role={expanded ? 'region' : undefined}
      aria-label={expanded ? `${room.name} photographs` : undefined}
      onKeyDown={(event) => {
        if (!expanded || !many || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
        event.preventDefault()
        step(event.key === 'ArrowRight' ? 1 : -1)
      }}
      className={cx(
        'group/panel absolute inset-y-0 left-0 z-20 overflow-hidden bg-navy-950 text-cream-50 transition-[width] duration-280 ease-out-soft',
        expanded ? 'w-full max-md:animate-fade-in' : 'hidden w-2/5 md:block',
      )}
    >
      {/* One image element for both states, so it stays put while the panel widens. */}
      <Picture
        key={photo.src}
        src={photo.src}
        alt={expanded ? '' : photo.alt}
        sizes={expanded ? '100vw' : '40vw'}
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-280 ease-out-soft',
          expanded ? 'opacity-20' : 'opacity-100 group-hover/panel:scale-105 motion-reduce:transform-none',
        )}
      />

      {expanded ? (
        <div className="absolute inset-0 flex animate-fade-in flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
            <button
              ref={backRef}
              type="button"
              onClick={onCollapse}
              className="group -ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-eyebrow font-semibold uppercase tracking-label hover:text-gold-400"
            >
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.25} className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none" />
              Back to booking
            </button>
            <p className="min-w-0 truncate text-eyebrow font-semibold uppercase text-navy-200">
              {room.name}{representative ? ' · representative photo' : ''}
            </p>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onTouchStart={(event) => { touchX.current = event.touches[0]?.clientX ?? null }}
            onTouchCancel={() => { touchX.current = null }}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX
              if (touchX.current !== null && endX !== undefined && many && Math.abs(endX - touchX.current) > 50) step(endX < touchX.current ? 1 : -1)
              touchX.current = null
            }}
          >
            <Picture
              key={`full-${photo.src}`}
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 1152px) 1000px, 100vw"
              loading="eager"
              placeholder={false}
              className="h-full w-full animate-fade-in object-contain px-4 md:px-24"
            />
            {many && (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy-950/60 hover:bg-cream-50 hover:text-navy-950 md:left-6">
                  <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.25} />
                </button>
                <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy-950/60 hover:bg-cream-50 hover:text-navy-950 md:right-6">
                  <ChevronRight aria-hidden="true" size={22} strokeWidth={1.25} />
                </button>
              </>
            )}
          </div>

          <div className="shrink-0 px-4 pt-3 pb-4 md:px-8 md:pb-6">
            <p className="flex gap-4 text-sm" aria-live="polite">
              <span className="tabular-nums text-navy-200">{pad(index + 1)} / {pad(photos.length)}</span>
              <span>{photo.caption}</span>
            </p>
            {many && (
              <div ref={thumbsRef} role="group" aria-label="Choose a photo" className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
                {photos.map((item, position) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`View ${item.caption}`}
                    aria-current={position === index ? 'true' : undefined}
                    onClick={() => setIndex(position)}
                    className={cx('h-14 w-20 shrink-0 overflow-hidden transition-opacity', position === index ? 'opacity-100 outline-2 -outline-offset-2 outline-gold-400' : 'opacity-50 hover:opacity-100')}
                  >
                    <Picture src={item.src} alt="" sizes="80px" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/50" />
          <div className="relative flex h-full animate-fade-in flex-col justify-between p-8">
            <Logo className="w-28" />
            <div>
              <p className="text-eyebrow font-semibold uppercase text-gold-400">Your selected suite</p>
              <p className="mt-3 font-serif text-heading">{room.name}</p>
              <p className="mt-2 text-sm text-navy-200">{room.tagline} · listed from {formatRate(room.rate)} per night</p>
              <span aria-hidden="true" className="mt-6 inline-flex min-h-10 items-center gap-2 border border-cream-50/50 px-4 text-eyebrow font-semibold uppercase tracking-label transition-colors duration-200 group-hover/panel:bg-cream-50 group-hover/panel:text-navy-950">
                <Expand size={14} strokeWidth={1.5} />
                {representative ? 'View representative photo' : `View all ${photos.length} photos`}
              </span>
            </div>
          </div>
          {/* The whole panel is the control; it sits above the decorative content. */}
          <button
            type="button"
            data-gallery-trigger="panel"
            onClick={onExpand}
            aria-label={`View ${room.name} photos in full`}
            aria-expanded={false}
            className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-gold-400"
          />
        </>
      )}
    </div>
  )
}

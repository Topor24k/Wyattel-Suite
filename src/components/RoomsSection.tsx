import { useState } from 'react'
import { Images } from 'lucide-react'
import { Picture } from './ui/Picture'
import { Eyebrow } from './ui/Eyebrow'
import { ButtonLink } from './ui/Button'
import { Section } from './ui/Section'
import type { Room } from '../types'
import { roomPath } from '../utils/siteRoutes'
import { formatRate, pad } from '../utils/format'
import { cx } from '../utils/cx'

const coverOf = (room: Room) => room.gallery?.[0]?.src ?? room.image

/**
 * Suite index: a numbered list whose large preview follows the row you hover
 * or focus on wide screens. Below that it becomes a swipeable rail of photo cards.
 */
export default function RoomsSection({ rooms, onViewPhotos }: { rooms: Room[]; onViewPhotos: (room: Room) => void }) {
  const [active, setActive] = useState(0)
  const activeRoom = rooms[active] ?? rooms[0]

  return (
    <Section surface="navy" id="rooms" aria-labelledby="home-suites-title" data-section="home-suites">
      <div className="reveal flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow tone="dark" rule>Our suites</Eyebrow>
          <h2 id="home-suites-title" className="mt-6 text-heading tracking-tight">
            Find the room <em className="text-gold-400">made for your stay.</em>
          </h2>
        </div>
        <ButtonLink href="/suites" tone="dark" variant="text" arrow className="self-start md:self-auto">Explore all suites</ButtonLink>
      </div>

      <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
        <ol className="max-lg:rail max-lg:-mx-4 max-lg:scroll-px-4 max-lg:px-4 sm:max-lg:-mx-8 sm:max-lg:scroll-px-8 sm:max-lg:px-8 lg:col-span-7">
          {rooms.map((room, index) => (
            <li
              key={room.name}
              onMouseEnter={() => setActive(index)}
              onFocusCapture={() => setActive(index)}
              className="group relative max-lg:w-4/5 max-lg:overflow-hidden max-lg:rounded-2xl max-lg:bg-navy-900 sm:max-lg:w-5/12 lg:border-t lg:border-cream-50/15 lg:last:border-b"
            >
              <Picture
                src={coverOf(room)}
                alt={`${room.name} at Wyattel Suite`}
                sizes="(min-width: 640px) 42vw, 80vw"
                className="aspect-4/5 w-full object-cover lg:hidden"
              />
              <div className="flex items-center gap-3 max-lg:absolute max-lg:inset-x-0 max-lg:bottom-0 max-lg:bg-gradient-to-t max-lg:from-navy-950 max-lg:via-navy-950/80 max-lg:to-transparent max-lg:px-4 max-lg:pt-20 max-lg:pb-4 lg:gap-8 lg:py-8">
                <span className={cx('w-8 shrink-0 text-eyebrow tabular-nums transition-colors max-lg:hidden', index === active ? 'text-gold-400' : 'text-navy-200')}>{pad(index + 1)}</span>
                <a href={roomPath(room.name)} className="min-w-0 flex-1 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                  <span className={cx('block font-serif text-lede transition-colors duration-200 lg:text-title', index === active ? 'lg:text-gold-400' : '')}>{room.name}</span>
                  <span className="mt-1 block text-sm text-navy-200">{room.tagline}</span>
                </a>
                <span className="shrink-0 text-right">
                  <span className="block font-serif text-lede max-lg:text-base">{formatRate(room.rate)}</span>
                  <span className="block text-xs text-navy-200">per night</span>
                </span>
                <button
                  type="button"
                  onClick={() => onViewPhotos(room)}
                  aria-label={`View ${room.name} photos`}
                  aria-haspopup="dialog"
                  className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-cream-50/25 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  <Images aria-hidden="true" size={16} strokeWidth={1.5} />
                </button>
              </div>
              {/* Keyboard focus on the row link draws the ring around the whole row. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden outline-2 -outline-offset-2 outline-gold-400 group-has-[a:focus-visible]:block max-lg:rounded-2xl lg:outline-offset-2" />
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-4/5 overflow-hidden">
              {rooms.map((room, index) => (
                <Picture
                  key={room.name}
                  src={coverOf(room)}
                  alt=""
                  sizes="33vw"
                  className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out-soft', index === active ? 'opacity-100' : 'opacity-0')}
                />
              ))}
            </div>
            <p className="mt-5 text-sm text-navy-200">{activeRoom?.text}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

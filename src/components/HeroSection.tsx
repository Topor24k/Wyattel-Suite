import { Picture } from './ui/Picture'
import { Eyebrow } from './ui/Eyebrow'
import { containerClass } from './ui/Section'
import QuickBooking from './QuickBooking'
import type { OpenBooking } from '../types'
import { cx } from '../utils/cx'

export default function HeroSection({ onBook }: { onBook: OpenBooking }) {
  return (
    <section aria-labelledby="home-title" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-navy-950 text-cream-50">
      <Picture
        priority
        src="/Pictures/Wyattel%20Hero%20Background.png"
        alt="The Wyattel Suite building on the National Highway in Tacurong City"
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/60 to-transparent" />

      <div className={cx(containerClass, 'pt-28 pb-6 max-md:pb-tabbar md:pt-32 md:pb-10')}>
        <Eyebrow tone="dark" rule className="animate-page-in">Tacurong City · Sultan Kudarat</Eyebrow>
        <h1 id="home-title" tabIndex={-1} data-page-heading className="mt-6 animate-page-in text-display tracking-tight md:mt-8">
          <span className="block">Stay</span>
          <em className="block pl-10 text-gold-400 sm:pl-20 lg:pl-40">beautifully.</em>
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end">
          <p className="max-w-md font-serif text-lede text-cream-50/90 lg:col-span-4">
            A personal, welcoming stay in the heart of Tacurong: five suite types, an on-site restaurant, and warm, unhurried service.
          </p>
          <QuickBooking onBook={onBook} className="lg:col-span-8" />
        </div>
      </div>
    </section>
  )
}

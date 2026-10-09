import { CalendarPlus, MapPin, Navigation, Phone } from 'lucide-react'
import { Picture } from './ui/Picture'
import { Eyebrow } from './ui/Eyebrow'
import { Button, ButtonLink } from './ui/Button'
import { Section } from './ui/Section'
import { hotelAddressLines, hotelMaps, hotelPhones } from '../data/site'

const tileClass = 'flex flex-col items-center gap-2 rounded-2xl bg-cream-50 py-4 text-xs font-semibold text-navy-950 transition-[scale] duration-150 active:scale-95'
const tileIcon = 'grid size-11 place-items-center rounded-full bg-navy-950 text-cream-50'

export default function ContactSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <Section surface="paper" id="contact" aria-labelledby="home-contact-title" containerClassName="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="reveal lg:col-span-6">
        <Picture
          src="/Pictures/Wyattel%20Hero%20Background.png"
          alt="Wyattel Suite building and entrance in Tacurong City"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-4/3 w-full object-cover max-md:rounded-2xl"
        />
      </div>
      <div className="reveal lg:col-span-5 lg:col-start-8">
        <Eyebrow rule>Find your way to Wyattel</Eyebrow>
        <h2 id="home-contact-title" className="mt-6 text-heading tracking-tight text-navy-950">
          We’ll meet you <em className="text-gold-700">in Tacurong.</em>
        </h2>
        <dl className="mt-10 space-y-6 border-t border-ink/15 pt-8 text-sm" data-selectable="true">
          <div className="flex gap-4">
            <dt><MapPin aria-label="Address" size={18} strokeWidth={1.5} className="mt-0.5 text-gold-700" /></dt>
            <dd>
              <address className="not-italic text-ink">{hotelAddressLines.map((line) => <span key={line} className="block">{line}</span>)}</address>
            </dd>
          </div>
          <div className="flex gap-4">
            <dt><Phone aria-label="Phone" size={18} strokeWidth={1.5} className="mt-0.5 text-gold-700" /></dt>
            <dd className="flex flex-col">
              {hotelPhones.map((phone) => <a key={phone.href} href={phone.href} className="min-h-7 text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">{phone.label}</a>)}
            </dd>
          </div>
        </dl>
        {/* Phones: one-tap shortcuts, like an app's action row. */}
        <div className="mt-8 grid grid-cols-3 gap-3 md:hidden">
          {hotelPhones[0] && (
            <a href={hotelPhones[0].href} className={tileClass}>
              <span className={tileIcon}><Phone aria-hidden="true" size={18} strokeWidth={1.5} /></span>
              Call
            </a>
          )}
          <a href={hotelMaps} target="_blank" rel="noreferrer" className={tileClass}>
            <span className={tileIcon}><Navigation aria-hidden="true" size={18} strokeWidth={1.5} /></span>
            Directions<span className="sr-only"> (opens Google Maps)</span>
          </a>
          <button type="button" onClick={onOpenBooking} className={tileClass}>
            <span className={tileIcon}><CalendarPlus aria-hidden="true" size={18} strokeWidth={1.5} /></span>
            Book
          </button>
        </div>
        <div className="mt-10 flex flex-wrap gap-4 max-md:hidden">
          <Button arrow onClick={onOpenBooking}>Request a reservation</Button>
          <ButtonLink variant="secondary" href={hotelMaps} target="_blank" rel="noreferrer">
            Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}

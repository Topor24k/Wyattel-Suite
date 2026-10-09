import { Logo } from './ui/Logo'
import { Button } from './ui/Button'
import { containerClass } from './ui/Section'
import { hotelAddressLines, hotelFacebook, hotelMaps, hotelPhones, navLinks } from '../data/site'
import { cx } from '../utils/cx'

const linkClass = 'inline-flex min-h-8 items-center text-sm text-navy-200 transition-colors hover:text-cream-50'
const headingClass = 'mb-4 font-sans text-eyebrow font-semibold uppercase text-gold-400'

export default function Footer({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <footer className="overflow-hidden bg-navy-950 text-cream-50">
      <div className={cx(containerClass, 'grid gap-8 border-b border-cream-50/10 py-14 md:grid-cols-12 md:items-end md:gap-10 md:py-28')}>
        <h2 className="text-heading tracking-tight md:col-span-8">
          Your stay <em className="text-gold-400">starts here.</em>
        </h2>
        <div className="flex flex-col items-stretch gap-4 sm:items-start md:col-span-4 md:items-end">
          <Button tone="dark" size="lg" arrow onClick={onOpenBooking} className="max-md:w-full max-md:rounded-full">Request a reservation</Button>
          <p className="text-sm text-navy-200">No payment is taken online.</p>
        </div>
      </div>

      <div className={cx(containerClass, 'grid grid-cols-2 gap-8 py-12 sm:gap-10 md:py-14 lg:grid-cols-4')}>
        <div className="col-span-2 sm:col-span-1">
          <p className="max-w-xs font-serif text-lede text-cream-50">A warm, personal stay in the heart of Tacurong City.</p>
        </div>
        {/* Phones reach these pages from the tab bar and the More sheet. */}
        <nav aria-label="Footer" className="max-md:hidden">
          <h3 className={headingClass}>Explore</h3>
          <ul>
            {navLinks.slice(1).map((link) => <li key={link.href}><a className={linkClass} href={link.href}>{link.label}</a></li>)}
          </ul>
        </nav>
        <div>
          <h3 className={headingClass}>Visit</h3>
          <address className="text-sm not-italic text-navy-200" data-selectable="true">
            {hotelAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
          </address>
          <a className={cx(linkClass, 'mt-3 border-b border-gold-400/60')} href={hotelMaps} target="_blank" rel="noreferrer">
            Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
        <div>
          <h3 className={headingClass}>Contact</h3>
          <ul>
            {hotelPhones.map((phone) => <li key={phone.href}><a className={linkClass} href={phone.href}>{phone.label}</a></li>)}
            <li><a className={linkClass} href={hotelFacebook} target="_blank" rel="noreferrer">Facebook<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
        </div>
      </div>

      <div className={containerClass} aria-hidden="true">
        <Logo className="w-full text-navy-800" />
      </div>

      <div className={containerClass}>
        {/* Clear the phone tab bar, and the desktop back-to-top button. */}
        <div className="flex flex-col gap-2 py-8 text-xs text-navy-200 max-md:pb-tabbar sm:flex-row sm:justify-between md:pr-20">
          <p>© {new Date().getFullYear()} Wyattel Suite. All rights reserved.</p>
          <p>Tacurong City · Sultan Kudarat · Philippines</p>
        </div>
      </div>
    </footer>
  )
}

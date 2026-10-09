import { ChevronLeft, Phone } from 'lucide-react'
import { Logo } from './ui/Logo'
import { Button } from './ui/Button'
import useHeadingInView from '../hooks/useHeadingInView'
import { hotelPhones } from '../data/site'
import { cx } from '../utils/cx'

type HeaderProps = {
  /** Sits over a dark hero photograph until the page scrolls. */
  overlay: boolean
  /** Phones only: float round buttons over a full-bleed photo until the page scrolls. */
  floating: boolean
  hidden: boolean
  menuOpen: boolean
  /** Identifies the page, so the phone bar can track its heading. */
  pageKey: string
  /** Short page name the phone bar shows once the large heading scrolls away. */
  title?: string
  /** Parent screen for the phone back button on detail pages. */
  back?: { href: string; label: string }
  onOpenMenu: () => void
  onOpenBooking: () => void
}

export default function Header({ overlay, floating, hidden, menuOpen, pageKey, title, back, onOpenMenu, onOpenBooking }: HeaderProps) {
  const primaryPhone = hotelPhones[0]
  const headingInView = useHeadingInView(pageKey)
  const showTitle = Boolean(title) && !headingInView && !floating
  const solid = !overlay && !floating
  const roundButton = cx(
    'grid size-11 place-items-center rounded-full transition-[background-color,scale] duration-200 active:scale-95',
    floating ? 'bg-cream-50/90 text-navy-950 shadow-md backdrop-blur-sm' : 'hover:bg-navy-950/5',
  )

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 transition-[transform,background-color,color,border-color] duration-300 ease-out-soft focus-within:translate-y-0',
        hidden && !menuOpen ? 'md:-translate-y-full' : 'translate-y-0',
        overlay ? 'border-b border-transparent bg-transparent text-cream-50' : 'border-b border-ink/10 bg-cream-100/95 text-navy-950 backdrop-blur-md',
        floating && 'max-md:border-transparent max-md:bg-transparent max-md:backdrop-blur-none',
      )}
    >
      {overlay && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950/60 to-transparent" />}
      {/* Status-bar band when the site runs full-screen from the home screen. */}
      <div aria-hidden="true" className={cx('h-safe-top', solid ? 'bg-navy-950' : 'bg-transparent')} />

      {/* Phones: app navigation bar. Primary navigation lives in the bottom tab bar. */}
      <div className="relative grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2 px-2 md:hidden">
        {back ? (
          <a href={back.href} aria-label={`Back to ${back.label}`} className={roundButton}>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.5} />
          </a>
        ) : <span aria-hidden="true" />}
        <div className="flex min-w-0 justify-center">
          {showTitle ? (
            <p className="animate-fade-in truncate font-serif text-lede">{title}</p>
          ) : (
            <a href="/" aria-label="Wyattel Suite home" className={cx('flex min-h-11 items-center px-2 transition-opacity', floating && 'opacity-0')} tabIndex={floating ? -1 : undefined}>
              <Logo className="w-24" />
            </a>
          )}
        </div>
        {primaryPhone && (
          <a href={primaryPhone.href} aria-label={`Call the hotel on ${primaryPhone.label}`} className={roundButton}>
            <Phone aria-hidden="true" size={18} strokeWidth={1.5} />
          </a>
        )}
      </div>

      {/* Tablets and desktops. */}
      <div className="relative mx-auto hidden h-20 max-w-site grid-cols-[1fr_auto_1fr] items-center px-8 md:grid lg:px-12">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="group -ml-2 flex min-h-11 items-center gap-3 justify-self-start px-2 text-eyebrow font-semibold uppercase"
        >
          <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
            <span className="h-px w-6 bg-current" />
            <span className="h-px w-4 bg-current transition-[width] duration-200 group-hover:w-6" />
          </span>
          Menu
        </button>

        <a href="/" aria-label="Wyattel Suite home" className="flex min-h-11 items-center px-2">
          <Logo className="w-36" />
        </a>

        <div className="flex items-center justify-self-end gap-6">
          {primaryPhone && (
            <a href={primaryPhone.href} className="hidden min-h-11 items-center gap-2 text-eyebrow font-semibold uppercase lg:flex">
              <Phone aria-hidden="true" size={14} strokeWidth={1.5} />
              {primaryPhone.label}
            </a>
          )}
          <Button tone={overlay ? 'dark' : 'light'} variant={overlay ? 'secondary' : 'primary'} size="sm" onClick={onOpenBooking}>
            Book your stay
          </Button>
        </div>
      </div>
    </header>
  )
}

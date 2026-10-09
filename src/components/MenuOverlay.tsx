import { useState } from 'react'
import { X } from 'lucide-react'
import { Logo } from './ui/Logo'
import { Picture } from './ui/Picture'
import { Button } from './ui/Button'
import { useDialog } from '../hooks/useDialog'
import { hotelAddressLines, hotelFacebook, hotelPhones, navLinks } from '../data/site'
import { cx } from '../utils/cx'
import { pad } from '../utils/format'

type Props = { currentPath: string; onClose: () => void; onOpenBooking: () => void }

export default function MenuOverlay({ currentPath, onClose, onOpenBooking }: Props) {
  const { ref, onKeyDown } = useDialog<HTMLDivElement>({ onClose })
  const currentIndex = Math.max(0, navLinks.findIndex((link) => link.href === currentPath))
  const [previewIndex, setPreviewIndex] = useState(currentIndex)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex animate-fade-in flex-col overflow-y-auto bg-navy-950 text-cream-50"
    >
      <div className="mx-auto grid h-16 w-full max-w-site shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 md:h-20 lg:px-12">
        <button type="button" onClick={onClose} className="-ml-2 flex min-h-11 items-center gap-3 justify-self-start px-2 text-eyebrow font-semibold uppercase">
          <X aria-hidden="true" size={20} strokeWidth={1.25} />
          Close
        </button>
        <a href="/" onClick={onClose} aria-label="Wyattel Suite home" className="flex min-h-11 items-center px-2">
          <Logo className="w-28 md:w-36" />
        </a>
        <Button tone="dark" size="sm" className="justify-self-end" onClick={onOpenBooking}>
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book your stay</span>
        </Button>
      </div>

      <div className="mx-auto grid w-full max-w-site flex-1 gap-12 px-4 pt-8 pb-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-12 lg:pt-4">
        <nav aria-label="Main" className="lg:col-span-7">
          <ul className="border-t border-cream-50/10">
            {navLinks.map((link, index) => {
              const current = link.href === currentPath
              return (
                <li key={link.href} className="border-b border-cream-50/10">
                  <a
                    href={link.href}
                    onClick={onClose}
                    onMouseEnter={() => setPreviewIndex(index)}
                    onFocus={() => setPreviewIndex(index)}
                    aria-current={current ? 'page' : undefined}
                    className={cx(
                      'group flex items-baseline gap-5 py-3 font-serif text-title transition-colors duration-200 md:gap-8 md:py-4',
                      current ? 'text-gold-400' : 'text-cream-50 hover:text-gold-400 focus-visible:text-gold-400',
                    )}
                  >
                    <span className="w-6 font-sans text-eyebrow text-navy-200 tabular-nums">{pad(index + 1)}</span>
                    <span className="transition-transform duration-200 ease-out-soft group-hover:translate-x-2 motion-reduce:transform-none">{link.label}</span>
                    {current && <span className="ml-auto font-sans text-eyebrow uppercase text-navy-200">You are here</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div aria-hidden="true" className="relative hidden aspect-4/5 overflow-hidden lg:col-span-4 lg:col-start-9 lg:block">
          {navLinks.map((link, index) => (
            <Picture
              key={link.href}
              src={link.image}
              alt=""
              sizes="30vw"
              className={cx(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out-soft',
                index === previewIndex ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-site shrink-0 px-4 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-6 border-t border-cream-50/10 pt-6 text-sm text-navy-200 sm:grid-cols-3" data-selectable="true">
          <address className="not-italic">{hotelAddressLines.map((line) => <span key={line} className="block">{line}</span>)}</address>
          <div className="flex flex-col">
            {hotelPhones.map((phone) => <a key={phone.href} href={phone.href} className="min-h-6 hover:text-cream-50">{phone.label}</a>)}
          </div>
          <a href={hotelFacebook} target="_blank" rel="noreferrer" className="self-start hover:text-cream-50 sm:justify-self-end">
            Wyattel on Facebook<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  )
}

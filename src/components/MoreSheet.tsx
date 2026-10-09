import { BookOpen, ChevronRight, Info, Map, MessageCircle, Navigation, Phone, Tag, UtensilsCrossed, X, type LucideIcon } from 'lucide-react'
import { Logo } from './ui/Logo'
import { useDialog } from '../hooks/useDialog'
import { useSheetDrag } from '../hooks/useSheetDrag'
import { hotelAddress, hotelFacebook, hotelMaps, hotelPhones, navLinks } from '../data/site'
import { cx } from '../utils/cx'

type Props = { currentPath: string; onClose: () => void }

// Pages not already in the tab bar, each with an icon for the list row.
const icons: Record<string, LucideIcon> = {
  '/experiences': UtensilsCrossed,
  '/journal': BookOpen,
  '/plan-your-stay': Map,
  '/offers': Tag,
  '/our-story': Info,
}
const pages = navLinks.filter((link) => link.href in icons)

const actionClass = 'flex flex-col items-center gap-2 rounded-2xl bg-cream-50 py-4 text-xs font-semibold text-navy-950 transition-transform duration-150 active:scale-95'
const actionIcon = 'grid size-11 place-items-center rounded-full bg-navy-950 text-cream-50'

/** Phone "More" tab: the rest of the site as a bottom sheet. */
export default function MoreSheet({ currentPath, onClose }: Props) {
  const { ref, onKeyDown } = useDialog<HTMLDivElement>({ onClose })
  const dragHandle = useSheetDrag(ref, onClose)
  const phone = hotelPhones[0]

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-end bg-navy-950/60 backdrop-blur-sm md:hidden" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="More from Wyattel"
        onKeyDown={onKeyDown}
        className="max-h-sheet w-full animate-sheet-up overflow-y-auto overscroll-contain rounded-t-3xl bg-cream-100 pb-safe"
      >
        <div className="sticky top-0 z-10 bg-cream-100/95 backdrop-blur-md">
          <div {...dragHandle} className="flex h-6 cursor-grab touch-none items-center justify-center active:cursor-grabbing" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-ink/20" />
          </div>
          <div className="flex items-center justify-between px-5 pb-3">
            <Logo className="w-24 text-navy-950" />
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full bg-cream-200 text-navy-950 active:scale-95">
              <X aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {phone && (
              <a href={phone.href} className={actionClass}>
                <span className={actionIcon}><Phone aria-hidden="true" size={18} strokeWidth={1.5} /></span>
                Call
              </a>
            )}
            <a href={hotelMaps} target="_blank" rel="noreferrer" className={actionClass}>
              <span className={actionIcon}><Navigation aria-hidden="true" size={18} strokeWidth={1.5} /></span>
              Directions<span className="sr-only"> (opens Google Maps)</span>
            </a>
            <a href={hotelFacebook} target="_blank" rel="noreferrer" className={actionClass}>
              <span className={actionIcon}><MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} /></span>
              Message<span className="sr-only"> on Facebook (opens in a new tab)</span>
            </a>
          </div>

          <nav aria-label="More pages" className="mt-6 overflow-hidden rounded-2xl bg-cream-50">
            <ul className="divide-y divide-ink/10">
              {pages.map((link) => {
                const Icon = icons[link.href] ?? Info
                const current = link.href === currentPath
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      aria-current={current ? 'page' : undefined}
                      className={cx('flex min-h-14 items-center gap-4 px-4 transition-colors active:bg-cream-200', current ? 'text-gold-700' : 'text-navy-950')}
                    >
                      <Icon aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />
                      <span className="flex-1 font-serif text-lede">{link.label}</span>
                      <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} className="text-ink-muted" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <p className="mt-6 text-center text-xs text-ink-muted" data-selectable="true">{hotelAddress}</p>
        </div>
      </div>
    </div>
  )
}

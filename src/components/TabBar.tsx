import type { MouseEvent } from 'react'
import { BedDouble, CalendarPlus, House, Images, LayoutGrid, type LucideIcon } from 'lucide-react'
import { cx } from '../utils/cx'

type Props = {
  currentPath: string
  moreOpen: boolean
  onOpenBooking: () => void
  onOpenMore: () => void
}

type Tab = { label: string; href: string; icon: LucideIcon; matches: (path: string) => boolean }

const tabs: Tab[] = [
  { label: 'Home', href: '/', icon: House, matches: (path) => path === '/' },
  { label: 'Suites', href: '/suites', icon: BedDouble, matches: (path) => path.startsWith('/suites') },
  { label: 'Gallery', href: '/gallery', icon: Images, matches: (path) => path === '/gallery' },
]
const [home, suites, gallery] = tabs

const itemClass = 'flex min-w-0 flex-col items-center justify-center gap-1 text-tab font-medium transition-[color,scale] duration-150 active:scale-95'

/** Phone navigation, anchored to the bottom of the screen like a native app. */
export default function TabBar({ currentPath, moreOpen, onOpenBooking, onOpenMore }: Props) {
  const inMore = !tabs.some((tab) => tab.matches(currentPath))

  const tabLink = (tab: Tab | undefined) => {
    if (!tab) return null
    const active = tab.matches(currentPath) && !moreOpen
    const Icon = tab.icon
    // Tapping the tab you are already on scrolls back to the top.
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (currentPath !== tab.href) return
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }
    return (
      <a href={tab.href} onClick={onClick} aria-current={active ? 'page' : undefined} className={cx(itemClass, active ? 'text-navy-950' : 'text-ink-muted')}>
        <Icon aria-hidden="true" size={22} strokeWidth={active ? 2 : 1.5} />
        {tab.label}
      </a>
    )
  }

  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream-50/90 pb-safe backdrop-blur-xl select-none md:hidden">
      <div className="grid h-16 grid-cols-5">
        {tabLink(home)}
        {tabLink(suites)}
        <button type="button" onClick={onOpenBooking} className={cx(itemClass, 'text-navy-950')}>
          <span className="-mt-5 grid size-12 place-items-center rounded-full bg-navy-950 text-cream-50 shadow-lg ring-4 ring-cream-50">
            <CalendarPlus aria-hidden="true" size={20} strokeWidth={1.75} />
          </span>
          Book
        </button>
        {tabLink(gallery)}
        <button
          type="button"
          onClick={onOpenMore}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={cx(itemClass, inMore || moreOpen ? 'text-navy-950' : 'text-ink-muted')}
        >
          <LayoutGrid aria-hidden="true" size={22} strokeWidth={inMore || moreOpen ? 2 : 1.5} />
          More
        </button>
      </div>
    </nav>
  )
}

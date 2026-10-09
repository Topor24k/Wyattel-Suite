import { useEffect, useRef, useState, type ReactNode } from 'react'
import { rooms } from './data'
import Header from './components/Header'
import Footer from './components/Footer'
import MenuOverlay from './components/MenuOverlay'
import MoreSheet from './components/MoreSheet'
import TabBar from './components/TabBar'
import BookingModal from './components/BookingModal'
import BackToTop from './components/BackToTop'
import GalleryLightbox from './components/GalleryLightbox'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import SuitesPage from './pages/SuitesPage'
import SuiteDetailPage from './pages/SuiteDetailPage'
import JournalPage from './pages/JournalPage'
import ArticlePage from './pages/ArticlePage'
import ExperiencesPage from './pages/ExperiencesPage'
import PlanStayPage from './pages/PlanStayPage'
import OffersPage from './pages/OffersPage'
import StoryPage from './pages/StoryPage'
import NotFoundPage from './pages/NotFoundPage'
import { journalArticles } from './data/journal'
import { photosForRoom, type GalleryPhoto } from './data/photos'
import type { BookingRequest, Room } from './types'
import { roomSlug } from './utils/siteRoutes'
import { inertProps } from './utils/inert'
import usePageScroll from './hooks/usePageScroll'
import useSiteLocation from './hooks/useSiteLocation'

const pageNames: Record<string, string> = {
  '/': 'Stay a little closer',
  '/gallery': 'Photo gallery',
  '/suites': 'Our suites',
  '/journal': 'The Journal',
  '/experiences': 'Dining & Celebrations',
  '/plan-your-stay': 'Plan your stay',
  '/offers': 'Offers & enquiries',
  '/our-story': 'Our story',
}
const defaultDescription = 'Discover Wyattel Suite in Tacurong. Explore rooms, genuine hotel photographs, dining, celebration enquiries, and thoughtful stay guides.'

export default function App() {
  const location = useSiteLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [booking, setBooking] = useState<BookingRequest | null>(null)
  const [viewer, setViewer] = useState<{ photos: GalleryPhoto[]; id: string } | null>(null)
  const firstRoute = useRef(true)
  const { scrolled, hideHeader } = usePageScroll()
  const isHome = location.path === '/'
  const room = rooms.find((item) => location.path === `/suites/${roomSlug(item.name)}`)
  const article = journalArticles.find((item) => location.path === `/journal/${item.slug}`)
  const isNotFound = !isHome && !room && !article && !pageNames[location.path]
  const overlayOpen = Boolean(menuOpen || moreOpen || booking || viewer)

  const openBooking = (request: BookingRequest = {}) => { setMenuOpen(false); setMoreOpen(false); setBooking(request) }
  const viewPhotos = (photos: GalleryPhoto[], id: string) => setViewer({ photos, id })
  const viewRoomPhotos = (item: Room) => {
    const { photos } = photosForRoom(item)
    if (photos[0]) viewPhotos(photos, photos[0].id)
  }

  // Route change: close overlays, reset scroll, move focus to the new heading, update metadata.
  useEffect(() => {
    setMenuOpen(false); setMoreOpen(false); setBooking(null); setViewer(null)
    const initial = firstRoute.current
    firstRoute.current = false
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: 'instant' })
      if (!initial) document.querySelector<HTMLElement>('main [data-page-heading]')?.focus({ preventScroll: true })
    })
    document.title = `${room?.name || article?.title || pageNames[location.path] || 'Page not found'} — Wyattel Suite`
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = room?.text || article?.summary || defaultDescription
    return () => cancelAnimationFrame(frame)
  }, [location.path, room, article])

  // Freeze the page behind any open overlay.
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [overlayOpen])

  let page: ReactNode
  if (isHome) page = <HomePage onBook={openBooking} onSuitePhotos={viewRoomPhotos} />
  else if (location.path === '/gallery') page = <GalleryPage search={location.search} onView={viewPhotos} />
  else if (location.path === '/suites') page = <SuitesPage onView={viewPhotos} onBook={openBooking} />
  else if (room) page = <SuiteDetailPage key={room.name} room={room} onBook={openBooking} onView={viewPhotos} />
  else if (location.path === '/journal') page = <JournalPage />
  else if (article) page = <ArticlePage key={article.slug} article={article} />
  else if (location.path === '/experiences') page = <ExperiencesPage onBook={openBooking} />
  else if (location.path === '/plan-your-stay') page = <PlanStayPage onBook={() => openBooking()} />
  else if (location.path === '/offers') page = <OffersPage onBook={openBooking} />
  else if (location.path === '/our-story') page = <StoryPage />
  else page = <NotFoundPage />

  // Pages that open on a dark full-bleed image keep the header transparent until scrolled.
  const darkTop = isHome || isNotFound
  // Phone top bar: detail screens get a back button, and every inner page shows its name once scrolled.
  const back = room ? { href: '/suites', label: 'all suites' } : article ? { href: '/journal', label: 'the journal' } : undefined
  const mobileTitle = isHome || isNotFound ? undefined : room?.name ?? article?.title ?? pageNames[location.path]

  return (
    <>
      <a href="#main-content" className="fixed top-2 left-2 z-50 -translate-y-24 bg-navy-950 px-4 py-3 text-eyebrow font-semibold uppercase text-cream-50 focus:translate-y-0">
        Skip to content
      </a>
      <div {...(overlayOpen ? inertProps : {})}>
        <Header
          overlay={darkTop && !scrolled}
          floating={Boolean(room) && !scrolled}
          hidden={hideHeader}
          menuOpen={menuOpen}
          pageKey={location.path}
          title={mobileTitle}
          back={back}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenBooking={() => openBooking()}
        />
        <main id="main-content" tabIndex={-1} key={location.path} className="animate-page-in outline-none">{page}</main>
        <Footer onOpenBooking={() => openBooking()} />
        <BackToTop visible={scrolled && !overlayOpen} />
        {/* Suite pages replace the tab bar with their own request bar, as booking apps do. */}
        {!room && <TabBar currentPath={location.path} moreOpen={moreOpen} onOpenBooking={() => openBooking()} onOpenMore={() => setMoreOpen(true)} />}
      </div>
      {moreOpen && <MoreSheet currentPath={location.path} onClose={() => setMoreOpen(false)} />}
      {menuOpen && <MenuOverlay currentPath={location.path} onClose={() => setMenuOpen(false)} onOpenBooking={() => openBooking()} />}
      {booking && <BookingModal rooms={rooms} request={booking} onClose={() => setBooking(null)} />}
      {viewer && <GalleryLightbox photos={viewer.photos} initialId={viewer.id} onClose={() => setViewer(null)} />}
    </>
  )
}

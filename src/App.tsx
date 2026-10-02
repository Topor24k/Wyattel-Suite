import React, { useEffect, useRef, useState } from 'react'
import { rooms } from './data'
import Header from './components/Header'
import Footer from './components/Footer'
import MenuOverlay from './components/MenuOverlay'
import BookingModal from './components/BookingModal'
import BackToTop from './components/BackToTop'
import BrandCursor from './components/BrandCursor'
import SuitePhotoModal from './components/SuitePhotoModal'
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
import type { GalleryPhoto } from './data/photos'
import type { Room } from './types'
import { roomSlug } from './utils/siteRoutes'
import usePageScroll from './hooks/usePageScroll'
import useSiteLocation from './hooks/useSiteLocation'

export default function App() {
  const location = useSiteLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [booking, setBooking] = useState<{ room?: string; note?: string } | null>(null)
  const [photoRoom, setPhotoRoom] = useState<Room | null>(null)
  const [viewer, setViewer] = useState<{ photos: GalleryPhoto[]; id: string } | null>(null)
  const firstRoute = useRef(true)
  const hasScrolled = usePageScroll()
  const isHome = location.path === '/'
  const openBooking = (room?: string, note?: string) => { setBooking({ room, note }); setMenuOpen(false) }
  const viewPhotos = (photos: GalleryPhoto[], id: string) => setViewer({ photos, id })
  const room = rooms.find(item => location.path === `/suites/${roomSlug(item.name)}`)
  const article = journalArticles.find(item => location.path === `/journal/${item.slug}`)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: .1 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [location.path])

  useEffect(() => {
    setMenuOpen(false); setBooking(null); setPhotoRoom(null); setViewer(null)
    const initial = firstRoute.current
    firstRoute.current = false
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: 'instant' })
      if (!initial) document.querySelector<HTMLElement>('main [data-page-heading], main h1')?.focus({ preventScroll: true })
    })
    const pageNames: Record<string, string> = { '/': 'Stay a little closer', '/gallery': 'Photo gallery', '/suites': 'Our suites', '/journal': 'The Journal', '/experiences': 'Dining & Celebrations', '/plan-your-stay': 'Plan your stay', '/offers': 'Offers & enquiries', '/our-story': 'Our story' }
    document.title = `${room?.name || article?.title || pageNames[location.path] || 'Page not found'} — Wyattel Suite`
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description) }
    description.content = room?.text || article?.summary || 'Discover Wyattel Suite in Tacurong. Explore rooms, genuine hotel photographs, dining, celebration enquiries, and thoughtful stay guides.'
    return () => cancelAnimationFrame(frame)
  }, [location.path])

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key === 'Escape') { setMenuOpen(false); setBooking(null); setPhotoRoom(null); setViewer(null) }
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])

  const overlayOpen = Boolean(menuOpen || booking || photoRoom || viewer)
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [overlayOpen])

  let page: React.ReactNode
  if (isHome) page = <HomePage onBook={() => openBooking()} onSuitePhotos={setPhotoRoom} />
  else if (location.path === '/gallery') page = <GalleryPage search={location.search} onView={viewPhotos} />
  else if (location.path === '/suites') page = <SuitesPage onView={viewPhotos} />
  else if (room) page = <SuiteDetailPage key={room.name} room={room} onBook={openBooking} onView={viewPhotos} />
  else if (location.path === '/journal') page = <JournalPage />
  else if (article) page = <ArticlePage key={article.slug} article={article} />
  else if (location.path === '/experiences') page = <ExperiencesPage />
  else if (location.path === '/plan-your-stay') page = <PlanStayPage onBook={() => openBooking()} />
  else if (location.path === '/offers') page = <OffersPage onBook={openBooking} />
  else if (location.path === '/our-story') page = <StoryPage />
  else page = <NotFoundPage />

  return <div className="page">
    <a className="site-skip-link" href="#main-content">SKIP TO CONTENT</a>
    <Header isScrolled={!isHome || hasScrolled} onOpenMenu={() => setMenuOpen(true)} onOpenBooking={() => openBooking()} />
    <main id="main-content" tabIndex={-1} key={location.path} className={isHome ? 'site-main-home' : 'site-main-inner'}>{page}</main>
    <Footer onOpenBooking={() => openBooking()} />
    <BackToTop visible={hasScrolled && !overlayOpen} /><BrandCursor />
    {menuOpen && <MenuOverlay currentPath={location.path} onClose={() => setMenuOpen(false)} />}
    {booking && <BookingModal rooms={rooms} initialRoomName={booking.room} initialNote={booking.note} onClose={() => setBooking(null)} />}
    {photoRoom && <SuitePhotoModal key={photoRoom.name} room={photoRoom} onClose={() => setPhotoRoom(null)} />}
    {viewer && <GalleryLightbox photos={viewer.photos} initialId={viewer.id} onClose={() => setViewer(null)} />}
  </div>
}

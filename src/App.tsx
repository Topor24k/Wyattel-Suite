import React, { useEffect, useState } from 'react'
import { experiences, rooms } from './data'
import BookingModal from './components/BookingModal'
import BackToTop from './components/BackToTop'
import BrandCursor from './components/BrandCursor'
import ContactSection from './components/ContactSection'
import ExperienceSection from './components/ExperienceSection'
import Footer from './components/Footer'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import MenuOverlay from './components/MenuOverlay'
import RoomsSection from './components/RoomsSection'
import SuitePhotoModal from './components/SuitePhotoModal'
import type { Room } from './types'
import ServicesSection from './components/ServicesSection'
import StorySection from './components/StorySection'
import WelcomeSection from './components/WelcomeSection'
import usePageScroll from './hooks/usePageScroll'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [photoRoom, setPhotoRoom] = useState<Room | null>(null)
  const hasScrolled = usePageScroll()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.16 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setBookingOpen(false)
      setPhotoRoom(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = bookingOpen || menuOpen || photoRoom ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [bookingOpen, menuOpen, photoRoom])

  const openBooking = () => { setBookingOpen(true); setMenuOpen(false); setSubmitted(false) }

  return (
    <div className="page">
      <Header isScrolled={hasScrolled} onOpenMenu={() => setMenuOpen(true)} onOpenBooking={openBooking} />
      <main>
        <HeroSection />
        <WelcomeSection />
        <StorySection />
        <RoomsSection rooms={rooms} onViewPhotos={setPhotoRoom} />
        <ExperienceSection experiences={experiences} />
        <ServicesSection />
        <ContactSection onOpenBooking={openBooking} />
      </main>
      <Footer onOpenBooking={openBooking} />
      <BackToTop visible={hasScrolled && !menuOpen && !bookingOpen && !photoRoom} />
      <BrandCursor />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      {bookingOpen && <BookingModal rooms={rooms} submitted={submitted} onClose={() => setBookingOpen(false)} onSubmit={() => setSubmitted(true)} />}
      {photoRoom && <SuitePhotoModal key={photoRoom.name} room={photoRoom} onClose={() => setPhotoRoom(null)} />}
    </div>
  )
}

import HeroSection from '../components/HeroSection'
import IntroSection from '../components/IntroSection'
import HomeAboutSection from '../components/HomeAboutSection'
import RoomsSection from '../components/RoomsSection'
import HomeJournalPreview from '../components/HomeJournalPreview'
import ContactSection from '../components/ContactSection'
import { rooms } from '../data'
import type { OpenBooking, Room } from '../types'

export default function HomePage({ onBook, onSuitePhotos }: { onBook: OpenBooking; onSuitePhotos: (room: Room) => void }) {
  return (
    <>
      <HeroSection onBook={onBook} />
      <IntroSection />
      <HomeAboutSection />
      <RoomsSection rooms={rooms} onViewPhotos={onSuitePhotos} />
      <HomeJournalPreview />
      <ContactSection onOpenBooking={() => onBook()} />
    </>
  )
}

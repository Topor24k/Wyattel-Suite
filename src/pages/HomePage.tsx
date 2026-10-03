import React from 'react'
import HeroSection from '../components/HeroSection'
import WelcomeSection from '../components/WelcomeSection'
import RoomsSection from '../components/RoomsSection'
import HomeAboutSection from '../components/HomeAboutSection'
import HomeJournalPreview from '../components/HomeJournalPreview'
import ContactSection from '../components/ContactSection'
import { rooms } from '../data'
import type { Room } from '../types'
import { Arrow } from '../components/UI'
export default function HomePage({ onBook, onSuitePhotos }: { onBook: () => void; onSuitePhotos: (room: Room) => void }) {
  return <div className="wyattel-home-page"><HeroSection /><WelcomeSection /><HomeAboutSection /><RoomsSection rooms={rooms} onViewPhotos={onSuitePhotos} /><div className="home-suites-more"><a href="/suites">EXPLORE ALL SUITES <Arrow /></a></div><HomeJournalPreview /><ContactSection onOpenBooking={onBook} /></div>
}

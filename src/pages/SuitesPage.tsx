import React from 'react'
import { rooms } from '../data'
import type { GalleryPhoto } from '../data/photos'
import SuiteCollectionCard from '../components/SuiteCollectionCard'
import PageNote from '../components/PageNote'

export default function SuitesPage({ onView }: { onView: (photos: GalleryPhoto[], id: string) => void }) {
  return <div className="suite-directory-page"><PageNote eyebrow="OUR SUITES" title="Find your kind of stay." description="Explore five suite types and take a closer look at each room to find the stay that feels right for you." className="suites-page-note" />
    <section className="suite-directory-content site-content-width">
      <div className="suite-collection-meta"><span>05 WAYS TO FEEL AT HOME</span></div>
      <div className="suite-collection-list">{rooms.map((room, index) => <SuiteCollectionCard key={room.name} room={room} index={index} onView={onView} />)}</div>
    </section>
  </div>
}

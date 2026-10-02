import React from 'react'
import type { Room } from '../types'
import type { GalleryPhoto } from '../data/photos'
import { galleryPhotos } from '../data/photos'
import { rooms } from '../data'
import { Arrow } from '../components/UI'
import { roomPath } from '../utils/siteRoutes'

export default function SuiteDetailPage({ room, onBook, onView }: { room: Room; onBook: (room?: string) => void; onView: (photos: GalleryPhoto[], id: string) => void }) {
  const suitePhotos = galleryPhotos.filter(photo => photo.suite === room.name)
  const photos = suitePhotos.length ? suitePhotos : galleryPhotos.filter(photo => photo.src === room.image)
  const related = rooms.filter(item => item.name !== room.name).slice(0, 2)
  return <div className="suite-detail-page">
    <header className="suite-detail-hero"><img src={photos[0]?.src ?? room.image} alt={`${room.name}${suitePhotos.length ? '' : ' · representative room image'}`} decoding="async" /><div><a href="/suites" className="suite-detail-back"><Arrow left /> ALL SUITES</a><p className="overline">YOUR WYATTEL STAY</p><h1 tabIndex={-1} data-page-heading>{room.name}</h1><p>{room.note}</p></div></header>
    <section className="suite-detail-body site-content-width"><div className="suite-detail-description"><p className="overline">SPACE TO SETTLE IN</p><h2>A stay that feels like yours.</h2><p data-selectable="true">{room.text}</p><div className="suite-detail-facts" data-selectable="true">{room.facts.map(fact => <span key={fact}>{fact}</span>)}</div><p className="suite-detail-disclaimer" data-selectable="true">These are listed reference details. The hotel will confirm current rates, maximum guests, bed arrangements, accessibility needs, and any inclusions before your reservation is confirmed.</p></div><aside className="suite-detail-enquiry"><p className="overline">PLAN YOUR STAY</p><h2>{room.facts[0]}</h2><p>Listed reference rate. Subject to hotel confirmation.</p><button className="suite-detail-book" onClick={() => onBook(room.name)}>ENQUIRE ABOUT THIS SUITE <Arrow /></button><a className="suite-detail-planning" href="/plan-your-stay">BEFORE YOU ARRIVE <Arrow /></a></aside></section>
    <section className="suite-detail-gallery site-content-width"><div className="suite-detail-gallery-heading"><h2>A closer look.</h2><a href="/gallery">THE FULL COLLECTION <Arrow /></a></div>{!suitePhotos.length && <p className="suite-detail-disclaimer" data-selectable="true">A representative Wyattel room image is shown here. Ask the hotel for current {room.name} photographs.</p>}<div className="suite-detail-photo-grid">{photos.map(photo => <button className="suite-detail-photo" key={photo.id} onClick={() => onView(photos, photo.id)} aria-label={`Open ${photo.caption}`}><img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" /><span>VIEW PHOTO <Arrow /></span></button>)}</div></section>
    <section className="suite-detail-related site-content-width"><p className="overline">ANOTHER WAY TO STAY</p><h2>Still finding your favourite?</h2><div>{related.map(item => <a href={roomPath(item.name)} key={item.name}><span>{item.name}</span><Arrow /></a>)}</div><a href="/suites">EXPLORE ALL SUITES <Arrow /></a></section>
  </div>
}

import React, { useEffect, useRef, useState, type TouchEvent } from 'react'
import type { Room, RoomPhoto } from '../types'
import { getRoomGallery } from '../utils/roomGallery'
import { Arrow, BrandLogo } from './UI'

type Props = { room: Room; expanded: boolean; onExpand: () => void; onBack: () => void }

export default function BookingSuiteGallery({ room, expanded, onExpand, onBack }: Props) {
  const photos: RoomPhoto[] = getRoomGallery(room)
  const [photoIndex, setPhotoIndex] = useState(0)
  const expandRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const previouslyExpanded = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const photo = expanded ? photos[photoIndex] : photos[0]
  const hasMultiplePhotos = photos.length > 1
  const changePhoto = (direction: number) => setPhotoIndex((index) => (index + direction + photos.length) % photos.length)

  useEffect(() => {
    if (expanded) backRef.current?.focus()
    else if (previouslyExpanded.current) expandRef.current?.focus()
    previouslyExpanded.current = expanded
  }, [expanded])

  const finishSwipe = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (expanded && hasMultiplePhotos && Math.abs(distance) > 50) changePhoto(distance < 0 ? 1 : -1)
  }

  return (
    <aside className="booking-visual booking-suite-gallery" aria-label={`${room.name} photo gallery`} onKeyDown={(event) => {
      if (!expanded || !hasMultiplePhotos) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        changePhoto(event.key === 'ArrowRight' ? 1 : -1)
      }
    }} onTouchStart={(event) => { if (expanded) touchStartX.current = event.touches[0].clientX }} onTouchEnd={finishSwipe} onTouchCancel={() => { touchStartX.current = null }}>
      <img key={photo.src} className="booking-visual-photo" src={photo.src} alt={photo.alt} decoding="async" />
      <div className="booking-visual-wash" />
      <div className="booking-gallery-intro" aria-hidden={expanded ? true : undefined}>
        <BrandLogo light className="booking-visual-logo" />
        <div className="booking-visual-copy">
          <p>WYATTEL SUITE · TACURONG CITY</p>
          <h2>Slow down.<br /><em>Stay beautifully.</em></h2>
          <span>A considered stay, shaped around you.</span>
        </div>
        <div className="booking-gallery-suite-summary">
          <p id="booking-gallery-hint" className="booking-gallery-hint">Click the photo to view the gallery.</p>
          <div className="booking-suite-preview"><small>YOUR SELECTED SUITE</small><strong>{room.name}</strong><span>{room.note}</span></div>
        </div>
        <div className="booking-visual-steps"><span><b>01</b> DATES</span><span><b>02</b> SUITE</span><span><b>03</b> DETAILS</span></div>
      </div>
      <button ref={expandRef} className="booking-gallery-expand-trigger" type="button" hidden={expanded} onClick={() => { setPhotoIndex(0); onExpand() }} aria-label={`View photos of ${room.name}`} aria-describedby="booking-gallery-hint" aria-expanded={expanded} aria-controls="booking-gallery-controls" />
      <div className="booking-gallery-controls" id="booking-gallery-controls" hidden={!expanded}>
        <header className="booking-gallery-header">
          <button ref={backRef} className="booking-gallery-back-button" type="button" onClick={onBack}><Arrow left /> BACK TO BOOKING</button>
          <div className="booking-gallery-heading"><span>WYATTEL SUITE · PHOTO GALLERY</span><h2 id="booking-gallery-title">{room.name}</h2></div>
        </header>
        <footer className="booking-gallery-footer">
          <div className="booking-gallery-caption" aria-live="polite" aria-atomic="true"><span>{String(photoIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><p>{photo.caption}</p></div>
        </footer>
        <div className="booking-gallery-navigation" role="group" aria-label="Photo navigation">
          <button className="booking-gallery-previous-button" type="button" disabled={!hasMultiplePhotos} aria-label="Previous suite photo" onClick={() => changePhoto(-1)}><Arrow left /></button>
          <button className="booking-gallery-next-button" type="button" disabled={!hasMultiplePhotos} aria-label="Next suite photo" onClick={() => changePhoto(1)}><Arrow /></button>
        </div>
      </div>
    </aside>
  )
}

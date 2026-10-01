import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { Room, RoomPhoto } from '../types'
import { getRoomGallery } from '../utils/roomGallery'
import { Arrow } from './UI'

export default function SuitePhotoModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const photos: RoomPhoto[] = getRoomGallery(room)
  const [photoIndex, setPhotoIndex] = useState(0)
  const dialogRef = useRef<HTMLElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const photo = photos[photoIndex]
  const hasMultiplePhotos = photos.length > 1
  const changePhoto = (direction: number) => setPhotoIndex((index) => (index + direction + photos.length) % photos.length)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    backRef.current?.focus()
    return () => { if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) }
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() }
    if (hasMultiplePhotos && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      changePhoto(event.key === 'ArrowRight' ? 1 : -1)
    }
    if (event.key !== 'Tab') return
    const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [])
    const first = buttons[0], last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }

  return createPortal(
    <div className="suites-photo-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section ref={dialogRef} className="suites-photo-dialog" role="dialog" aria-modal="true" aria-labelledby="suites-photo-title" onKeyDown={handleKeyDown}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
        onTouchCancel={() => { touchStartX.current = null }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return
          const distance = event.changedTouches[0].clientX - touchStartX.current
          touchStartX.current = null
          if (hasMultiplePhotos && Math.abs(distance) > 50) changePhoto(distance < 0 ? 1 : -1)
        }}>
        <img key={photo.src} className="suites-photo-image" src={photo.src} alt={photo.alt} decoding="async" />
        <div className="suites-photo-shade" aria-hidden="true" />
        <button ref={backRef} className="suites-photo-back-button" type="button" onClick={onClose}><Arrow left /> BACK TO OUR SUITES</button>
        <div className="suites-photo-heading"><p>WYATTEL SUITE · PHOTO GALLERY</p><h2 id="suites-photo-title">{room.name}</h2></div>
        <button className="suites-photo-close-button" type="button" aria-label="Close suite photo gallery" onClick={onClose}><X size={19} strokeWidth={1.5} /></button>
        <button className="suites-photo-previous-button" type="button" disabled={!hasMultiplePhotos} aria-label="Previous suite photo" onClick={() => changePhoto(-1)}><Arrow left /></button>
        <button className="suites-photo-next-button" type="button" disabled={!hasMultiplePhotos} aria-label="Next suite photo" onClick={() => changePhoto(1)}><Arrow /></button>
        <div className="suites-photo-caption" aria-live="polite" aria-atomic="true"><span>{String(photoIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><p>{photo.caption}</p></div>
      </section>
    </div>, document.body,
  )
}

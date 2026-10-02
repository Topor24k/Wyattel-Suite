import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import type { GalleryPhoto } from '../data/photos'
import { Arrow } from './UI'

type Props = { photos: GalleryPhoto[]; initialId: string; onClose: () => void }
export default function GalleryLightbox({ photos, initialId, onClose }: Props) {
  const [index, setIndex] = useState(Math.max(0, photos.findIndex(photo => photo.id === initialId)))
  const [zoomed, setZoomed] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const startX = useRef<number | null>(null)
  const photo = photos[index]
  const change = (direction: number) => { setZoomed(false); setIndex(current => (current + direction + photos.length) % photos.length) }
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [])
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('.all-gallery-thumbnails [aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' })
  }, [index])
  if (!photo) return null
  return createPortal(<div className="all-gallery-lightbox-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="all-gallery-lightbox" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Wyattel photo viewer" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); onClose() }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowRight' ? 1 : -1) }
      if (event.key === 'Tab') {
        const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]') ?? [])].filter(el => el.getClientRects().length > 0)
        const first = controls[0], last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }}>
      <header className="all-gallery-viewer-header"><div><span>{photo.category}</span><p>{photo.suite || 'The Wyattel collection'}</p></div><div><button ref={closeRef} className="all-gallery-close" type="button" onClick={onClose} aria-label="Close photo viewer"><X size={22} /></button></div></header>
      <div className={`all-gallery-image-stage${zoomed ? ' all-gallery-image-stage--zoomed' : ''}`} tabIndex={zoomed ? 0 : undefined} aria-label={zoomed ? 'Zoomed image. Scroll to explore.' : undefined} onTouchStart={event => { startX.current = event.touches[0].clientX }} onTouchEnd={event => {
        if (startX.current !== null && !zoomed) { const delta = event.changedTouches[0].clientX - startX.current; if (Math.abs(delta) > 50) change(delta < 0 ? 1 : -1) }
        startX.current = null
      }} onTouchCancel={() => { startX.current = null }}><img key={photo.id} src={photo.src} alt={photo.alt} decoding="async" /></div>
      <button className="all-gallery-previous" type="button" aria-label="Previous gallery photo" onClick={() => change(-1)} disabled={photos.length < 2}><Arrow left /></button>
      <button className="all-gallery-next" type="button" aria-label="Next gallery photo" onClick={() => change(1)} disabled={photos.length < 2}><Arrow /></button>
      <footer className="all-gallery-viewer-footer"><div aria-live="polite"><span>{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><p>{photo.caption}</p></div><button className="all-gallery-zoom" type="button" onClick={() => setZoomed(value => !value)} aria-pressed={zoomed}>{zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}{zoomed ? 'FIT PHOTO' : 'ZOOM PHOTO'}</button></footer>
      <div className="all-gallery-thumbnails" role="group" aria-label="Choose gallery photo">{photos.map((item, position) => <button key={item.id} type="button" aria-label={`View ${item.caption}`} aria-pressed={position === index} onClick={() => { setZoomed(false); setIndex(position) }}><img loading="lazy" src={item.src} alt="" /></button>)}</div>
    </section>
  </div>, document.body)
}

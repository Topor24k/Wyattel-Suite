import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { GalleryPhoto } from '../data/photos'
import { useDialog } from '../hooks/useDialog'
import { Picture } from './ui/Picture'
import { cx } from '../utils/cx'
import { pad } from '../utils/format'

type Props = { photos: GalleryPhoto[]; initialId: string; onClose: () => void }

export default function GalleryLightbox({ photos, initialId, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { ref, onKeyDown } = useDialog<HTMLDivElement>({ onClose, initialFocus: closeRef })
  const [index, setIndex] = useState(Math.max(0, photos.findIndex((photo) => photo.id === initialId)))
  const [zoomed, setZoomed] = useState(false)
  const startX = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const photo = photos[index]
  const many = photos.length > 1
  const change = (direction: number) => { setZoomed(false); setIndex((current) => (current + direction + photos.length) % photos.length) }

  useEffect(() => {
    thumbsRef.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [index])

  if (!photo) return null

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onKeyDown={(event) => {
        if (many && (event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !(event.target instanceof HTMLButtonElement && event.target.closest('[data-thumbs]'))) {
          event.preventDefault()
          change(event.key === 'ArrowRight' ? 1 : -1)
        }
        onKeyDown(event)
      }}
      className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-navy-950 pt-safe pb-safe text-cream-50"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <p className="min-w-0 truncate text-eyebrow font-semibold uppercase text-navy-200">
          {photo.category}{photo.suite ? ` · ${photo.suite}` : ''}
        </p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed} className="hidden min-h-11 items-center gap-2 px-3 text-eyebrow font-semibold uppercase hover:text-gold-400 sm:flex">
            {zoomed ? <ZoomOut aria-hidden="true" size={16} /> : <ZoomIn aria-hidden="true" size={16} />}
            {zoomed ? 'Fit to screen' : 'Zoom'}
          </button>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className="grid size-11 place-items-center hover:text-gold-400">
            <X aria-hidden="true" size={22} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      <div
        className={cx('relative min-h-0 flex-1', zoomed ? 'overflow-auto' : 'overflow-hidden')}
        tabIndex={zoomed ? 0 : undefined}
        aria-label={zoomed ? 'Zoomed photo. Scroll to explore.' : undefined}
        onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX
          if (startX.current !== null && endX !== undefined && !zoomed && many) {
            const delta = endX - startX.current
            if (Math.abs(delta) > 50) change(delta < 0 ? 1 : -1)
          }
          startX.current = null
        }}
      >
        <Picture
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          sizes="100vw"
          loading="eager"
          placeholder={false}
          className={cx('animate-fade-in', zoomed ? 'max-w-none' : 'h-full w-full object-contain px-4 sm:px-20')}
        />
        {many && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => change(-1)} className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy-950/60 hover:bg-cream-50 hover:text-navy-950 sm:left-6">
              <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.25} />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => change(1)} className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy-950/60 hover:bg-cream-50 hover:text-navy-950 sm:right-6">
              <ChevronRight aria-hidden="true" size={22} strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 px-4 pt-4 pb-4 sm:px-8">
        <p className="flex gap-4 text-sm" aria-live="polite">
          <span className="text-navy-200 tabular-nums">{pad(index + 1)} / {pad(photos.length)}</span>
          <span className="text-cream-50">{photo.caption}</span>
        </p>
        {many && (
          <div ref={thumbsRef} data-thumbs role="group" aria-label="Choose a photo" className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
            {photos.map((item, position) => (
              <button
                key={item.id}
                type="button"
                aria-label={`View ${item.caption}`}
                aria-current={position === index ? 'true' : undefined}
                onClick={() => { setZoomed(false); setIndex(position) }}
                className={cx('h-14 w-20 shrink-0 overflow-hidden transition-opacity', position === index ? 'opacity-100 outline-2 -outline-offset-2 outline-gold-400' : 'opacity-50 hover:opacity-100')}
              >
                <Picture src={item.src} alt="" sizes="80px" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

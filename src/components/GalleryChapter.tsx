import React from 'react'
import type { GalleryPhoto } from '../data/photos'
import { Arrow } from './UI'

type Props = { id: string; category: string; title: string; note: string; number: number; photos: GalleryPhoto[]; onView: (photo: GalleryPhoto) => void }

export default function GalleryChapter({ id, category, title, note, number, photos, onView }: Props) {
  return <section id={id} className={`gallery-chapter gallery-chapter--${category.toLowerCase()}`} aria-labelledby={`${id}-title`}>
    <div className="gallery-chapter-heading"><div><p className="gallery-chapter-kicker"><span>{String(number).padStart(2, '0')}</span>{category}</p><h2 id={`${id}-title`}>{title}</h2></div><p className="gallery-chapter-note">{note}</p></div>
    <div className="gallery-chapter-mosaic">{photos.map((photo, index) => <figure className={`gallery-collection-frame${photo.fit === 'contain' ? ' gallery-collection-frame--uncropped' : ''}`} key={photo.id}>
      <button className="gallery-collection-photo" type="button" aria-label={`Open ${photo.caption}`} onClick={() => onView(photo)}><img src={photo.src} alt={photo.alt} loading={number === 1 ? 'eager' : 'lazy'} decoding="async" /><span className="gallery-collection-open">{photo.fit === 'contain' ? 'VIEW & ZOOM MENU' : 'VIEW PHOTOGRAPH'} <Arrow /></span></button>
      <figcaption className="gallery-collection-caption"><span>{String(index + 1).padStart(2, '0')}</span><div><small>{photo.suite || category}</small><p>{photo.caption}</p></div></figcaption>
    </figure>)}</div>
  </section>
}

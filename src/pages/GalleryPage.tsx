import React, { useEffect } from 'react'
import { galleryPhotos } from '../data/photos'
import type { GalleryPhoto } from '../data/photos'
import PageNote from '../components/PageNote'
import GalleryChapter from '../components/GalleryChapter'

type Props = { search: string; onView: (photos: GalleryPhoto[], id: string) => void }
const chapters = [
  { category: 'Hotel', id: 'gallery-hotel', title: 'The art of arriving.', note: 'A familiar welcome, before you even step inside.' },
  { category: 'Suites', id: 'gallery-suites', title: 'Rooms with a point of view.', note: 'Little details. Quiet corners. A space to make your own.' },
  { category: 'Weddings', id: 'gallery-weddings', title: 'The beginning of something.', note: 'A setting for the moments you will want to remember.' },
  { category: 'Dining', id: 'gallery-dining', title: 'A seat at our table.', note: 'View and zoom the Filipino menu. Confirm current dishes and prices with the hotel.' },
]
export default function GalleryPage({ search, onView }: Props) {
  // Older dining links now scroll to a chapter instead of hiding other photos.
  useEffect(() => {
    const chapter = chapters.find(item => item.category === new URLSearchParams(search).get('category'))
    if (!chapter || window.location.hash) return
    const timer = window.setTimeout(() => document.getElementById(chapter.id)?.scrollIntoView(), 80)
    return () => window.clearTimeout(timer)
  }, [search])
  return <div className="all-gallery-page">
    <PageNote eyebrow="THE WYATTEL COLLECTION" title="A closer look." description="Explore our suites, welcoming spaces, wedding moments, and Filipino dining through the Wyattel photo collection." className="gallery-page-note" />
    <div className="gallery-collection site-content-width">
      <div className="gallery-collection-meta"><span>{String(galleryPhotos.length).padStart(2, '0')} PHOTOGRAPHS · ONE WYATTEL</span><p>Click any photograph to view it in full.</p></div>
      {chapters.map((chapter, index) => <GalleryChapter key={chapter.id} {...chapter} number={index + 1} photos={galleryPhotos.filter(photo => photo.category === chapter.category)} onView={photo => onView(galleryPhotos, photo.id)} />)}
    </div>
  </div>
}

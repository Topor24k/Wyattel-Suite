import { suiteGalleries } from './suiteGalleries'
import { photoId } from '../utils/siteRoutes'

export type GalleryPhoto = { id: string; src: string; alt: string; caption: string; category: string; suite?: string; fit?: 'contain' | 'cover' }
const picture = (file: string) => `/Pictures/${encodeURIComponent(file)}`
const otherPhotos = [
  { src: picture('Wyattel Hero Background.png'), alt: 'Wyattel building and entrance', caption: 'Your arrival at Wyattel', category: 'Hotel' },
  { src: picture('Wyattel Story Detail Background.png'), alt: 'Wyattel reception desk', caption: 'A warm welcome', category: 'Hotel' },
  { src: picture('Wyattel Story Main Background.png'), alt: 'Romantic room arrangement at Wyattel', caption: 'A room prepared for a special stay', category: 'Suites' },
  { src: picture('Wyattel Suite 1 Background.png'), alt: 'Wyattel guest room', caption: 'Room details at Wyattel', category: 'Suites' },
  { src: picture('Wyattel Suite 2 Background.png'), alt: 'Wyattel twin-bed room', caption: 'Space to settle in', category: 'Suites' },
  { src: picture('Wyattel Suite Wedding.png'), alt: 'Wedding couple at Wyattel', caption: 'Say “I Do” at Wyattel', category: 'Weddings' },
  { src: picture('Wyattel Suite Filipino Menu.png'), alt: 'Wyattel Filipino food menu', caption: 'The Filipino menu · confirm current items and prices with the hotel', category: 'Dining', fit: 'contain' as const },
]
export const galleryPhotos: GalleryPhoto[] = [
  ...Object.entries(suiteGalleries).flatMap(([suite, photos]) => (photos as { src: string; alt: string; caption: string }[]).map(photo => ({ ...photo, suite, category: 'Suites' }))),
  ...otherPhotos,
].map(photo => ({ ...photo, id: photoId(photo.src) }))

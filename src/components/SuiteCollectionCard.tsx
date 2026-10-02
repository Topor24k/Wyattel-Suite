import React from 'react'
import type { Room } from '../types'
import { galleryPhotos } from '../data/photos'
import type { GalleryPhoto } from '../data/photos'
import { roomPath, roomSlug } from '../utils/siteRoutes'
import { Arrow } from './UI'

type Props = { room: Room; index: number; onView: (photos: GalleryPhoto[], id: string) => void }

export default function SuiteCollectionCard({ room, index, onView }: Props) {
  const ownPhotos = galleryPhotos.filter(photo => photo.suite === room.name)
  const photos = ownPhotos.length ? ownPhotos : galleryPhotos.filter(photo => photo.src === room.image)
  const first = photos[0]
  const detail = photos[1]
  return <article className={`suite-collection-card suite-collection-card--${roomSlug(room.name)}${index % 2 ? ' suite-collection-card--reverse' : ''}`} aria-labelledby={`collection-${roomSlug(room.name)}`}>
    <div className="suite-collection-visual">
      <button className="suite-collection-photo" type="button" onClick={() => first && onView(photos, first.id)} aria-label={`View ${room.name} photos`}><img src={first?.src || room.image} alt={ownPhotos.length ? first.alt : 'Representative Wyattel room image, not a confirmed Presidential Suite photograph'} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" /><span className="suite-collection-photo-label">{ownPhotos.length ? 'STEP INSIDE · VIEW PHOTOS' : 'REPRESENTATIVE ROOM · VIEW PHOTO'} <Arrow /></span></button>
      {detail && <button className="suite-collection-detail" type="button" onClick={() => onView(photos, detail.id)} aria-label={`View another ${room.name} photo`}><img src={detail.src} alt={detail.alt} loading="lazy" decoding="async" /><span>A CLOSER LOOK <Arrow /></span></button>}
    </div>
    <div className="suite-collection-copy"><p className="suite-collection-kicker"><span>{String(index + 1).padStart(2, '0')}</span>THE SUITE COLLECTION</p><h2 id={`collection-${roomSlug(room.name)}`}><a href={roomPath(room.name)}>{room.name}</a></h2><p className="suite-collection-description">{room.text}</p><div className="suite-collection-rate"><small>LISTED REFERENCE RATE</small><p>{room.facts[0].split(' / ')[0]} <span>/ night</span></p></div><p className="suite-collection-confirm">Current rates and room arrangements are confirmed by the hotel.{!ownPhotos.length && ' Request current suite photographs before booking.'}</p><div className="suite-collection-actions"><a className="suite-collection-explore" href={roomPath(room.name)}>EXPLORE SUITE <Arrow /></a></div></div>
  </article>
}

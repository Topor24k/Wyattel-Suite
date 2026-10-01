import React, { useState } from 'react'
import type { Room } from '../types'
import { Arrow } from './UI'

export default function RoomsSection({ rooms, onViewPhotos }: { rooms: Room[]; onViewPhotos: (room: Room) => void }) {
  const [roomIndex, setRoomIndex] = useState(0)
  const visibleRooms = [0, 1, 2].map((offset) => rooms[(roomIndex + offset) % rooms.length])
  const changeRoom = (direction: number) => setRoomIndex((current) => (current + direction + rooms.length) % rooms.length)

  return (
    <section className="rooms-section suites-section" id="rooms">
      <div className="rooms-section-heading reveal">
        <p className="overline">OUR SUITES</p>
        <h2>Find the room<br /><em>made for your stay.</em></h2>
      </div>
      <div className="rooms-gallery reveal">
        <button className="room-gallery-arrow room-gallery-arrow--left" onClick={() => changeRoom(-1)} aria-label="Previous rooms"><Arrow left /></button>
        <div className="room-gallery-grid">
          {visibleRooms.map((room) => (
            <article className="room-gallery-card" key={room.name}>
              <img loading="lazy" decoding="async" src={room.gallery?.[0]?.src ?? room.image} alt={`${room.name} at Wyattel Suite`} />
              <div className="room-gallery-info"><p className="room-gallery-info-note">{room.note}</p><p>{room.text}</p></div>
              <button className="suites-photo-card-trigger" type="button" aria-label={`View photos of ${room.name}`} aria-haspopup="dialog" onClick={() => onViewPhotos(room)}><span className="suites-reservation-button">{room.name} <Arrow /></span></button>
            </article>
          ))}
        </div>
        <button className="room-gallery-arrow room-gallery-arrow--right" onClick={() => changeRoom(1)} aria-label="Next rooms"><Arrow /></button>
      </div>
      <div className="room-gallery-footer">
        <div className="room-gallery-dots" aria-label="Choose a room set">
          {rooms.map((room, index) => <button key={room.name} className={index === roomIndex ? 'is-active' : ''} onClick={() => setRoomIndex(index)} aria-label={`Show ${room.name}`} aria-current={index === roomIndex ? 'true' : undefined} />)}
        </div>
        <span className="room-gallery-caption">OTHER ROOMS</span>
      </div>
    </section>
  )
}

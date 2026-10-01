import React, { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { Check, ChevronDown, Minus, Plus, X } from 'lucide-react'
import BookingDatePicker from './BookingDatePicker'
import BookingSuiteGallery from './BookingSuiteGallery'
import type { Room } from '../types'
import { Arrow, BrandLogo } from './UI'

type Props = { rooms: Room[]; submitted: boolean; onClose: () => void; onSubmit: () => void }
type RoomSelectProps = { rooms: Room[]; value: string; onChange: (value: string) => void }

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

function RoomSelect({ rooms, value, onChange }: RoomSelectProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectedRoom = rooms.find((room) => room.name === value) ?? rooms[0]

  const closeWhenFocusLeaves = () => requestAnimationFrame(() => {
    if (!dropdownRef.current?.contains(document.activeElement)) setOpen(false)
  })

  const handleTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className="room-dropdown" ref={dropdownRef} onBlur={closeWhenFocusLeaves} onKeyDownCapture={(event) => {
      if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false) }
    }}>
      <span className="booking-field-label">ROOM</span>
      <input type="hidden" name="room" value={selectedRoom.name} />
      <button className={`room-dropdown-trigger${open ? ' is-open' : ''}`} type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((isOpen) => !isOpen)} onKeyDown={handleTriggerKey}>
        <img src={selectedRoom.gallery?.[0]?.src ?? selectedRoom.image} alt="" />
        <span><small>YOUR SUITE</small><strong>{selectedRoom.name}</strong></span>
        <ChevronDown size={17} strokeWidth={1.5} />
      </button>
      {open && <div className="room-dropdown-menu" role="listbox" aria-label="Choose a suite">
        <div className="room-dropdown-heading"><span>CHOOSE YOUR SUITE</span><small>{rooms.length.toString().padStart(2, '0')} OPTIONS</small></div>
        {rooms.map((room) => {
          const selected = room.name === selectedRoom.name
          return <button className={selected ? 'is-selected' : ''} type="button" role="option" aria-selected={selected} key={room.name} onClick={() => { onChange(room.name); setOpen(false) }}>
            <img src={room.gallery?.[0]?.src ?? room.image} alt="" />
            <span><strong>{room.name}</strong><small>{room.note}</small></span>
            <span className="room-dropdown-check">{selected ? <Check size={15} strokeWidth={2} /> : null}</span>
          </button>
        })}
      </div>}
    </div>
  )
}

export default function BookingModal({ rooms, submitted, onClose, onSubmit }: Props) {
  const modalRef = useRef<HTMLElement>(null)
  const closeBackdrop = (event: MouseEvent<HTMLDivElement>) => event.target === event.currentTarget && onClose()
  const today = dateKey(new Date())
  const [guestCount, setGuestCount] = useState(2)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedRoomName, setSelectedRoomName] = useState(rooms[0].name)
  const [dateError, setDateError] = useState(false)
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const selectedRoom = rooms.find((room) => room.name === selectedRoomName) ?? rooms[0]

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const initialFocus = modalRef.current?.querySelector<HTMLElement>('input[name="firstName"]') ?? modalRef.current?.querySelector<HTMLElement>('.modal-close')
    initialFocus?.focus()
    return () => { if (previousFocus?.isConnected) previousFocus.focus() }
  }, [])

  const containKeyboardFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]'))
      .filter((element) => !element.closest('[hidden], [inert]') && element.getClientRects().length > 0)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first) return
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  const updateGuestCount = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCount = Number(event.target.value)
    if (!Number.isNaN(nextCount)) setGuestCount(Math.min(12, Math.max(1, nextCount)))
  }

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedDates.length === 0) { setDateError(true); return }
    setDateError(false)
    onSubmit()
  }

  return (
    <div className="modal-backdrop booking-section" onMouseDown={closeBackdrop} onKeyDownCapture={(event) => {
      if (galleryExpanded && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setGalleryExpanded(false) }
    }}>
      <section ref={modalRef} className={`booking-modal${galleryExpanded ? ' booking-modal--gallery-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby={galleryExpanded ? 'booking-gallery-title' : 'booking-title'} onKeyDown={containKeyboardFocus}>
        <button className="modal-close" onClick={onClose} aria-label="Close booking form"><X size={19} strokeWidth={1.5} /></button>
        {submitted ? (
          <div className="booking-thanks booking-thanks--refined"><BrandLogo className="booking-logo booking-logo--center" /><p className="overline">REQUEST RECEIVED</p><h2>Thank you.</h2><p>We’ve prepared your enquiry. For the fastest confirmation, please call Wyattel at either number.</p><div className="booking-phone-links"><a className="booking-confirm-call-button" href="tel:+639122929592">CALL 0912 292 9592</a><a className="line-link" href="tel:+639659770234">CALL 0965 977 0234 <Arrow /></a></div></div>
        ) : (
          <div className="booking-modal-layout">
            <BookingSuiteGallery key={selectedRoom.name} room={selectedRoom} expanded={galleryExpanded} onExpand={() => setGalleryExpanded(true)} onBack={() => setGalleryExpanded(false)} />

            <div className="booking-form-shell" aria-hidden={galleryExpanded ? true : undefined} {...(galleryExpanded ? { inert: '' } : {})}>
              <header className="booking-form-header">
                <div><p className="overline">PRIVATE RESERVATION REQUEST</p><h1 id="booking-title">Plan your stay.</h1><p>Tell us what feels right. Our team will personally confirm availability.</p></div>
              </header>

              <form className="booking-request-form" onSubmit={submitRequest}>
                <div className="booking-form-row">
                  <label className="booking-field">FIRST NAME<input required name="firstName" placeholder="Your name" autoComplete="given-name" /></label>
                  <label className="booking-field">SURNAME<input name="surname" placeholder="Optional" autoComplete="family-name" /></label>
                </div>

                <BookingDatePicker selectedDates={selectedDates} min={today} onChange={(dates) => { setSelectedDates(dates); setDateError(false) }} />
                {dateError && <p className="booking-form-error" role="alert" data-selectable="true">Please select at least one booking date.</p>}

                <div className="booking-form-row booking-stay-row">
                  <div className="booking-guests-field"><span className="booking-field-label">GUESTS</span><div className="guest-stepper"><button type="button" onClick={() => setGuestCount((count) => Math.max(1, count - 1))} aria-label="Decrease guests"><Minus size={15} /></button><span><strong>{guestCount.toString().padStart(2, '0')}</strong><small>{guestCount === 1 ? 'GUEST' : 'GUESTS'}</small></span><input name="guests" type="number" min="1" max="12" value={guestCount} onChange={updateGuestCount} aria-label="Number of guests" /><button type="button" onClick={() => setGuestCount((count) => Math.min(12, count + 1))} aria-label="Increase guests"><Plus size={15} /></button></div></div>
                  <RoomSelect rooms={rooms} value={selectedRoomName} onChange={setSelectedRoomName} />
                </div>

                <div className="booking-form-row">
                  <label className="booking-field">EMAIL<input required name="email" type="email" placeholder="you@example.com" autoComplete="email" /></label>
                  <label className="booking-field">MOBILE<input required name="mobile" type="tel" placeholder="09XX XXX XXXX" autoComplete="tel" /></label>
                </div>

                <label className="booking-message-field">A NOTE FOR YOUR STAY<textarea id="message" name="message" placeholder="Celebrating something special, arriving late, or have a request?" /></label>
                <div className="booking-form-actions"><label className="consent"><input required type="checkbox" name="consent" /> <span data-selectable="true">I agree that Wyattel Suite may use these details to reply to my enquiry.</span></label><button className="booking-form-submit-button" type="submit">SEND REQUEST <Arrow /></button></div>
                <p className="booking-form-assurance" data-selectable="true">NO PAYMENT REQUIRED · PERSONAL CONFIRMATION FROM OUR TEAM</p>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

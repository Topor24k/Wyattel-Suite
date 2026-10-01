import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import RoomsSection from './components/RoomsSection'

const rooms = [
  { name: 'Deluxe Suite', note: 'Comfort for every stay · ₱1,900 / night', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=82', text: 'A polished, comfortable suite with the essentials for an easy overnight stay in Tacurong.', facts: ['₱1,900 / NIGHT', 'AIR-CONDITIONED', 'PRIVATE BATH'] },
  { name: 'Twin Suite', note: 'Accessible comfort · ₱2,400 / night', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=82', text: 'A thoughtful suite for guests who value extra comfort and a stay that feels easy from arrival.', facts: ['₱2,400 / NIGHT', 'ACCESSIBLE', 'PRIVATE BATH'] },
  { name: 'Presidential Suite', note: 'A more spacious stay · ₱2,400 / night', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=82', text: 'A generous room for settling in, with a calm atmosphere for business trips, celebrations and longer visits.', facts: ['₱2,400 / NIGHT', 'SPACIOUS ROOM', 'PRIVATE BATH'] },
  { name: 'Matrimonial Suite', note: 'A private stay for two · ₱2,900 / night', image: 'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1600&q=82', text: 'A restful suite for two, with a comfortable bed and the quiet ease of a private retreat.', facts: ['₱2,900 / NIGHT', 'QUEEN BED', 'PRIVATE BATH'] },
  { name: 'Family Suite', note: 'Room for everyone · ₱3,400 / night', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=82', text: 'A practical, welcoming choice for family visits, with room to settle in together.', facts: ['₱3,400 / NIGHT', 'FAMILY STAY', 'PRIVATE BATH'] },
]

const experiences = [
  { number: '01', title: 'A Warm Arrival', eyebrow: 'Easy from the first moment', text: 'A welcoming address along the National Highway, with a distinctive red-and-charcoal façade and room to arrive at your own pace.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=82', position: 'center' },
  { number: '02', title: 'Restful Rooms', eyebrow: 'Comfort without complication', text: 'Crisp linens, air-conditioning, a work or dining corner and practical en-suite bathrooms make every stay feel effortless.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=82', position: 'center' },
  { number: '03', title: 'Tacurong & Beyond', eyebrow: 'The city of goodwill', text: 'Minutes from downtown, Wyattel is a natural base for business trips, family visits and discovering Sultan Kudarat.', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=82', position: 'center' },
]

function Mark({ light = false }) {
  return <div className={`mark ${light ? 'mark--light' : ''}`}><span>W</span><i></i><small>WYATTEL<br />SUITE</small></div>
}

function Arrow({ left = false }) { return <span aria-hidden="true">{left ? '←' : '→'}</span> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.16 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setBookingOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = bookingOpen || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [bookingOpen, menuOpen])

  const openBooking = () => { setBookingOpen(true); setMenuOpen(false); setSubmitted(false) }
  const changeRoom = (direction) => {
    setRoomLoading(true)
    setRoomIndex((currentIndex) => (currentIndex + direction + rooms.length) % rooms.length)
  }

  return (
    <div className="page">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span></span><span></span><b></b></button>
        <a href="#home" aria-label="Wyattel Suite home"><img className="brand-logo" src="/Logo/Wyattel Logo.png" alt="Wyattel Suite" /></a>
        <div className="top-actions"><a href="https://www.facebook.com/WyattelSuites/" target="_blank" rel="noreferrer">FB</a><button onClick={openBooking}>BOOK YOUR STAY</button></div>
      </header>

      <main>
        <section className="hero" id="home">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=86" alt="Temporary reference image showing a hotel exterior" fetchpriority="high" decoding="async" />
          <div className="hero-wash"></div>
          <div className="hero-content reveal">
            <p>WYATTEL SUITE · TACURONG CITY</p>
            <h1>STAY<br /><em>BEAUTIFULLY</em></h1>
            <a className="hero-cta" href="#welcome">DISCOVER YOUR STAY <Arrow /></a>
          </div>
          <div className="hero-meta" aria-label="Wyattel Suite highlights">
            <span><b>₱1,900</b><small>STARTING RATE<br />PER NIGHT</small></span>
            <span><b>05</b><small>SUITE TYPES<br />TO CHOOSE FROM</small></span>
            <span><b>24/7</b><small>WARM WELCOME<br />IN TACURONG</small></span>
          </div>
        </section>

        <section className="welcome royal-pattern" id="welcome">
          <p className="overline reveal">A NEW CHAPTER OF HOSPITALITY</p>
          <h2 className="display reveal">Wyattel Suite is a cozy hotel in the heart of Tacurong, created to offer a stay that feels <em>genuinely personal.</em></h2>
        </section>

        <section className="story paper-pattern" id="story">
          <div className="story-images reveal">
            <img className="story-main" loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=82" alt="Temporary reference image showing a styled guest room" />
            <img className="story-detail" loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=82" alt="Temporary reference image showing hotel architecture" />
          </div>
          <div className="story-copy reveal">
            <p className="overline">OUR STORY</p>
            <h2>Made for life’s<br /><em>in-between moments.</em></h2>
            <p>Wyattel Suite was created as more than a place to sleep. It is a reassuring arrival, a restful night and an easy morning—an intimate base for every reason that brings you to Tacurong.</p>
            <p>Warm service and thoughtful essentials come together in spaces that are unpretentious, comfortable and quietly refined.</p>
            <a className="line-link" href="#rooms">DISCOVER OUR ROOMS <Arrow /></a>
          </div>
        </section>

        <RoomsSection rooms={rooms} onOpenBooking={openBooking} />

        <section className="experience-heading royal-pattern reveal">
          <p className="overline">MORE THAN A PLACE TO STAY</p>
          <h2>A Wyattel<br /><em>experience.</em></h2>
          <p>Every part of your stay is connected by one simple idea: make comfort feel effortless.</p>
        </section>

        <section className="experiences">
          {experiences.map((item, index) => (
            <article className={`experience reveal ${index % 2 ? 'experience--reverse' : ''}`} key={item.title}>
              <div className="experience-image"><img loading="lazy" decoding="async" src={item.image} alt={item.title} style={{ objectPosition: item.position }} /><span>{item.number}</span></div>
              <div className="experience-copy">
                <p className="overline">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a className="line-link" href={index === 2 ? 'https://maps.google.com/?q=Wyattel+Suite+Tacurong' : '#contact'} target={index === 2 ? '_blank' : undefined} rel={index === 2 ? 'noreferrer' : undefined}>DISCOVER MORE <Arrow /></a>
              </div>
            </article>
          ))}
        </section>

        <section className="services royal-pattern">
          <div className="services-title reveal"><p className="overline">EXCLUSIVE SERVICES</p><h2>Everything you need,<br /><em>thoughtfully close.</em></h2></div>
          <div className="services-grid reveal">
            <div><b>01</b><span>Free Wi-Fi access</span></div><div><b>02</b><span>Free on-site parking</span></div><div><b>03</b><span>On-site restaurant</span></div><div><b>04</b><span>Various dishes served</span></div><div><b>05</b><span>Function hall for 50–100 guests</span></div><div><b>06</b><span>Air-conditioned rooms</span></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-image"><img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=82" alt="Temporary reference image showing a hotel facade" /></div>
          <div className="contact-content reveal"><Mark /><p className="overline">FIND YOUR WAY TO WYATTEL</p><h2>Your stay<br /><em>starts here.</em></h2><p>Prk. Waya-waya, National Highway<br />Tacurong City, Sultan Kudarat</p><p><a href="tel:+639122929592">0912 292 9592</a><br /><a href="tel:+639659770234">0965 977 0234</a></p><div className="contact-actions"><button className="primary-button" onClick={openBooking}>REQUEST A RESERVATION <Arrow /></button></div></div>
        </section>
      </main>

      <footer><Mark light /><p>WYATTEL SUITE<br />TACURONG CITY · SULTAN KUDARAT</p><div><a href="#rooms">ROOMS</a><a href="#story">OUR STORY</a><a href="https://www.facebook.com/WyattelSuites/" target="_blank" rel="noreferrer">FACEBOOK</a></div><small>© {new Date().getFullYear()} WYATTEL SUITE · ALL RIGHTS RESERVED</small></footer>

      {menuOpen && <div className="menu-overlay royal-pattern"><button className="overlay-close" onClick={() => setMenuOpen(false)}>CLOSE</button><Mark light /><nav>{[['01','HOME','#home'],['02','OUR STORY','#story'],['03','ROOMS & SUITES','#rooms'],['04','EXPERIENCE','#contact']].map(([n,label,href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}><small>{n}</small><span>{label}</span><Arrow /></a>)}</nav><div className="menu-contact"><span>TACURONG CITY, PHILIPPINES</span><span>0912 292 9592 · 0965 977 0234</span></div></div>}

      {bookingOpen && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setBookingOpen(false)}><section className="booking-modal paper-pattern"><button className="modal-close" onClick={() => setBookingOpen(false)}>×</button>{submitted ? <div className="booking-thanks"><div className="ornament">W</div><p className="overline">REQUEST RECEIVED</p><h2>Thank you.</h2><p>We’ve prepared your enquiry. For the fastest confirmation, please call Wyattel at either number.</p><div className="booking-phone-links"><a className="primary-button" href="tel:+639122929592">CALL 0912 292 9592</a><a className="line-link" href="tel:+639659770234">CALL 0965 977 0234 <Arrow /></a></div></div> : <><div className="request-heading"><p className="overline">INFORMATION REQUEST</p><Mark /></div><form className="request-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}><div className="request-message"><label htmlFor="message">MESSAGE</label><textarea id="message" name="message" placeholder="Tell us about your stay" /></div><div className="request-fields"><div className="request-field-row"><label>NAME<input required name="firstName" placeholder="Your name" /></label><label>SURNAME<input name="surname" placeholder="Optional" /></label></div><div className="request-field-row"><label>CHECK IN<input required name="checkIn" type="date" min={new Date().toISOString().slice(0, 10)} /></label><label>CHECK OUT<input required name="checkOut" type="date" min={new Date().toISOString().slice(0, 10)} /></label></div><div className="request-field-row"><label>GUESTS<select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label><label>ROOM<select name="room" defaultValue={rooms[0].name}>{rooms.map(room => <option key={room.name}>{room.name}</option>)}</select></label></div><label>EMAIL<input required name="email" type="email" placeholder="you@example.com" /></label><label>MOBILE<input required name="mobile" type="tel" placeholder="09XX XXX XXXX" /></label><label className="consent"><input required type="checkbox" name="consent" /> <span>I agree to the use of my personal data so Wyattel Suites can reply to my enquiry.</span></label><button className="request-submit" type="submit">SEND <Arrow /></button></div></form></>}</section></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)

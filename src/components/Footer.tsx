import React from 'react'
import { Arrow, BrandLogo } from './UI'

export default function Footer({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <footer className="site-footer footer-section">
      <div className="footer-main">
        <div className="footer-brand">
          <BrandLogo light className="footer-logo" />
          <p>A warm, personal stay in the heart of Tacurong City.</p>
          <button className="footer-booking-button" onClick={onOpenBooking}>BOOK YOUR STAY <Arrow /></button>
        </div>
        <div className="footer-column"><span>EXPLORE</span><a href="/">Home</a><a href="/suites">Our suites</a><a href="/gallery">Gallery</a><a href="/experiences">Dining & celebrations</a><a href="/journal">The Journal</a><a href="/our-story">Our story</a></div>
        <div className="footer-column"><span>VISIT</span><p data-selectable="true">Prk. Waya-waya<br />National Highway<br />Tacurong City, Sultan Kudarat</p><a href="/plan-your-stay">Plan your stay & FAQs</a><a className="footer-map" href="https://maps.google.com/?q=Wyattel+Suite+Tacurong" target="_blank" rel="noreferrer">OPEN IN MAPS <Arrow /></a></div>
        <div className="footer-column"><span>CONNECT</span><a href="tel:+639122929592">0912 292 9592</a><a href="tel:+639659770234">0965 977 0234</a><a href="https://www.facebook.com/WyattelSuites/" target="_blank" rel="noreferrer">Facebook</a><a href="/offers">Offers & quotations</a></div>
      </div>
      <div className="footer-bottom"><small>© {new Date().getFullYear()} WYATTEL SUITE · ALL RIGHTS RESERVED</small><small>TACURONG CITY · SULTAN KUDARAT · PHILIPPINES</small></div>
    </footer>
  )
}

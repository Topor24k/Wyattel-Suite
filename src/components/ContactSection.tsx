import React from 'react'
import { Arrow, BrandLogo } from './UI'

export default function ContactSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section className="contact contact-section" id="contact">
      <div className="contact-image"><img loading="lazy" decoding="async" src="/Pictures/Wyattel%20Hero%20Background.png" alt="Wyattel Suite building and entrance in Tacurong City" /></div>
      <div className="contact-content reveal">
        <div className="contact-logo-panel"><BrandLogo className="contact-logo" /></div>
        <p className="overline">FIND YOUR WAY TO WYATTEL</p>
        <h2>Your stay<br /><em>starts here.</em></h2>
        <p data-selectable="true">Prk. Waya-waya, National Highway<br />Tacurong City, Sultan Kudarat</p>
        <p><a href="tel:+639122929592">0912 292 9592</a><br /><a href="tel:+639659770234">0965 977 0234</a></p>
        <div className="contact-actions"><button className="contact-reservation-button" onClick={onOpenBooking}>REQUEST A RESERVATION <Arrow /></button></div>
      </div>
    </section>
  )
}

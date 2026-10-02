import React from 'react'
import { Arrow } from './UI'

export default function HeroSection() {
  return (
    <section className="hero hero-section" id="home">
      <img src="/Pictures/Wyattel%20Hero%20Background.png" alt="Wyattel Suite exterior in Tacurong City" fetchPriority="high" decoding="async" />
      <div className="hero-wash"></div>
      <div className="hero-content reveal">
        <p>WYATTEL SUITE · TACURONG CITY</p>
        <h1 tabIndex={-1} data-page-heading>STAY<br /><em>BEAUTIFULLY</em></h1>
        <a className="hero-cta" href="#welcome">DISCOVER YOUR STAY <Arrow /></a>
      </div>
      <div className="hero-meta" aria-label="Wyattel Suite highlights">
        <span><b>₱1,900</b><small>STARTING RATE<br />PER NIGHT</small></span>
        <span><b>05</b><small>SUITE TYPES<br />TO CHOOSE FROM</small></span>
        <span><b>24/7</b><small>WARM WELCOME<br />IN TACURONG</small></span>
      </div>
    </section>
  )
}

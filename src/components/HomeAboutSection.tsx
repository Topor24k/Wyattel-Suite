import React from 'react'
import { Arrow } from './UI'

export default function HomeAboutSection() {
  return <section className="home-about-section" id="about" aria-labelledby="home-about-title">
    <div className="home-about-layout site-content-width">
      <div className="home-about-images reveal">
        <img className="home-about-main-photo" src="/Pictures/Wyattel%20Story%20Main%20Background.png" alt="Romantic room arrangement at Wyattel Suite" loading="lazy" decoding="async" />
        <img className="home-about-detail-photo" src="/Pictures/Wyattel%20Story%20Detail%20Background.png" alt="Wyattel Suite reception desk" loading="lazy" decoding="async" />
      </div>
      <div className="home-about-copy reveal">
        <p className="overline">ABOUT WYATTEL</p>
        <h2 id="home-about-title">Made for life’s<br /><em>in-between moments.</em></h2>
        <p>Wyattel Suite is a welcoming base in Tacurong City for the moments that bring you here—from family visits and business trips to a celebration with your people.</p>
        <p>Warm service and thoughtful essentials come together in spaces that are unpretentious, comfortable and quietly refined. Arrive, settle in and feel a little more at home.</p>
        <a className="home-about-story-link" href="/our-story">GET TO KNOW WYATTEL <Arrow /></a>
      </div>
    </div>
  </section>
}

import React from 'react'
import { Arrow } from './UI'

export default function StorySection() {
  return (
    <section className="story story-section paper-pattern" id="story">
      <div className="story-images reveal">
        <img className="story-main" loading="lazy" decoding="async" src="/Pictures/Wyattel%20Story%20Main%20Background.png" alt="Romantic room arrangement at Wyattel Suite" />
        <img className="story-detail" loading="lazy" decoding="async" src="/Pictures/Wyattel%20Story%20Detail%20Background.png" alt="Wyattel Suite reception desk" />
      </div>
      <div className="story-copy reveal">
        <p className="overline">OUR STORY</p>
        <h2>Made for life’s<br /><em>in-between moments.</em></h2>
        <p>Wyattel Suite was created as more than a place to sleep. It is a reassuring arrival, a restful night and an easy morning—an intimate base for every reason that brings you to Tacurong.</p>
        <p>Warm service and thoughtful essentials come together in spaces that are unpretentious, comfortable and quietly refined.</p>
        <a className="line-link" href="/suites">DISCOVER OUR ROOMS <Arrow /></a>
      </div>
    </section>
  )
}

import React from 'react'
import PageNote from '../components/PageNote'
import StorySection from '../components/StorySection'
import ServicesSection from '../components/ServicesSection'
import { Arrow } from '../components/UI'

export default function StoryPage() {
  return <div className="wyattel-story-page"><PageNote eyebrow="OUR STORY" title="A personal kind of hospitality." description="Get to know the welcoming spaces and thoughtful touches that make Wyattel a place to arrive, settle in, and feel at ease." className="story-page-note" /><StorySection /><ServicesSection /><section className="guest-stories-note site-content-width"><p className="overline">YOUR WYATTEL MOMENTS</p><h2>Every stay has a story.</h2><p>Stayed with us? Share your experience with the Wyattel team. With your permission, your story could become part of this collection. In the meantime, find inspiration in our room and planning guides.</p><a href="/journal">EXPLORE THE JOURNAL <Arrow /></a></section></div>
}

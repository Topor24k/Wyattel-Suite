import React from 'react'
import PageNote from '../components/PageNote'
import ExperienceSection from '../components/ExperienceSection'
import { experiences } from '../data'

export default function ExperiencesPage() {
  return <div className="experiences-directory-page"><PageNote eyebrow="DINING & CELEBRATIONS" title="For the moments that matter." description="A wedding morning, a gathering of your people, or something delicious at the table. Discover the experiences that make Wyattel more than a place to stay." className="experiences-page-note" /><ExperienceSection experiences={experiences} /></div>
}

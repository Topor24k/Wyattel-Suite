import { PageHeader } from '../components/ui/PageHeader'
import ExperienceSection from '../components/ExperienceSection'
import { experiences } from '../data'
import type { OpenBooking } from '../types'

export default function ExperiencesPage({ onBook }: { onBook: OpenBooking }) {
  return (
    <>
      <PageHeader
        id="experiences"
        eyebrow="Dining & celebrations"
        title={<>For the moments <em>that matter.</em></>}
        description="A wedding morning, a gathering of your people, or something delicious at the table. Discover what makes Wyattel more than a place to stay."
      />
      <ExperienceSection experiences={experiences} onBook={onBook} />
    </>
  )
}

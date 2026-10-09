import { Car, Snowflake, Users, Utensils, UtensilsCrossed, Wifi, type LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Picture } from '../components/ui/Picture'
import { Eyebrow } from '../components/ui/Eyebrow'
import { ButtonLink } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { hotelServices } from '../data'

const serviceIcons: LucideIcon[] = [Wifi, Car, Utensils, UtensilsCrossed, Users, Snowflake]

export default function StoryPage() {
  return (
    <>
      <PageHeader
        id="story"
        eyebrow="Our story"
        title={<>A personal kind of <em>hospitality.</em></>}
        description="Get to know the welcoming spaces and thoughtful touches that make Wyattel a place to arrive, settle in, and feel at ease."
      />

      <Section surface="cream" aria-labelledby="story-title" containerClassName="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="grid grid-cols-5 gap-4 lg:col-span-6">
          <Picture src="/Pictures/Wyattel%20Story%20Main%20Background.png" alt="A Wyattel room arranged for a romantic stay" sizes="(min-width: 1024px) 30vw, 60vw" className="col-span-3 aspect-3/4 w-full object-cover" />
          <Picture src="/Pictures/Wyattel%20Story%20Detail%20Background.png" alt="The Wyattel reception desk" sizes="(min-width: 1024px) 20vw, 40vw" className="col-span-2 mt-16 aspect-3/4 w-full object-cover" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Eyebrow rule>Where it begins</Eyebrow>
          <h2 id="story-title" className="mt-6 text-heading tracking-tight text-navy-950">Made for life’s <em className="text-gold-700"><span className="whitespace-nowrap">in-between</span> moments.</em></h2>
          <div className="mt-8 space-y-5 text-base text-ink-muted" data-selectable="true">
            <p>Wyattel Suite was created as more than a place to sleep. It is a reassuring arrival, a restful night and an easy morning—an intimate base for every reason that brings you to Tacurong.</p>
            <p>Warm service and thoughtful essentials come together in spaces that are unpretentious, comfortable and quietly refined.</p>
          </div>
          <ButtonLink href="/suites" variant="text" arrow className="mt-10">Discover our rooms</ButtonLink>
        </div>
      </Section>

      <Section surface="navy" aria-labelledby="services-title">
        <Eyebrow tone="dark" rule>On site</Eyebrow>
        <h2 id="services-title" className="mt-6 text-heading tracking-tight">Everything you need, <em className="text-gold-400">thoughtfully close.</em></h2>
        <ul className="mt-14 grid gap-px bg-cream-50/10 sm:grid-cols-2 lg:grid-cols-3">
          {hotelServices.map((service, index) => {
            const Icon = serviceIcons[index] ?? Wifi
            return (
              <li key={service} className="flex items-center gap-5 bg-navy-950 py-8 sm:px-6">
                <Icon aria-hidden="true" size={22} strokeWidth={1.25} className="shrink-0 text-gold-400" />
                <span className="font-serif text-lede">{service}</span>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section surface="paper" aria-labelledby="guest-stories-title" containerClassName="max-w-3xl text-center">
        <Eyebrow className="justify-center">Your Wyattel moments</Eyebrow>
        <h2 id="guest-stories-title" className="mt-6 text-heading tracking-tight text-navy-950">Every stay has <em className="text-gold-700">a story.</em></h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-ink-muted">Stayed with us? Share your experience with the Wyattel team. With your permission, your story could become part of this collection. In the meantime, find inspiration in our room and planning guides.</p>
        <ButtonLink href="/journal" arrow className="mt-10">Explore the journal</ButtonLink>
      </Section>
    </>
  )
}

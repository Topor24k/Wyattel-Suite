import { Picture } from './ui/Picture'
import { Eyebrow } from './ui/Eyebrow'
import { ButtonLink } from './ui/Button'
import { Section } from './ui/Section'

export default function HomeAboutSection() {
  return (
    <Section surface="paper" id="about" aria-labelledby="home-about-title" data-section="home-about" containerClassName="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
      <div className="reveal relative pb-16 sm:pb-24 lg:col-span-6 lg:pb-0">
        <Picture
          src="/Pictures/Wyattel%20Story%20Main%20Background.png"
          alt="A Wyattel room prepared for a celebration, with rose petals arranged on the bed"
          sizes="(min-width: 1024px) 40vw, 85vw"
          className="aspect-4/5 w-10/12 object-cover max-md:rounded-2xl sm:w-9/12"
        />
        <Picture
          src="/Pictures/Wyattel%20Story%20Detail%20Background.png"
          alt="The Wyattel reception desk with its red lacquer counter and gold birdcage chair"
          sizes="(min-width: 1024px) 22vw, 50vw"
          className="absolute right-0 bottom-0 aspect-square w-6/12 border-8 border-cream-200 object-cover max-md:rounded-3xl sm:w-5/12 lg:-bottom-12"
        />
      </div>

      <div className="reveal lg:col-span-5 lg:col-start-8">
        <Eyebrow rule>About Wyattel</Eyebrow>
        <h2 id="home-about-title" className="mt-6 text-heading tracking-tight text-navy-950">
          Made for life’s <em className="text-gold-700"><span className="whitespace-nowrap">in-between</span> moments.</em>
        </h2>
        <div className="mt-8 space-y-5 text-base text-ink-muted" data-selectable="true">
          <p>Wyattel Suite is a welcoming base in Tacurong City for the moments that bring you here—from family visits and business trips to a celebration with your people.</p>
          <p>Warm service and thoughtful essentials come together in spaces that are unpretentious, comfortable and quietly refined. Arrive, settle in and feel a little more at home.</p>
        </div>
        <ButtonLink href="/our-story" variant="text" arrow className="mt-10">Get to know Wyattel</ButtonLink>
      </div>
    </Section>
  )
}

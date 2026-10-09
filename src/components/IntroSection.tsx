import { Picture } from './ui/Picture'
import { Eyebrow } from './ui/Eyebrow'
import { Section } from './ui/Section'
import { lowestRate, rooms } from '../data'
import { formatRate, pad } from '../utils/format'

const facts = [
  { value: pad(rooms.length), label: 'Suite types to choose from' },
  { value: formatRate(lowestRate), label: 'Listed rate from, per night' },
  { value: '50–100', label: 'Guests in the function hall' },
  { value: 'Free', label: 'Wi-Fi and on-site parking' },
]

export default function IntroSection() {
  return (
    <Section surface="cream" aria-label="Welcome to Wyattel Suite">
      <Eyebrow rule="both" className="reveal justify-center text-center">A new chapter of hospitality</Eyebrow>
      <p className="reveal mx-auto mt-10 max-w-6xl text-center font-serif text-statement tracking-tight text-balance text-navy-950 md:mt-14">
        Wyattel Suite is a cozy hotel{' '}
        <span className="inline-photo" aria-hidden="true">
          <Picture src="/Pictures/Wyattel%20Story%20Detail%20Background.png" alt="" sizes="160px" />
        </span>{' '}
        in the heart of Tacurong, created to offer a stay that feels{' '}
        <em className="text-gold-700">genuinely personal</em>{' '}
        <span className="inline-photo" aria-hidden="true">
          <Picture src="/Deluxe%20Suite%20Images/Wyattel%20Suite%20Deluxe%201.png" alt="" sizes="160px" />
        </span>
      </p>

      <dl className="reveal mt-16 grid grid-cols-2 border-t border-ink/15 md:mt-24 lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col border-b border-ink/15 py-8 even:border-l even:pl-6 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
            <dt className="text-sm text-ink-muted">{fact.label}</dt>
            <dd className="order-first mb-2 font-serif text-title text-navy-950">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

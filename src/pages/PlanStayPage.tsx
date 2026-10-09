import { Plus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Picture } from '../components/ui/Picture'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button, ButtonLink } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { hotelAddressLines, hotelFacebook, hotelMaps, hotelPhones } from '../data/site'

const questions = [
  ['How do I request a room?', 'Choose your suite and connected stay dates in the booking form. An enquiry is not a confirmed booking. The team must confirm availability, current pricing, and your arrangements. If online sending is unavailable, open the prepared email draft and send it from your email app.'],
  ['Can I request a one-day stay?', 'The form supports a single date or one connected range of dates. The hotel must confirm whether a day-use arrangement or overnight stay is available, and how charges are calculated.'],
  ['What are the check-in and check-out times?', 'Official times have not been confirmed for this website. Ask the team before travelling, especially if you need early arrival, late departure, or wedding preparation access.'],
  ['How many guests can stay in a suite?', 'Capacity depends on the room and the hotel’s approved arrangements. Share your group size and children’s ages with the team. The guest selector is an enquiry field, not a guarantee that a suite can accommodate that number.'],
  ['What about payment, changes, and cancellation?', 'Request a written quotation and confirmation of deposits, accepted payment methods, cancellation terms, and change policies directly from the hotel before paying. No payment is taken by this website.'],
  ['Can the hotel accommodate accessibility needs?', 'Describe any step-free access, bathroom, bed-height, or other requirements when enquiring. Ask the team to confirm the exact facilities and access arrangements; a suite name is not an accessibility guarantee.'],
  ['Can I arrange dining or an event?', 'Contact the hotel by phone or Facebook. Share your occasion, date, estimated attendance, and menu requirements. Venue capacity, supplier access, inclusions, and pricing must be confirmed by the hotel.'],
]

const checklist = [
  ['01', 'Your arrival', 'Confirm check-in and check-out times, your route, parking arrangements, and any early or late access.'],
  ['02', 'Your room', 'Confirm guests, beds, current rates, inclusions, and any accessibility requirements.'],
  ['03', 'Your arrangements', 'Request written payment, cancellation, visitor, and event terms before confirming.'],
]

export default function PlanStayPage({ onBook }: { onBook: () => void }) {
  return (
    <>
      <PageHeader
        id="plan"
        eyebrow="Plan your stay"
        title={<>A little planning. <em>A lighter stay.</em></>}
        description="Find your way to Wyattel, read our helpful answers, and gather the details you need before arriving in Tacurong."
      />

      <Section surface="cream" aria-labelledby="arrival-title" containerClassName="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <Eyebrow rule>Find your way</Eyebrow>
          <h2 id="arrival-title" className="mt-6 text-heading tracking-tight text-navy-950">We’ll meet you <em className="text-gold-700">in Tacurong.</em></h2>
          <address className="mt-8 font-serif text-lede not-italic text-ink" data-selectable="true">
            {hotelAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
          </address>
          <div className="mt-6 flex flex-col text-sm">
            {hotelPhones.map((phone) => <a key={phone.href} href={phone.href} className="min-h-8 text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">{phone.label}</a>)}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={hotelMaps} target="_blank" rel="noreferrer" arrow>Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span></ButtonLink>
            <ButtonLink href={hotelFacebook} target="_blank" rel="noreferrer" variant="secondary">Message on Facebook<span className="sr-only"> (opens in a new tab)</span></ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Picture src="/Pictures/Wyattel%20Hero%20Background.png" alt="Wyattel building and entrance on the National Highway" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-4/3 w-full object-cover" />
        </div>
      </Section>

      <Section surface="navy" aria-labelledby="checklist-title">
        <Eyebrow tone="dark" rule>Your arrival checklist</Eyebrow>
        <h2 id="checklist-title" className="mt-6 text-heading tracking-tight">Before you <em className="text-gold-400">set off.</em></h2>
        <ol className="mt-14 grid gap-px bg-cream-50/10 md:grid-cols-3">
          {checklist.map(([number, title, text]) => (
            <li key={number} className="bg-navy-950 py-8 md:px-8 md:first:pl-0">
              <span className="font-serif text-title text-gold-400">{number}</span>
              <h3 className="mt-6 text-title">{title}</h3>
              <p className="mt-3 text-sm text-navy-200" data-selectable="true">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="cream" id="faqs" aria-labelledby="faq-title" containerClassName="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow rule>Good to know</Eyebrow>
          <h2 id="faq-title" className="mt-6 text-heading tracking-tight text-navy-950">A few helpful <em className="text-gold-700">answers.</em></h2>
        </div>
        <div className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {questions.map(([question, answer]) => (
            <details key={question} className="group border-b border-ink/15">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-serif text-lede text-navy-950">
                {question}
                <Plus aria-hidden="true" size={20} strokeWidth={1.25} className="shrink-0 text-gold-700 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="max-w-prose pb-6 text-base text-ink-muted" data-selectable="true">{answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section surface="paper" aria-labelledby="plan-next-title" containerClassName="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow rule>The next step</Eyebrow>
          <h2 id="plan-next-title" className="mt-6 text-heading tracking-tight text-navy-950">Let’s make it <em className="text-gold-700">your stay.</em></h2>
        </div>
        <Button size="lg" arrow onClick={onBook}>Request a stay</Button>
      </Section>
    </>
  )
}

import { PageHeader } from '../components/ui/PageHeader'
import { Picture } from '../components/ui/Picture'
import { Button, ButtonLink } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import { activeOffers } from '../data/offers'
import type { OpenBooking } from '../types'
import { cx } from '../utils/cx'

const ideas = [
  { title: 'A wedding beginning', text: 'Ask about a preparation room and photo-shoot arrangements for your wedding morning.', image: '/Pictures/Wyattel%20Suite%20Wedding.png', note: 'I would like a quotation for a wedding preparation room.' },
  { title: 'Time with your people', text: 'Planning a family visit or a group celebration? Share your dates and the space you need.', image: '/Family%20Suite%20Images/Wyattel%20Suite%20Family%201.png', note: 'I would like a quotation for a family or group stay.' },
  { title: 'Something at the table', text: 'Enquire about current dining options for your stay or a gathering.', image: '/Pictures/Wyattel%20Suite%20Filipino%20Menu.png', note: 'I would like to ask about dining options for my stay or a gathering.', contain: true },
]

export default function OffersPage({ onBook }: { onBook: OpenBooking }) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
  const offers = activeOffers(today)

  return (
    <>
      <PageHeader
        id="offers"
        eyebrow="Offers & quotations"
        title={<>Good things are <em>worth confirming.</em></>}
        description={offers.length
          ? 'Explore our current hotel-approved offers. Contact the team to confirm availability and the arrangements for your stay.'
          : 'There are no confirmed promotional offers listed at the moment. Tell the team about your dates and plans for current availability and a personal quotation.'}
      />

      <div className={cx(containerClass, 'pt-12 pb-20 md:pt-16 md:pb-32')}>
        {offers.length > 0 && (
          <section aria-label="Current offers" className="grid gap-14 pb-20">
            {offers.map((offer) => (
              <article key={offer.id} className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <Picture src={offer.image} alt={offer.title} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-3/2 w-full object-cover lg:col-span-7" />
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="text-eyebrow font-medium uppercase text-gold-700">Valid {offer.starts} – {offer.ends}</p>
                  <h2 className="mt-4 text-heading tracking-tight text-navy-950">{offer.title}</h2>
                  <p className="mt-6 text-base text-ink-muted">{offer.description}</p>
                  <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ink" data-selectable="true">{offer.inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
                  <p className="mt-6 text-xs text-ink-muted" data-selectable="true">{offer.terms}</p>
                  <Button arrow className="mt-8" onClick={() => onBook({ note: `I would like to enquire about: ${offer.title}` })}>Enquire about this offer</Button>
                </div>
              </article>
            ))}
          </section>
        )}

        <section aria-labelledby="ideas-title">
          <h2 id="ideas-title" className="text-title text-navy-950">Ask us for a quotation</h2>
          <p className="mt-2 text-sm text-ink-muted">Ideas to start a conversation. These are not confirmed packages.</p>
          <div className="mt-10 grid gap-14 md:grid-cols-3 md:gap-8">
            {ideas.map((idea) => (
              <article key={idea.title} className="flex flex-col">
                <Picture src={idea.image} alt="" sizes="(min-width: 768px) 30vw, 100vw" placeholder={!idea.contain} className={cx('aspect-4/5 w-full', idea.contain ? 'bg-cream-200 object-contain p-6' : 'object-cover')} />
                <h3 className="mt-6 text-title text-navy-950">{idea.title}</h3>
                <p className="mt-3 flex-1 text-sm text-ink-muted">{idea.text}</p>
                <Button variant="text" arrow className="mt-6 self-start" onClick={() => onBook({ note: idea.note })}>Request a quotation</Button>
              </article>
            ))}
          </div>
          <p className="mt-16 text-sm text-ink-muted">
            Prefer to browse first? <ButtonLink href="/suites" variant="text" className="ml-2">See all suites</ButtonLink>
          </p>
        </section>
      </div>
    </>
  )
}

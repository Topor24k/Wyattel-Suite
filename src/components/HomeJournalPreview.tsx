import { journalArticles } from '../data/journal'
import { JournalCard } from './JournalCard'
import { Eyebrow } from './ui/Eyebrow'
import { ButtonLink } from './ui/Button'
import { Section } from './ui/Section'

export default function HomeJournalPreview() {
  return (
    <Section surface="cream" aria-labelledby="home-journal-title" data-section="home-journal">
      <div className="reveal flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow rule>From the journal</Eyebrow>
          <h2 id="home-journal-title" className="mt-6 text-heading tracking-tight text-navy-950">
            A little <em className="text-gold-700">inspiration.</em>
          </h2>
        </div>
        <ButtonLink href="/journal" variant="text" arrow className="self-start md:self-auto">All stories</ButtonLink>
      </div>
      <div className="reveal mt-10 grid md:mt-20 md:grid-cols-2 md:gap-8 lg:gap-16 max-md:rail max-md:-mx-4 max-md:scroll-px-4 max-md:px-4 sm:max-md:-mx-8 sm:max-md:scroll-px-8 sm:max-md:px-8">
        {journalArticles.slice(0, 2).map((article, index) => (
          <div key={article.slug} className={index === 1 ? 'max-md:w-4/5 md:mt-24' : 'max-md:w-4/5'}>
            <JournalCard article={article} />
          </div>
        ))}
      </div>
    </Section>
  )
}

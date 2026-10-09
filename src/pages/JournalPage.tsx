import { useState } from 'react'
import { Search } from 'lucide-react'
import { journalArticles } from '../data/journal'
import { JournalCard } from '../components/JournalCard'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import { cx } from '../utils/cx'

const ALL = 'All stories'
const categories = [ALL, ...new Set(journalArticles.map((article) => article.category))]

export default function JournalPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const needle = query.trim().toLowerCase()
  const filtered = journalArticles.filter((article) =>
    (category === ALL || article.category === category) &&
    `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(needle),
  )
  const [featured, ...others] = filtered
  const reset = () => { setQuery(''); setCategory(ALL) }

  return (
    <>
      <PageHeader
        id="journal"
        eyebrow="The Wyattel journal"
        title={<>Stories for <em>your stay.</em></>}
        description="Room guides, celebration ideas, and practical notes for a visit that feels a little more personal."
      />

      <div className={cx(containerClass, 'pt-12 pb-20 md:pt-16 md:pb-32')}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter stories by topic" className="flex flex-wrap gap-2 max-md:-mx-4 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-4 sm:max-md:-mx-8 sm:max-md:px-8 scrollbar-none">
            {categories.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className="inline-flex min-h-10 shrink-0 items-center border border-ink/20 px-4 max-md:rounded-full text-eyebrow font-semibold uppercase text-navy-950 transition-colors hover:border-navy-950 aria-pressed:border-navy-950 aria-pressed:bg-navy-950 aria-pressed:text-cream-50"
              >
                {value}
              </button>
            ))}
          </div>
          <label className="flex min-h-11 items-center gap-3 border-b border-ink/30 focus-within:border-navy-950 max-md:rounded-full max-md:border max-md:border-ink/15 max-md:bg-cream-50 max-md:px-4 md:w-72">
            <Search aria-hidden="true" size={16} strokeWidth={1.5} className="text-ink-muted" />
            <span className="sr-only">Search stories</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories"
              className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-muted"
            />
          </label>
        </div>

        <p className="mt-8 text-sm text-ink-muted" role="status">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}{category !== ALL ? ` in ${category.toLowerCase()}` : ''}{needle ? ` matching “${query.trim()}”` : ''}
        </p>

        {featured ? (
          <div className="mt-10 grid gap-16 lg:gap-20">
            <JournalCard article={featured} headingLevel="h2" featured />
            {others.length > 0 && (
              <div className="grid gap-14 border-t border-ink/15 pt-14 md:grid-cols-2 md:gap-8 lg:gap-16">
                {others.map((article) => <JournalCard key={article.slug} article={article} headingLevel="h2" />)}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-ink/25 px-6 py-16 text-center">
            <h2 className="text-title text-navy-950">No stories match that search.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink-muted">Try a different word, or browse every story in the journal.</p>
            <Button variant="secondary" className="mt-8" onClick={reset}>Show all stories</Button>
          </div>
        )}
      </div>
    </>
  )
}

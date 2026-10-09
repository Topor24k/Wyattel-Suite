import { Picture } from './ui/Picture'
import type { JournalArticle } from '../data/journal'
import { cx } from '../utils/cx'

type Props = { article: JournalArticle; headingLevel?: 'h2' | 'h3'; featured?: boolean }

/** Whole-card link to a journal story; the title is the accessible name. */
export function JournalCard({ article, headingLevel: Heading = 'h3', featured = false }: Props) {
  return (
    <article className="group relative" data-journal-card={article.slug}>
      <div className="overflow-hidden max-md:rounded-2xl">
        <Picture
          src={article.image}
          alt={article.imageAlt}
          sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 768px) 45vw, 100vw'}
          className={cx('w-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-105 motion-reduce:transform-none', featured ? 'aspect-16/10' : 'aspect-4/3')}
        />
      </div>
      <p className="mt-6 text-eyebrow font-medium uppercase text-gold-700">{article.category} · {article.readTime.toLowerCase()}</p>
      <Heading className={cx('mt-3 tracking-tight text-navy-950', featured ? 'text-heading' : 'text-title')}>
        <a href={`/journal/${article.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline group-hover:decoration-gold-500 group-hover:decoration-1 group-hover:underline-offset-4">
          {article.title}
        </a>
      </Heading>
      <p className="mt-3 max-w-prose text-sm text-ink-muted">{article.summary}</p>
    </article>
  )
}

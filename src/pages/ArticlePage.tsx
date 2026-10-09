import { useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'
import { journalArticles, type JournalArticle } from '../data/journal'
import { JournalCard } from '../components/JournalCard'
import { Picture } from '../components/ui/Picture'
import { Eyebrow } from '../components/ui/Eyebrow'
import { ButtonLink } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import { cx } from '../utils/cx'
import { pad } from '../utils/format'

export default function ArticlePage({ article }: { article: JournalArticle }) {
  const [shareStatus, setShareStatus] = useState('')
  const related = journalArticles.filter((item) => article.related.includes(item.slug))
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('Link copied.')
    } catch {
      setShareStatus('Copy the address from your browser to share this story.')
    }
  }

  return (
    <article aria-labelledby="article-title">
      <header className={cx(containerClass, 'pt-28 md:pt-36')}>
        <ButtonLink href="/journal" variant="text" arrow="back">The journal</ButtonLink>
        <div className="mx-auto mt-12 max-w-4xl text-center md:mt-16">
          <p className="text-eyebrow font-medium uppercase text-gold-700">{article.category} · {article.readTime.toLowerCase()}</p>
          <h1 id="article-title" tabIndex={-1} data-page-heading className="mt-6 text-heading tracking-tight text-navy-950">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-lede text-ink-muted">{article.summary}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-muted">
            <span>Wyattel editorial · planning guide</span>
            <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy-950 underline decoration-ink/25 underline-offset-4 hover:decoration-navy-950">
              <LinkIcon aria-hidden="true" size={14} strokeWidth={1.5} />
              Copy link
            </button>
            <span role="status" className="w-full">{shareStatus}</span>
          </div>
        </div>
      </header>

      <div className={cx(containerClass, 'mt-10 md:mt-14')}>
        <Picture src={article.image} alt={article.imageAlt} priority sizes="100vw" className="aspect-video max-h-screen w-full object-cover" />
      </div>

      <div className={cx(containerClass, 'grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8')}>
        <nav aria-label="In this story" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>In this story</Eyebrow>
            <ol className="mt-4 border-t border-ink/15">
              {article.sections.map((section, index) => (
                <li key={section.title} className="border-b border-ink/15">
                  <a href={`#article-section-${index}`} className="flex min-h-11 gap-3 py-3 text-sm text-ink hover:text-gold-700">
                    <span className="text-ink-muted tabular-nums">{pad(index + 1)}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="lg:col-span-7 lg:col-start-5" data-selectable="true">
          {article.sections.map((section, index) => (
            <section key={section.title} id={`article-section-${index}`} className="scroll-mt-28 [&+&]:mt-14">
              <h2 className="text-title tracking-tight text-navy-950">{section.title}</h2>
              <div className="mt-5 space-y-5 text-base text-ink">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
          <aside className="mt-16 border-l-2 border-gold-500 bg-cream-50 p-6 md:p-8">
            <p className="text-sm text-ink-muted">This is an editorial planning guide, not a guest testimonial or a confirmed hotel package. Ask Wyattel to confirm current arrangements for your visit.</p>
            <ButtonLink href={article.action.href} arrow className="mt-6">{article.action.label}</ButtonLink>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-cream-200 py-20 md:py-28">
          <div className={containerClass}>
            <Eyebrow rule>Keep exploring</Eyebrow>
            <h2 id="related-title" className="mt-6 text-heading tracking-tight text-navy-950">A little more <em className="text-gold-700">inspiration.</em></h2>
            <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-8 lg:gap-16">
              {related.map((item) => <JournalCard key={item.slug} article={item} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

import React, { useState } from 'react'
import { journalArticles } from '../data/journal'
import type { JournalArticle } from '../data/journal'
import PageNote from '../components/PageNote'
import { Arrow } from '../components/UI'

export function JournalCard({ article }: { article: JournalArticle }) {
  return <article className="journal-story-card"><a className="journal-story-image" href={`/journal/${article.slug}`}><img src={article.image} alt={article.imageAlt} loading="lazy" decoding="async" /></a><div><p className="overline">{article.category} · {article.readTime}</p><h2><a href={`/journal/${article.slug}`}>{article.title}</a></h2><p>{article.summary}</p><a className="journal-story-link" href={`/journal/${article.slug}`}>READ THE STORY <Arrow /></a></div></article>
}

export default function JournalPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All stories')
  const filtered = journalArticles.filter(article => (category === 'All stories' || article.category === category) && `${article.title} ${article.summary}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="journal-page"><PageNote eyebrow="THE WYATTEL JOURNAL" title="Stories for your stay." description="Thoughtful room guides, celebration ideas, and practical notes for a visit that feels a little more personal." className="journal-page-note" />
    <section className="journal-content site-content-width"><div className="journal-tools"><div role="group" aria-label="Filter journal stories">{['All stories', 'Stay notes', 'Celebrations', 'Local notes'].map(value => <button type="button" className="journal-filter" aria-pressed={category === value} key={value} onClick={() => setCategory(value)}>{value}</button>)}</div><label className="journal-search">SEARCH STORIES<input type="search" placeholder="Find a story…" value={query} onChange={event => setQuery(event.target.value)} /></label></div><p className="journal-count" role="status">{filtered.length} {filtered.length === 1 ? 'story' : 'stories'}</p><div className="journal-story-grid">{filtered.map(article => <JournalCard key={article.slug} article={article} />)}</div>{filtered.length === 0 && <div className="site-empty-state"><h2>No stories found.</h2><p>Try a different word or browse all our stories.</p><button className="journal-reset" onClick={() => { setQuery(''); setCategory('All stories') }}>SHOW ALL STORIES</button></div>}</section>
  </div>
}

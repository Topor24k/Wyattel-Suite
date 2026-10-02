import React from 'react'
import { journalArticles } from '../data/journal'
import { JournalCard } from '../pages/JournalPage'
import { Arrow } from './UI'
export default function HomeJournalPreview() {
  return <section className="home-journal-preview site-content-width"><div className="home-journal-heading"><div><p className="overline">FROM THE JOURNAL</p><h2>A little inspiration.</h2></div><a className="home-journal-link" href="/journal">ALL STORIES <Arrow /></a></div><div className="journal-story-grid">{journalArticles.slice(0, 2).map(article => <JournalCard key={article.slug} article={article} />)}</div></section>
}

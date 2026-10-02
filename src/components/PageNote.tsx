import React from 'react'

type Props = { eyebrow: string; title: string; description: string; className: string; selectable?: boolean }

// One presentation recipe; each tab retains its own selector for targeted edits.
export default function PageNote({ eyebrow, title, description, className, selectable = false }: Props) {
  const headingId = `${className}-title`
  return <section className={`site-page-note-section ${className}-section site-content-width`} aria-labelledby={headingId}>
    <div className={`offers-honest-note site-page-note ${className}`}>
      <p className="overline">{eyebrow}</p>
      <h1 id={headingId} tabIndex={-1} data-page-heading>{title}</h1>
      <p data-selectable={selectable ? 'true' : undefined}>{description}</p>
    </div>
  </section>
}

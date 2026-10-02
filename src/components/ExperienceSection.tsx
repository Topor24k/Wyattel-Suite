import React from 'react'
import type { Experience } from '../types'
import { Arrow } from './UI'

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
      <section className="experiences experience-list">
        {experiences.map((item, index) => (
          <article id={item.id} className={`experience experience-card--${item.id} reveal ${index % 2 ? 'experience--reverse' : ''}`} key={item.id}>
            <div className="experience-image"><img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} style={{ objectPosition: item.position }} /><span>{item.number}</span></div>
            <div className="experience-copy">
              <p className="overline">{item.eyebrow}</p><h3>{item.title}</h3><p>{item.text}</p>
              <a className="line-link" href={item.id === 'modern-luxury' ? '/suites' : item.id === 'dining' ? '/gallery?category=Dining' : '/#contact'}>DISCOVER MORE <Arrow /></a>
            </div>
          </article>
        ))}
      </section>
  )
}

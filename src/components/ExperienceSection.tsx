import React from 'react'
import type { Experience } from '../types'
import { Arrow } from './UI'

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <>
      <section className="experience-heading experience-section royal-pattern reveal">
        <p className="overline">MORE THAN A PLACE TO STAY</p>
        <h2>A Wyattel<br /><em>experience.</em></h2>
        <p>Say “I do”, stay in modern luxury, celebrate every occasion and savour delicious dining—all at Wyattel Suite.</p>
      </section>
      <section className="experiences experience-list">
        {experiences.map((item, index) => (
          <article id={`experience-${item.id}`} className={`experience experience-card--${item.id} reveal ${index % 2 ? 'experience--reverse' : ''}`} key={item.id}>
            <div className="experience-image"><img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} style={{ objectPosition: item.position }} /><span>{item.number}</span></div>
            <div className="experience-copy">
              <p className="overline">{item.eyebrow}</p><h3>{item.title}</h3><p>{item.text}</p>
              <a className="line-link" href="#contact">DISCOVER MORE <Arrow /></a>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

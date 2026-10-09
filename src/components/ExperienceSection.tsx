import type { Experience, OpenBooking } from '../types'
import { Picture } from './ui/Picture'
import { Button, ButtonLink } from './ui/Button'
import { containerClass } from './ui/Section'
import { cx } from '../utils/cx'

export default function ExperienceSection({ experiences, onBook }: { experiences: Experience[]; onBook: OpenBooking }) {
  return (
    <div className={cx(containerClass, 'pb-20 md:pb-32')}>
      {experiences.map((item, index) => {
        const reversed = index % 2 === 1
        const contain = item.id === 'dining'
        return (
          <article id={item.id} key={item.id} aria-labelledby={`${item.id}-title`} className="reveal grid scroll-mt-24 gap-10 border-t border-ink/15 py-14 first:border-t-0 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className={cx('relative lg:col-span-7', reversed && 'lg:col-start-6 lg:row-start-1')}>
              <Picture
                src={item.image}
                alt={item.imageAlt}
                sizes="(min-width: 1024px) 55vw, 100vw"
                placeholder={!contain}
                className={cx('aspect-4/3 w-full', contain ? 'bg-cream-200 object-contain p-6' : 'object-cover')}
              />
              <span aria-hidden="true" className={cx('absolute -top-6 font-serif text-display leading-none text-gold-500/70 md:-top-10', reversed ? 'left-4 md:-left-6' : 'right-4 md:-right-6')}>{item.number}</span>
            </div>
            <div className={cx('lg:col-span-4', reversed ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-9')}>
              <p className="text-eyebrow font-medium uppercase text-gold-700">{item.eyebrow}</p>
              <h2 id={`${item.id}-title`} className="mt-4 text-heading tracking-tight text-navy-950">{item.title}</h2>
              <p className="mt-6 text-base text-ink-muted" data-selectable="true">{item.text}</p>
              <div className="mt-10">
                {item.action.href
                  ? <ButtonLink href={item.action.href} variant="text" arrow>{item.action.label}</ButtonLink>
                  : <Button arrow onClick={() => onBook({ note: item.action.enquiryNote })}>{item.action.label}</Button>}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

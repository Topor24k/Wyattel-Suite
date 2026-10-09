import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'
import { containerClass } from './Section'
import { cx } from '../../utils/cx'

type PageHeaderProps = {
  /** Unique per page; also used to label the header region. */
  id: string
  eyebrow: string
  title: ReactNode
  description: ReactNode
  /** Extra content under the description, such as a meta line or actions. */
  children?: ReactNode
  className?: string
}

/** Opening block for every inner page: label, headline, and a short introduction. */
export function PageHeader({ id, eyebrow, title, description, children, className }: PageHeaderProps) {
  const titleId = `${id}-title`
  return (
    <header className={cx('bg-cream-100 pt-24 md:pt-44', className)} aria-labelledby={titleId} data-page-header={id}>
      <div className={cx(containerClass, 'grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10')}>
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <h1 id={titleId} tabIndex={-1} data-page-heading className="mt-5 text-heading tracking-tight text-navy-950 md:mt-8 [&_em]:text-gold-700">
            {title}
          </h1>
        </div>
        <div className="min-w-0 lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="font-serif text-lede text-ink-muted" data-selectable="true">{description}</p>
          {children}
        </div>
      </div>
      <div className={cx(containerClass, 'mt-10 md:mt-20')}>
        <div className="h-px bg-ink/15" />
      </div>
    </header>
  )
}

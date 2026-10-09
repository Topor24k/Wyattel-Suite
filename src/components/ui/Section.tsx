import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

type Surface = 'cream' | 'paper' | 'navy'

const surfaces: Record<Surface, string> = {
  cream: 'bg-cream-100 text-ink',
  paper: 'bg-cream-200 text-ink',
  navy: 'bg-navy-950 text-cream-50',
}

/** Centred, gutter-padded content column shared by every page. */
export const containerClass = 'mx-auto w-full max-w-site px-4 sm:px-8 lg:px-12'

type SectionProps = HTMLAttributes<HTMLElement> & {
  surface?: Surface
  children: ReactNode
  /** Classes for the inner width-constrained container. */
  containerClassName?: string
}

/** Full-bleed band with a centred content column. */
export function Section({ surface = 'cream', className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cx(surfaces[surface], 'py-16 md:py-28 lg:py-36', className)} {...props}>
      <div className={cx(containerClass, containerClassName)}>{children}</div>
    </section>
  )
}

import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

type EyebrowProps = {
  children: ReactNode
  tone?: 'light' | 'dark'
  /** Draws the short gold rule before the label; `both` frames a centred label on each side. */
  rule?: boolean | 'both'
  className?: string
  as?: 'p' | 'span'
}

export function Eyebrow({ children, tone = 'light', rule = false, className, as: Tag = 'p' }: EyebrowProps) {
  // Framing rules are shorter on phones so a centred label stays on one line.
  const ruleMark = <span aria-hidden="true" className={cx('h-px shrink-0', rule === 'both' ? 'w-4 sm:w-8' : 'w-8', tone === 'light' ? 'bg-gold-500' : 'bg-gold-400')} />
  return (
    <Tag
      className={cx(
        'flex items-center gap-3 font-sans text-eyebrow font-medium uppercase',
        tone === 'light' ? 'text-gold-700' : 'text-gold-400',
        className,
      )}
    >
      {rule && ruleMark}
      {children}
      {rule === 'both' && ruleMark}
    </Tag>
  )
}

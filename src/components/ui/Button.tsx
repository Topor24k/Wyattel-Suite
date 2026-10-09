import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cx } from '../../utils/cx'

export type ButtonVariant = 'primary' | 'secondary' | 'text'
export type ButtonTone = 'light' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

type StyleOptions = {
  variant?: ButtonVariant
  /** The surface the button sits on: `light` for cream, `dark` for navy or photos. */
  tone?: ButtonTone
  size?: ButtonSize
  className?: string
}

const base =
  'group inline-flex max-w-full shrink-0 items-center justify-center gap-3 text-center font-sans text-eyebrow font-semibold uppercase tracking-label ' +
  'transition-[background-color,color,border-color,opacity,scale] duration-200 ease-out-soft active:scale-98 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4',
  md: 'min-h-12 px-6',
  lg: 'min-h-14 px-8',
}

const variants: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    light: 'bg-navy-950 text-cream-50 hover:bg-navy-700 focus-visible:outline-navy-950',
    dark: 'bg-cream-50 text-navy-950 hover:bg-gold-400 focus-visible:outline-cream-50',
  },
  secondary: {
    light: 'border border-navy-950/80 text-navy-950 hover:border-navy-950 hover:bg-navy-950 hover:text-cream-50 focus-visible:outline-navy-950',
    dark: 'border border-cream-50/60 text-cream-50 hover:border-cream-50 hover:bg-cream-50 hover:text-navy-950 focus-visible:outline-cream-50',
  },
  text: {
    light: 'min-h-11 border-b border-gold-500 pb-1 text-navy-950 hover:border-navy-950 focus-visible:outline-navy-950',
    dark: 'min-h-11 border-b border-gold-400 pb-1 text-cream-50 hover:border-cream-50 focus-visible:outline-cream-50',
  },
}

export function buttonStyles({ variant = 'primary', tone = 'light', size = 'md', className }: StyleOptions = {}): string {
  return cx(base, variant !== 'text' && sizes[size], variants[variant][tone], className)
}

type Direction = 'forward' | 'back'

export function ArrowIcon({ direction = 'forward' }: { direction?: Direction }) {
  const Icon = direction === 'back' ? ArrowLeft : ArrowRight
  return (
    <Icon
      aria-hidden="true"
      size={16}
      strokeWidth={1.25}
      className={cx(
        'shrink-0 transition-transform duration-200 ease-out-soft motion-reduce:transition-none',
        direction === 'back' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
      )}
    />
  )
}

type CommonProps = StyleOptions & { children: ReactNode; arrow?: Direction | boolean }

const renderContent = (children: ReactNode, arrow: CommonProps['arrow']) => {
  const direction: Direction | null = arrow === true ? 'forward' : arrow || null
  return (
    <>
      {direction === 'back' && <ArrowIcon direction="back" />}
      {children}
      {direction === 'forward' && <ArrowIcon />}
    </>
  )
}

export function Button({ variant, tone, size, className, children, arrow = false, type = 'button', ...props }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonStyles({ variant, tone, size, className })} {...props}>
      {renderContent(children, arrow)}
    </button>
  )
}

export function ButtonLink({ variant, tone, size, className, children, arrow = false, ...props }: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonStyles({ variant, tone, size, className })} {...props}>
      {renderContent(children, arrow)}
    </a>
  )
}

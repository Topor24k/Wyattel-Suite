import { cx } from '../../utils/cx'

/** The Wyattel wordmark, drawn in `currentColor`. */
export function Logo({ className }: { className?: string }) {
  return <span role="img" aria-label="Wyattel Suite" className={cx('brand-mark', className)} />
}

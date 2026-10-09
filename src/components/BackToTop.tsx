import { ArrowUp } from 'lucide-react'
import { cx } from '../utils/cx'

/** Desktop only: on phones, tapping the current tab scrolls to the top instead. */
export default function BackToTop({ visible }: { visible: boolean }) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      onClick={() => {
        window.scrollTo({ top: 0 })
        document.querySelector<HTMLElement>('[data-page-heading]')?.focus({ preventScroll: true })
      }}
      className={cx(
        'fixed right-8 bottom-8 z-30 hidden size-12 place-items-center rounded-full border border-cream-50/20 bg-navy-950 text-cream-50 transition-[opacity,transform,background-color] duration-200 ease-out-soft hover:bg-navy-700 md:grid',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ArrowUp aria-hidden="true" size={18} strokeWidth={1.5} />
    </button>
  )
}

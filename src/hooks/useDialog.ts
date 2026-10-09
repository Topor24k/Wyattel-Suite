import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const focusableWithin = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.closest('[hidden], [inert]') && element.getClientRects().length > 0,
  )

type Options = {
  onClose: () => void
  /** Element to focus on open; defaults to the first focusable control. */
  initialFocus?: RefObject<HTMLElement | null>
}

/**
 * Modal dialog behaviour shared by every overlay: moves focus in on open,
 * keeps Tab inside, closes on Escape, and returns focus to the trigger.
 */
export function useDialog<T extends HTMLElement>({ onClose, initialFocus }: Options) {
  const ref = useRef<T>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  // Read the trigger during the first render: by the time effects run, the page
  // behind the dialog is already inert and the browser has moved focus to <body>.
  const [returnTo] = useState(() => {
    if (typeof document === 'undefined') return null
    const active = document.activeElement
    return active instanceof HTMLElement && active !== document.body ? active : null
  })

  useEffect(() => {
    const container = ref.current
    const target = initialFocus?.current ?? (container ? focusableWithin(container)[0] : undefined) ?? container
    target?.focus({ preventScroll: true })
    return () => {
      // Cleanup runs after React has removed `inert` from the page. If another
      // dialog replaced this one, the page is still inert and focus stays put.
      const fallback = document.querySelector<HTMLElement>('main [data-page-heading]')
      ;(returnTo?.isConnected ? returnTo : fallback)?.focus({ preventScroll: true })
    }
    // Focus once on mount; later changes to initialFocus must not steal focus.
  }, [])

  const onKeyDown = (event: KeyboardEvent<T>) => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault()
      event.stopPropagation()
      onCloseRef.current()
      return
    }
    if (event.key !== 'Tab' || !ref.current) return
    const focusable = focusableWithin(ref.current)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return { ref, onKeyDown }
}

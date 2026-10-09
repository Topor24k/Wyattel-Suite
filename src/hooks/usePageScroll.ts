import { useEffect, useState } from 'react'

type ScrollState = {
  /** The page has moved away from the very top. */
  scrolled: boolean
  /** Scrolling down past the fold: the header can step out of the way. */
  hideHeader: boolean
}

const HIDE_AFTER = 480

export default function usePageScroll(): ScrollState {
  const [state, setState] = useState<ScrollState>(() => ({ scrolled: window.scrollY > 0, hideHeader: false }))

  useEffect(() => {
    let frame: number | null = null
    let lastY = window.scrollY
    const update = () => {
      frame = null
      const y = window.scrollY
      const delta = y - lastY
      // Ignore tiny movements so the header does not flicker on trackpads.
      if (Math.abs(delta) < 6 && y > 0) return
      lastY = y
      setState((current) => {
        const next = { scrolled: y > 0, hideHeader: y > HIDE_AFTER && delta > 0 }
        return next.scrolled === current.scrolled && next.hideHeader === current.hideHeader ? current : next
      })
    }
    const onScroll = () => { if (frame === null) frame = window.requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return state
}

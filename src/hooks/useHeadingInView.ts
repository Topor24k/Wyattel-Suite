import { useEffect, useState } from 'react'

/**
 * Whether the current page's main heading is on screen. The phone top bar shows
 * the page title once the large heading scrolls under it, as native apps do.
 */
export default function useHeadingInView(pageKey: string, topBarHeight = 56) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    setInView(true)
    const heading = document.querySelector('main [data-page-heading]')
    if (!heading) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? true),
      { rootMargin: `-${topBarHeight}px 0px 0px 0px` },
    )
    observer.observe(heading)
    return () => observer.disconnect()
  }, [pageKey, topBarHeight])

  return inView
}

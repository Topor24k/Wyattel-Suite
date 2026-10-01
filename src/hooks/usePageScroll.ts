import { useEffect, useState } from 'react'

export default function usePageScroll() {
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 0)

  useEffect(() => {
    let frame: number | null = null
    const updateScroll = () => { frame = null; setHasScrolled(window.scrollY > 0) }
    const handleScroll = () => { if (frame === null) frame = window.requestAnimationFrame(updateScroll) }
    updateScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return hasScrolled
}

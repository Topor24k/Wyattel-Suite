import { useEffect, useState } from 'react'

const readLocation = () => ({ path: window.location.pathname.replace(/\/$/, '') || '/', search: window.location.search, hash: window.location.hash })

export function navigate(path: string, replace = false) {
  if (replace) window.history.replaceState(null, '', path)
  else window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function useSiteLocation() {
  const [location, setLocation] = useState(readLocation)
  useEffect(() => {
    const update = () => setLocation(readLocation())
    const intercept = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || !['http:', 'https:'].includes(url.protocol)) return
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return
      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    document.addEventListener('click', intercept)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update); document.removeEventListener('click', intercept) }
  }, [])
  return location
}

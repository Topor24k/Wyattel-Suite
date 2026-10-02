import React, { useEffect, useRef } from 'react'
import { Arrow, BrandLogo } from './UI'

const links = [['HOME', '/'], ['OUR SUITES', '/suites'], ['THE GALLERY', '/gallery'], ['DINING & CELEBRATIONS', '/experiences'], ['THE JOURNAL', '/journal'], ['PLAN YOUR STAY', '/plan-your-stay'], ['OFFERS', '/offers'], ['OUR STORY', '/our-story']]
export default function MenuOverlay({ onClose, currentPath }: { onClose: () => void; currentPath: string }) {
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [])
  return <div ref={menuRef} className="menu-overlay menu-section royal-pattern site-menu-expanded" role="dialog" aria-modal="true" aria-label="Explore Wyattel" onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose() }
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')]
    const first = controls[0], last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }}>
    <button className="overlay-close" onClick={onClose}>CLOSE</button>
    <BrandLogo light className="menu-overlay-logo" />
    <nav aria-label="Main navigation">{links.map(([label, href], index) => <a key={label} href={href} aria-current={currentPath === href ? 'page' : undefined} onClick={onClose}><small>{String(index + 1).padStart(2, '0')}</small><span>{label}</span><Arrow /></a>)}</nav>
    <div className="menu-contact" data-selectable="true"><span>TACURONG CITY, PHILIPPINES</span><span>0912 292 9592 · 0965 977 0234</span></div>
  </div>
}

import React from 'react'

export default function BackToTop({ visible }: { visible: boolean }) {
  const returnToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
    document.querySelector<HTMLAnchorElement>('.header-section a[aria-label="Wyattel Suite home"]')?.focus({ preventScroll: true })
  }

  return (
    <button className={`page-back-to-top${visible ? ' page-back-to-top--visible' : ''}`} type="button" onClick={returnToTop} aria-label="Back to top" aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
      <span aria-hidden="true">↑</span><span>BACK TO TOP</span>
    </button>
  )
}

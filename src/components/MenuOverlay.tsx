import React from 'react'
import { Arrow, BrandLogo } from './UI'

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const links = [['01', 'HOME', '#home'], ['02', 'OUR STORY', '#story'], ['03', 'OUR SUITES', '#rooms'], ['04', 'EXPERIENCE', '#contact']]
  return (
    <div className="menu-overlay menu-section royal-pattern">
      <button className="overlay-close" onClick={onClose}>CLOSE</button>
      <BrandLogo light className="menu-overlay-logo" />
      <nav>{links.map(([number, label, href]) => <a key={label} href={href} onClick={onClose}><small>{number}</small><span>{label}</span><Arrow /></a>)}</nav>
      <div className="menu-contact" data-selectable="true"><span>TACURONG CITY, PHILIPPINES</span><span>0912 292 9592 · 0965 977 0234</span></div>
    </div>
  )
}

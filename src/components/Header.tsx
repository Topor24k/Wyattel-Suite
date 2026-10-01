import React from 'react'
import { BrandLogo } from './UI'

export default function Header({ onOpenMenu, onOpenBooking, isScrolled }: { onOpenMenu: () => void; onOpenBooking: () => void; isScrolled: boolean }) {
  return (
    <header className={`topbar header-section${isScrolled ? ' header-section--scrolled' : ''}`}>
      <button className="menu-button" onClick={onOpenMenu} aria-label="Open menu"><span></span><span></span><b></b></button>
      <a href="#home" aria-label="Wyattel Suite home"><BrandLogo light /></a>
      <div className="top-actions"><a href="https://www.facebook.com/WyattelSuites/" target="_blank" rel="noreferrer">FB</a><button className="header-booking-button" onClick={onOpenBooking}>BOOK YOUR STAY</button></div>
    </header>
  )
}

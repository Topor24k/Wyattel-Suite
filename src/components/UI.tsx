import React from 'react'

type ArrowProps = { left?: boolean }
type LogoProps = { light?: boolean; className?: string }

export function Arrow({ left = false }: ArrowProps) {
  return <span aria-hidden="true">{left ? '←' : '→'}</span>
}

export function BrandLogo({ light = false, className = '' }: LogoProps) {
  return <span role="img" aria-label="Wyattel Suite" className={`brand-logo ${light ? 'brand-logo--light' : ''} ${className}`.trim()} />
}

export function Mark({ light = false }: { light?: boolean }) {
  return <div className={`mark ${light ? 'mark--light' : ''}`}><span>W</span><i></i><small>WYATTEL<br />SUITE</small></div>
}

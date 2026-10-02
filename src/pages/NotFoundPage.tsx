import React from 'react'
import PageHeading from '../components/PageHeading'
import { Arrow } from '../components/UI'
export default function NotFoundPage() {
  return <div className="not-found-page"><PageHeading title="Let’s find your way back." /><section className="site-empty-state site-content-width"><a className="not-found-link" href="/">BACK TO HOME <Arrow /></a><a className="not-found-link" href="/suites">EXPLORE SUITES <Arrow /></a></section></div>
}

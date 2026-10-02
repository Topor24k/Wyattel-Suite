import React from 'react'
import { Arrow } from './UI'

export default function HomeGalleryPreview() {
  return <section className="home-gallery-preview site-content-width"><div className="home-gallery-heading"><div><p className="overline">A WINDOW INTO WYATTEL</p><h2>Look a little closer.</h2></div><a className="home-gallery-link" href="/gallery">EXPLORE THE GALLERY <Arrow /></a></div><a className="home-gallery-mosaic" href="/gallery" aria-label="Explore all Wyattel photographs"><img src="/Deluxe%20Suite%20Images/Wyattel%20Suite%20Deluxe%202.png" alt="Details of the Deluxe Suite" loading="lazy" /><img src="/Pictures/Wyattel%20Story%20Detail%20Background.png" alt="Wyattel reception" loading="lazy" /><img src="/Pictures/Wyattel%20Suite%20Wedding.png" alt="Wedding at Wyattel" loading="lazy" /></a></section>
}

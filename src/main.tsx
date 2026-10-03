import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/action-buttons.css'
import './styles/booking-form.css'
import './styles/booking-gallery.css'
import './styles/suites-gallery.css'
import './styles/experience-media.css'
import './styles/contact-media.css'
import './styles/scroll-navigation.css'
import './styles/brand-cursor.css'
import './styles/text-selection.css'
import './styles/site-pages.css'
import './styles/home-previews.css'
import './styles/home-about.css'
import './styles/full-gallery.css'
import './styles/suite-pages.css'
import './styles/journal-pages.css'
import './styles/planning-pages.css'
import './styles/enquiry-pages.css'
import './styles/page-notes.css'
import './styles/suite-collection.css'
import './styles/gallery-collection.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

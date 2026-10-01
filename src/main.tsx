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

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

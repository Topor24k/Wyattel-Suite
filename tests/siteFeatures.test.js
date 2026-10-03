import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { roomSlug, roomPath } from '../src/utils/siteRoutes.js'
import { enquirySummary, emailDraftLink, deliverEnquiry } from '../src/utils/enquiries.js'

test('suite links are stable', () => {
  assert.equal(roomSlug('Deluxe Suite'), 'deluxe-suite')
  assert.equal(roomPath('Twin Suite'), '/suites/twin-suite')
})
test('email drafts encode the recipient, connected stay summary, and special characters', () => {
  const enquiry = { kind: 'reservation', firstName: 'A & B', email: 'guest@example.com', mobile: '09123456789', room: 'Twin Suite', selectedDates: ['2050-10-01', '2050-10-02'], guests: 2, message: 'Tea & coffee?' }
  const link = emailDraftLink('approved@example.com', enquiry)
  assert.ok(link.startsWith('mailto:approved%40example.com?subject='))
  assert.match(decodeURIComponent(link), /2050-10-01 to 2050-10-02/)
  assert.match(enquirySummary(enquiry), /Tea & coffee\?/)
  assert.equal(emailDraftLink('', enquiry), '')
})
test('the browser never treats unavailable or malformed delivery as success', async () => {
  await assert.rejects(deliverEnquiry({}, 'test-request-id', async () => ({ ok: false, json: async () => ({ message: 'Not sent.' }) })), /Not sent/)
  await assert.rejects(deliverEnquiry({}, 'test-request-id', async () => ({ ok: true, json: async () => ({}) })), /not been sent/)
  await assert.rejects(deliverEnquiry({}, 'test-request-id', async () => ({ ok: false, json: async () => { throw Error('html') } })), /not been sent/)
  assert.deepEqual(await deliverEnquiry({}, 'test-request-id', async () => ({ ok: true, json: async () => ({ id: 'accepted-id' }) })), { id: 'accepted-id' })
})

async function loadData(entry) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'esm' })
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)
}

async function loadComponent(entry) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'] })
  const compiled = { exports: {} }
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports)
  return compiled.exports.default
}

test('editorial gallery displays all 19 photographs once without category controls', async () => {
  const Gallery = await loadComponent('src/pages/GalleryPage.tsx')
  for (const search of ['', '?category=Dining']) {
    const html = renderToStaticMarkup(React.createElement(Gallery, { search, onView() {} }))
    assert.equal((html.match(/class="gallery-collection-photo"/g) || []).length, 19)
    assert.equal((html.match(/class="gallery-chapter gallery-chapter--/g) || []).length, 4)
    assert.doesNotMatch(html, /all-gallery-filter|Filter gallery|All photos|<select/)
    assert.match(html, /id="gallery-dining"/)
    assert.match(html, /gallery-collection-frame--uncropped/)
  }
})

test('suite collection keeps five cards and photo viewing without comparison UI', async () => {
  const Suites = await loadComponent('src/pages/SuitesPage.tsx')
  const html = renderToStaticMarkup(React.createElement(Suites, { onView() {} }))
  assert.equal((html.match(/<article class="suite-collection-card /g) || []).length, 5)
  assert.equal((html.match(/aria-label="View [^"]+ Suite photos"/g) || []).length, 5)
  assert.doesNotMatch(html, /suite-collection-compare|suite-comparison|COMPARE|compare your/i)
  assert.match(html, /REPRESENTATIVE ROOM · VIEW PHOTO/)
  assert.match(html, /href="\/suites\/family-suite"/)
})
test('all gallery images exist and every non-logo hotel image is included', async () => {
  const { galleryPhotos } = await loadData('src/data/photos.ts')
  assert.equal(galleryPhotos.length, 19)
  assert.equal(new Set(galleryPhotos.map(photo => photo.id)).size, 19)
  for (const photo of galleryPhotos) {
    assert.ok(existsSync(resolve('public', decodeURIComponent(photo.src.slice(1)))), `Missing ${photo.src}`)
    assert.ok(photo.caption && photo.alt)
  }
  assert.equal(galleryPhotos.find(photo => photo.category === 'Dining').fit, 'contain')
})
test('all journal articles and related-story links have real content and existing images', async () => {
  const { journalArticles } = await loadData('src/data/journal.ts')
  assert.equal(journalArticles.length, 3)
  const slugs = new Set(journalArticles.map(article => article.slug))
  for (const article of journalArticles) {
    assert.ok(existsSync(resolve('public', decodeURIComponent(article.image.slice(1)))))
    assert.ok(article.sections.length >= 3)
    assert.ok(article.related.every(slug => slugs.has(slug) && slug !== article.slug))
  }
})
test('offers cannot be presented as current without an approved dated entry', async () => {
  const { activeOffers, approvedOffers } = await loadData('src/data/offers.ts')
  assert.deepEqual(activeOffers('2026-10-01'), [])
  const offer = { id: 'test', approved: false, starts: '2026-09-01', ends: '2026-11-01' }
  approvedOffers.push(offer)
  assert.equal(activeOffers('2026-10-01').length, 0)
  offer.approved = true
  assert.equal(activeOffers('2026-10-01').length, 1)
  assert.equal(activeOffers('2026-12-01').length, 0)
  assert.equal(activeOffers('2026-08-01').length, 0)
  approvedOffers.pop()
})

test('removed intros, enquiry sections, and favourites do not return to the active UI', () => {
  const read = path => readFileSync(path, 'utf8')
  const app = read('src/App.tsx')
  assert.doesNotMatch(app, /useFavourites|SavedPage|favouriteProps|savedCount/)
  for (const path of ['src/pages/GalleryPage.tsx', 'src/pages/SuitesPage.tsx', 'src/pages/SuiteDetailPage.tsx', 'src/components/GalleryLightbox.tsx', 'src/components/MenuOverlay.tsx', 'src/components/Footer.tsx']) {
    assert.doesNotMatch(read(path), /SaveButton|SAVED PHOTOS|SAVED FAVOURITES|href="\/saved"|onToggle/)
  }
  for (const page of ['Gallery', 'Suites', 'Journal', 'Experiences', 'PlanStay', 'Offers', 'Story', 'NotFound']) {
    assert.doesNotMatch(read(`src/pages/${page}Page.tsx`), /PageIntro|inner-page-intro/)
  }
  assert.doesNotMatch(read('src/pages/ExperiencesPage.tsx'), /dining-menu-section|EventEnquiryForm|event-enquiry-section/)
  assert.doesNotMatch(read('src/components/ExperienceSection.tsx'), /experience-heading|MORE THAN A PLACE TO STAY/)
  assert.doesNotMatch(read('src/components/ExperienceSection.tsx') + read('src/pages/OffersPage.tsx'), /#event-enquiry|#dining-menu/)
})

test('homepage includes About and omits gallery and experience previews', async () => {
  const Home = await loadComponent('src/pages/HomePage.tsx')
  const html = renderToStaticMarkup(React.createElement(Home, { onBook() {}, onSuitePhotos() {} }))
  assert.doesNotMatch(html, /home-gallery-preview|home-experiences-preview/)
  assert.equal((html.match(/class="home-about-section"/g) || []).length, 1)
  assert.match(html, /aria-labelledby="home-about-title"/)
  assert.match(html, /ABOUT WYATTEL/)
  assert.match(html, /href="\/our-story"/)
  assert.ok(html.indexOf('home-about-section') < html.indexOf('rooms-section suites-section'))
  assert.match(html, /home-journal-preview/)
  const css = readFileSync('src/styles/suites-gallery.css', 'utf8')
  assert.match(css, /\.wyattel-home-page \.rooms-section\.suites-section \{ padding-bottom: 0; \}/)
  assert.match(css, /@media \(max-width: 600px\)\s*\{\s*\.wyattel-home-page \.rooms-section\.suites-section \{ padding-top: 0; \}/)
})

test('every non-home menu page uses one Offers-style note with its own selector', () => {
  const selectors = new Set()
  for (const page of ['Gallery', 'Suites', 'Journal', 'Experiences', 'PlanStay', 'Offers', 'Story']) {
    const source = readFileSync(`src/pages/${page}Page.tsx`, 'utf8')
    assert.equal((source.match(/<PageNote\s/g) || []).length, 1, page)
    const selector = source.match(/className="([a-z-]+-page-note)"/)?.[1]
    assert.ok(selector, `Missing independent selector for ${page}`)
    selectors.add(selector)
    assert.doesNotMatch(source, /<PageHeading/)
  }
  assert.equal(selectors.size, 7)
  assert.doesNotMatch(readFileSync('src/pages/HomePage.tsx', 'utf8'), /PageNote|offers-honest-note/)
})

test('menu logo centering stays independent of its entrance animation', () => {
  const css = readFileSync('src/styles/site-pages.css', 'utf8')
  assert.match(css, /\.site-menu-expanded \.menu-overlay-logo \{ left: 50%; translate: -50% 0; transform: none; \}/)
})

test('page notes render an accessible heading and description without a banner', async () => {
  const result = await build({ entryPoints: ['src/components/PageNote.tsx'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'] })
  const compiled = { exports: {} }
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports)
  const html = renderToStaticMarkup(React.createElement(compiled.exports.default, { eyebrow: 'OUR SUITES', title: 'Find your stay.', description: 'Explore the rooms.', className: 'suites-page-note' }))
  assert.match(html, /offers-honest-note site-page-note suites-page-note/)
  assert.match(html, /aria-labelledby="suites-page-note-title"/)
  assert.match(html, /<h1 id="suites-page-note-title" tabindex="-1" data-page-heading="true">Find your stay\.<\/h1>/)
  assert.match(html, /<p>Explore the rooms\.<\/p>/)
  assert.doesNotMatch(html, /<header|inner-page-intro|sr-only/)
})

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
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent' })
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)
}

async function loadModule(entry) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom'], logLevel: 'silent' })
  const compiled = { exports: {} }
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports)
  return compiled.exports
}
const render = async (entry, props, exportName = 'default') => renderToStaticMarkup(React.createElement((await loadModule(entry))[exportName], props))
const count = (html, pattern) => (html.match(pattern) || []).length

test('editorial gallery displays all 19 photographs once in four chapters, without filters', async () => {
  for (const search of ['', '?category=Dining']) {
    const html = await render('src/pages/GalleryPage.tsx', { search, onView() {} })
    assert.equal(count(html, /data-photo="/g), 19)
    assert.equal(count(html, /data-chapter="/g), 4)
    assert.doesNotMatch(html, /Filter gallery|All photos|<select/)
    assert.match(html, /id="gallery-dining"/)
    assert.equal(count(html, /data-fit="contain"/g), 1, 'the menu photograph is shown uncropped')
  }
})

test('suite collection lists five suites with photo viewing and no comparison UI', async () => {
  const html = await render('src/pages/SuitesPage.tsx', { onView() {}, onBook() {} })
  assert.equal(count(html, /<article data-suite="/g), 5)
  assert.equal(count(html, /aria-label="View [^"]+ Suite photos"/g), 5)
  assert.doesNotMatch(html, /compare/i)
  assert.match(html, /Representative photo/, 'suites without photography are labelled honestly')
  assert.match(html, /href="\/suites\/family-suite"/)
})

test('homepage opens with the hero, then About before the suites, and omits gallery and experience previews', async () => {
  const html = await render('src/pages/HomePage.tsx', { onBook() {}, onSuitePhotos() {} })
  assert.equal(count(html, /<h1 /g), 1)
  assert.match(html, /data-page-heading/)
  assert.doesNotMatch(html, /home-gallery|home-experiences/)
  assert.equal(count(html, /data-section="home-about"/g), 1)
  assert.match(html, /aria-labelledby="home-about-title"/)
  assert.match(html, /About Wyattel/)
  assert.match(html, /href="\/our-story"/)
  assert.ok(html.indexOf('data-section="home-about"') < html.indexOf('data-section="home-suites"'))
  assert.match(html, /data-section="home-journal"/)
  assert.match(html, /aria-label="Request a stay"/, 'the hero carries the quick stay request')
})

test('suite detail pages show the listed rate, a request action, and links to neighbouring suites', async () => {
  const { rooms } = await loadData('src/data.ts')
  const room = rooms.find(item => item.name === 'Family Suite')
  const html = await render('src/pages/SuiteDetailPage.tsx', { room, onBook() {}, onView() {} })
  assert.match(html, /<h1 id="suite-title"[^>]*>Family Suite<\/h1>/)
  assert.match(html, /₱3,400/)
  assert.ok(count(html, />Request( this suite)?</g) >= 1)
  assert.match(html, /href="\/suites\/matrimonial-suite"/)
  assert.match(html, /href="\/suites\/deluxe-suite"/)
})

test('the reservation form offers every suite as a radio choice and labels every field', async () => {
  const { rooms } = await loadData('src/data.ts')
  const html = await render('src/components/BookingModal.tsx', { rooms, request: { room: 'Twin Suite', note: 'Late arrival' }, onClose() {} })
  assert.match(html, /role="dialog"/)
  assert.match(html, /aria-modal="true"/)
  assert.equal(count(html, /type="radio" name="room"/g), 5)
  assert.match(html, /<input type="radio"[^>]*checked=""[^>]*value="Twin Suite"/, 'the requested suite is preselected')
  for (const field of ['firstName', 'surname', 'email', 'mobile', 'message']) {
    assert.match(html, new RegExp(`for="booking-${field}"`), `${field} has a label`)
    assert.match(html, new RegExp(`id="booking-${field}"`))
  }
  assert.match(html, />Late arrival</)
  assert.match(html, /name="website" tabindex="-1"/, 'honeypot stays out of the tab order')
  assert.match(html, /<nav aria-label="Form sections"/, 'the long form offers jump links to each section')
  assert.match(html, /data-gallery-trigger="panel"/, 'desktop photo panel opens the photo viewer')
  assert.match(html, /data-gallery-trigger="banner"/, 'phones get their own way into the photo viewer')
})

test('the booking photo panel expands into a full photo viewer with a way back to the form', async () => {
  const { rooms } = await loadData('src/data.ts')
  const room = rooms.find(item => item.name === 'Twin Suite')
  const props = { room, onExpand() {}, onCollapse() {} }
  const collapsed = await render('src/components/BookingGallery.tsx', { ...props, expanded: false })
  assert.match(collapsed, /aria-label="View Twin Suite photos in full"/)
  assert.match(collapsed, /View all 3 photos/)
  assert.doesNotMatch(collapsed, /Back to booking/)

  const expanded = await render('src/components/BookingGallery.tsx', { ...props, expanded: true })
  assert.match(expanded, /role="region" aria-label="Twin Suite photographs"/)
  assert.match(expanded, /Back to booking<\/button>/)
  assert.match(expanded, /aria-label="Previous photo"/)
  assert.match(expanded, /aria-label="Next photo"/)
  assert.equal(count(expanded, /aria-label="View Twin Suite · view 0\d"/g), 3, 'one thumbnail per photo')
  assert.match(expanded, /01(<!-- -->)? \/ (<!-- -->)?03/)

  const presidential = await render('src/components/BookingGallery.tsx', { ...props, room: rooms.find(item => item.name === 'Presidential Suite'), expanded: false })
  assert.match(presidential, /View representative photo/, 'suites without photography are labelled honestly')
})

test('every inner page opens with exactly one PageHeader and a unique id', () => {
  const ids = new Set()
  for (const page of ['Gallery', 'Suites', 'Journal', 'Experiences', 'PlanStay', 'Offers', 'Story']) {
    const source = readFileSync(`src/pages/${page}Page.tsx`, 'utf8')
    assert.equal(count(source, /<PageHeader\b/g), 1, page)
    const id = source.match(/<PageHeader\s+id="([a-z-]+)"/)?.[1]
    assert.ok(id, `Missing PageHeader id on ${page}`)
    ids.add(id)
  }
  assert.equal(ids.size, 7)
  assert.doesNotMatch(readFileSync('src/pages/HomePage.tsx', 'utf8'), /PageHeader/)
})

test('page headers render one focusable, labelled h1', async () => {
  const html = await render('src/components/ui/PageHeader.tsx', { id: 'suites', eyebrow: 'Our suites', title: 'Find your stay.', description: 'Explore the rooms.' }, 'PageHeader')
  assert.match(html, /<header [^>]*aria-labelledby="suites-title"/)
  assert.match(html, /<h1 id="suites-title" tabindex="-1" data-page-heading="true"[^>]*>Find your stay\.<\/h1>/)
  assert.match(html, /Explore the rooms\./)
})

test('removed favourites, intros, and enquiry sections do not return', () => {
  const read = path => readFileSync(path, 'utf8')
  assert.doesNotMatch(read('src/App.tsx'), /useFavourites|SavedPage|favouriteProps|savedCount/)
  for (const path of ['src/pages/GalleryPage.tsx', 'src/pages/SuitesPage.tsx', 'src/pages/SuiteDetailPage.tsx', 'src/components/GalleryLightbox.tsx', 'src/components/MenuOverlay.tsx', 'src/components/Footer.tsx']) {
    assert.doesNotMatch(read(path), /SaveButton|SAVED PHOTOS|SAVED FAVOURITES|href="\/saved"|onToggle/)
  }
  assert.doesNotMatch(read('src/pages/ExperiencesPage.tsx'), /EventEnquiryForm|event-enquiry-section/)
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

test('every photograph has optimised variants on disk (run `npm run images` after adding photos)', async () => {
  const manifest = JSON.parse(readFileSync('src/data/imageManifest.json', 'utf8'))
  const { galleryPhotos } = await loadData('src/data/photos.ts')
  const { rooms } = await loadData('src/data.ts')
  for (const src of new Set([...galleryPhotos.map(photo => photo.src), ...rooms.map(room => room.image)])) {
    const entry = manifest[src]
    assert.ok(entry, `No optimised variants for ${src}`)
    assert.ok(entry.width > 0 && entry.height > 0)
    for (const variant of entry.variants) assert.ok(existsSync(resolve('public', variant.src.slice(1))), `Missing ${variant.src}`)
  }
})

test('suites without their own photography fall back to a labelled representative image', async () => {
  const { photosForRoom } = await loadData('src/data/photos.ts')
  const { rooms } = await loadData('src/data.ts')
  const presidential = photosForRoom(rooms.find(room => room.name === 'Presidential Suite'))
  assert.equal(presidential.representative, true)
  assert.match(presidential.photos[0].caption, /Representative/)
  const deluxe = photosForRoom(rooms.find(room => room.name === 'Deluxe Suite'))
  assert.equal(deluxe.representative, false)
  assert.ok(deluxe.photos.every(photo => photo.suite === 'Deluxe Suite'))
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

test('the phone tab bar marks the current section and keeps booking one tap away', async () => {
  const props = { moreOpen: false, onOpenBooking() {}, onOpenMore() {} }
  const onSuite = await render('src/components/TabBar.tsx', { ...props, currentPath: '/suites/twin-suite' })
  assert.match(onSuite, /<nav aria-label="Main"/)
  assert.match(onSuite, /href="\/suites" aria-current="page"/, 'suite pages highlight the Suites tab')
  assert.match(onSuite, />Book<\/button>/)
  assert.match(onSuite, /aria-haspopup="dialog"[^>]*>.*More<\/button>/s)
  const onJournal = await render('src/components/TabBar.tsx', { ...props, currentPath: '/journal' })
  assert.doesNotMatch(onJournal, /aria-current="page"/, 'pages reached through More do not claim another tab')
})

test('the More sheet lists every page not in the tab bar, plus call and directions', async () => {
  const html = await render('src/components/MoreSheet.tsx', { currentPath: '/offers', onClose() {} })
  assert.match(html, /role="dialog" aria-modal="true" aria-label="More from Wyattel"/)
  for (const href of ['/experiences', '/journal', '/plan-your-stay', '/offers', '/our-story']) assert.match(html, new RegExp(`href="${href}"`))
  assert.doesNotMatch(html, /href="\/suites"|href="\/gallery"/, 'tab bar destinations are not repeated')
  assert.match(html, /href="\/offers" aria-current="page"/)
  assert.match(html, /href="tel:\+639122929592"/)
  assert.match(html, /maps\.google\.com/)
})

test('the site can be installed to a phone home screen', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'))
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '/')
  for (const icon of manifest.icons) assert.ok(existsSync(resolve('public', icon.src.slice(1))), `Missing ${icon.src}`)
  assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'))
  const html = readFileSync('index.html', 'utf8')
  assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/)
  assert.match(html, /viewport-fit=cover/)
  assert.match(html, /rel="apple-touch-icon"/)
  assert.ok(existsSync('public/icons/apple-touch-icon.png'))
})

test('suite pages give phones a swipeable photo carousel and a pinned request bar', async () => {
  const { rooms } = await loadData('src/data.ts')
  const html = await render('src/pages/SuiteDetailPage.tsx', { room: rooms.find(item => item.name === 'Deluxe Suite'), onBook() {}, onView() {} })
  assert.match(html, /role="group" aria-label="Suite photographs"/)
  assert.equal(count(html, /snap-center/g), 3, 'one slide per Deluxe Suite photo')
  assert.match(html, />Request this suite</)
})

test('listed rates format as Philippine pesos', async () => {
  const { formatRate } = await loadData('src/utils/format.ts')
  assert.equal(formatRate(1900), '₱1,900')
})

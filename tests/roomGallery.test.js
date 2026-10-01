import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { getRoomGallery } from '../src/utils/roomGallery.js'
import { suiteGalleries } from '../src/data/suiteGalleries.js'

test('a suite without its own gallery keeps only its existing image', () => {
  const photos = getRoomGallery({ name: 'Deluxe Suite', image: '/suite-one.png' })
  assert.equal(photos[0].src, '/suite-one.png')
  assert.equal(photos[0].caption, 'Deluxe Suite · suite view')
  assert.equal(photos.length, 1)
})

test('room-specific photos replace the placeholder image entirely', () => {
  const photos = getRoomGallery({ name: 'Family Suite', image: '/family.png', gallery: [{ src: '/family-bath.png', alt: 'Family bathroom', caption: 'Private bathroom' }] })
  assert.deepEqual(photos.map((photo) => photo.src), ['/family-bath.png'])
})

for (const [suiteName, gallery] of Object.entries(suiteGalleries)) {
  test(`${suiteName} uses its own three existing photos in order`, () => {
    const photos = getRoomGallery({ name: suiteName, image: '/placeholder.png', gallery })
    assert.equal(photos.length, 3)
    assert.deepEqual(photos, gallery)
    photos.forEach((photo, index) => {
      const decodedPath = decodeURIComponent(photo.src)
      assert.ok(decodedPath.startsWith(`/${suiteName} Images/`))
      assert.ok(decodedPath.endsWith(` ${index + 1}.png`))
      assert.ok(existsSync(new URL(`../public${decodedPath}`, import.meta.url)))
    })
  })
}

test('duplicate and empty images are excluded', () => {
  const photos = getRoomGallery({ name: 'Suite', image: '/suite.png', gallery: [{ src: '/suite.png' }, { src: '' }] })
  assert.equal(photos.length, 1)
})

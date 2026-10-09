// Builds the home-screen / PWA icons from the Wyattel wordmark's "W".
// Run once after changing the logo: `node scripts/app-icons.mjs`.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const wordmark = join(root, 'public', 'Logo', 'wyattel-wordmark.png')
const outDir = join(root, 'public', 'icons')
const navy = { r: 12, g: 30, b: 52 }
const gold = { r: 201, g: 173, b: 116 }

// Find the "W": the first run of opaque columns, ending at the first fully transparent column.
const { data, info } = await sharp(wordmark).ensureAlpha().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true })
const columnHasInk = (x) => { for (let y = 0; y < info.height; y += 1) if (data[y * info.width + x] > 24) return true; return false }
let start = 0
while (start < info.width && !columnHasInk(start)) start += 1
let end = start
while (end < info.width && columnHasInk(end)) end += 1
const glyphAlpha = await sharp(wordmark).ensureAlpha().extract({ left: start, top: 0, width: end - start, height: info.height }).extractChannel('alpha').toBuffer()

async function icon(size, glyphShare, file, rounded = false) {
  const glyphWidth = Math.round(size * glyphShare)
  const alpha = await sharp(glyphAlpha).resize({ width: glyphWidth }).toColourspace('b-w').extractChannel(0).raw().toBuffer({ resolveWithObject: true })
  const glyph = await sharp({ create: { width: alpha.info.width, height: alpha.info.height, channels: 3, background: gold } })
    .joinChannel(alpha.data, { raw: { width: alpha.info.width, height: alpha.info.height, channels: 1 } })
    .png()
    .toBuffer()
  let image = sharp({ create: { width: size, height: size, channels: 4, background: { ...navy, alpha: 1 } } })
    .composite([{ input: glyph, gravity: 'center' }])
  if (rounded) {
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#fff"/></svg>`)
    image = sharp(await image.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }])
  }
  const target = join(outDir, file)
  await mkdir(dirname(target), { recursive: true })
  await image.png({ compressionLevel: 9 }).toFile(target)
}

await icon(192, 0.56, 'icon-192.png')
await icon(512, 0.56, 'icon-512.png')
await icon(512, 0.42, 'icon-maskable-512.png') // content kept inside the 80% safe zone
await icon(180, 0.56, 'apple-touch-icon.png')
await icon(64, 0.62, 'favicon-64.png', true)

// Vector favicon so browser tabs stay crisp: the W traced into an SVG is not
// available, so embed the 64px raster in a rounded SVG wrapper.
const favicon = (await sharp(join(outDir, 'favicon-64.png')).toBuffer()).toString('base64')
await writeFile(join(root, 'public', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,${favicon}"/></svg>\n`)
console.log(`Icons written to public/icons (W glyph ${end - start}px wide).`)

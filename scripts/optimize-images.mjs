// Generates responsive WebP copies of every hotel photograph in /public and a
// manifest the <Picture> component reads. Originals stay untouched, so swapping
// in new photography is: drop the file in /public, run `npm run images`.
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const outputDir = join(publicDir, 'optimized')
const manifestPath = join(root, 'src', 'data', 'imageManifest.json')
const widths = [480, 960, 1600, 2400]
const skipDirs = new Set(['optimized', 'Logo', 'icons'])

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) yield* walk(join(dir, entry.name))
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      yield join(dir, entry.name)
    }
  }
}

// Public URLs in the data files are percent-encoded per path segment.
const toUrl = (file) => '/' + relative(publicDir, file).split(sep).map(encodeURIComponent).join('/')
const slug = (file) => relative(publicDir, file).replace(extname(file), '').split(sep).join('/').replace(/[^a-zA-Z0-9/]+/g, '-').toLowerCase()

async function isFresh(source, target) {
  try { return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs } catch { return false }
}

const previous = await readFile(manifestPath, 'utf8').then(JSON.parse).catch(() => ({}))
const manifest = {}
let generated = 0

for await (const file of walk(publicDir)) {
  const image = sharp(file)
  const { width = 0, height = 0 } = await image.metadata()
  const sizes = widths.filter((w) => w < width).concat(width).filter((w, i, all) => all.indexOf(w) === i && w <= 2400)
  const variants = []
  for (const w of sizes) {
    const target = join(outputDir, `${slug(file)}-${w}.webp`)
    if (!(await isFresh(file, target))) {
      await mkdir(dirname(target), { recursive: true })
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(target)
      generated += 1
    }
    variants.push({ w, src: '/' + relative(publicDir, target).split(sep).join('/') })
  }
  // A small blurred preview keeps layout calm while the full image loads.
  const key = toUrl(file)
  const placeholder = previous[key]?.placeholder && (await isFresh(file, manifestPath))
    ? previous[key].placeholder
    : `data:image/webp;base64,${(await sharp(file).resize(24).webp({ quality: 40 }).toBuffer()).toString('base64')}`
  manifest[key] = { width, height, variants, placeholder }
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Images: ${Object.keys(manifest).length} photographs, ${generated} new variants.`)

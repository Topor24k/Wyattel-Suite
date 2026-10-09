import type { ImgHTMLAttributes } from 'react'
import manifest from '../../data/imageManifest.json'
import { cx } from '../../utils/cx'

type ManifestEntry = { width: number; height: number; variants: { w: number; src: string }[]; placeholder: string }
const images = manifest as Record<string, ManifestEntry | undefined>

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  src: string
  /** Required: pass "" only for purely decorative images. */
  alt: string
  /** How wide the image renders, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string
  /** Load immediately and at high priority (the hero / LCP image). */
  priority?: boolean
  /** Show a blurred preview while loading. Turn off on dark full-screen viewers. */
  placeholder?: boolean
}

/**
 * Responsive hotel photograph. Uses the WebP variants from `npm run images`
 * when they exist and falls back to the original file otherwise, so a newly
 * added photo still renders before the optimiser has run.
 */
export function Picture({ src, alt, sizes = '100vw', priority = false, placeholder = true, className, style, ...props }: PictureProps) {
  const entry = images[src]
  const largest = entry?.variants.at(-1)
  // React 18 does not know `fetchPriority`; the lowercase attribute passes through.
  const priorityProps: Record<string, string> = priority ? { fetchpriority: 'high' } : {}
  return (
    <img
      src={largest?.src ?? src}
      srcSet={entry?.variants.map((variant) => `${variant.src} ${variant.w}w`).join(', ')}
      sizes={entry ? sizes : undefined}
      width={entry?.width}
      height={entry?.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={cx(placeholder && 'bg-navy-900', className)}
      style={entry && placeholder ? { backgroundImage: `url(${entry.placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style } : style}
      {...priorityProps}
      {...props}
    />
  )
}


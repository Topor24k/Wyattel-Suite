import { ButtonLink } from '../components/ui/Button'
import { containerClass } from '../components/ui/Section'
import { cx } from '../utils/cx'

export default function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title" className="flex min-h-svh items-center bg-navy-950 text-cream-50">
      <div className={cx(containerClass, 'py-32')}>
        <p aria-hidden="true" className="font-serif text-display leading-none text-navy-700">404</p>
        <h1 id="not-found-title" tabIndex={-1} data-page-heading className="mt-6 max-w-2xl text-heading tracking-tight">
          This page has <em className="text-gold-400">checked out.</em>
        </h1>
        <p className="mt-6 max-w-md text-base text-navy-200">The link may be old or mistyped. Let’s find your way back to somewhere comfortable.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" tone="dark" arrow>Back to home</ButtonLink>
          <ButtonLink href="/suites" tone="dark" variant="secondary">Explore suites</ButtonLink>
        </div>
      </div>
    </section>
  )
}

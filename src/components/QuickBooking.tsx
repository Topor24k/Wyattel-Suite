import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { getStayDates } from '../utils/bookingDates'
import { addDays, dateKey, formatRate } from '../utils/format'
import { lowestRate } from '../data'
import type { OpenBooking } from '../types'
import { cx } from '../utils/cx'

const fieldClass = 'flex min-h-16 min-w-0 flex-col justify-center gap-1 px-4 py-3 sm:px-5'
const labelClass = 'text-eyebrow font-semibold uppercase text-gold-700'
const inputClass = 'date-field w-full min-w-0 bg-transparent font-serif text-base text-navy-950 outline-none sm:text-lede'

/**
 * Compact stay request in the hero. It only gathers dates and guests; the
 * full enquiry form opens prefilled, so nothing is sent from here.
 */
export default function QuickBooking({ onBook, className }: { onBook: OpenBooking; className?: string }) {
  const today = dateKey(new Date())
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [guests, setGuests] = useState(2)
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (departure && !arrival) { setError('Choose your arrival date first.'); return }
    if (arrival && departure && departure < arrival) { setError('Your departure date must be after your arrival date.'); return }
    setError('')
    onBook({ dates: arrival ? getStayDates(arrival, departure || arrival) : undefined, guests })
  }

  return (
    <form onSubmit={submit} aria-label="Request a stay" noValidate className={cx('bg-cream-50 text-navy-950 max-md:overflow-hidden max-md:rounded-2xl max-md:shadow-2xl', className)}>
      <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <label className={cx(fieldClass, 'border-r border-b border-ink/10 lg:border-b-0')}>
          <span className={labelClass}>Arrival</span>
          <input
            type="date"
            className={inputClass}
            value={arrival}
            min={today}
            onChange={(event) => {
              setArrival(event.target.value)
              setError('')
              if (departure && event.target.value && departure < event.target.value) setDeparture('')
            }}
          />
        </label>
        <label className={cx(fieldClass, 'border-b border-ink/10 lg:border-r lg:border-b-0')}>
          <span className={labelClass}>Departure</span>
          <input
            type="date"
            className={inputClass}
            value={departure}
            min={arrival ? addDays(arrival, 1) : today}
            onChange={(event) => { setDeparture(event.target.value); setError('') }}
          />
        </label>
        <label className={cx(fieldClass, 'border-r border-ink/10')}>
          <span className={labelClass}>Guests</span>
          <select className={cx(inputClass, 'appearance-none')} value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="group flex min-h-16 items-center justify-between gap-3 bg-navy-950 px-4 text-eyebrow sm:px-6 font-semibold uppercase tracking-label text-cream-50 transition-colors duration-200 hover:bg-lacquer focus-visible:outline-cream-50 lg:justify-center"
        >
          <span className="sm:hidden">Request</span>
          <span className="hidden sm:inline">Request availability</span>
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.25} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
      <p className={cx('border-t border-ink/10 px-5 py-3 text-xs', error ? 'text-danger' : 'text-ink-muted')} role={error ? 'alert' : undefined} aria-live="polite">
        {error || `Listed rates from ${formatRate(lowestRate)} per night. The hotel confirms availability and price with you directly.`}
      </p>
    </form>
  )
}

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getStayDates } from '../utils/bookingDates'
import { addDays, dateKey, displayDate } from '../utils/format'
import { cx } from '../utils/cx'

type Props = {
  selectedDates: string[]
  /** Earliest selectable day (ISO). */
  min: string
  onChange: (dates: string[]) => void
  /** Id of an element describing an error, for assistive tech. */
  errorId?: string
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthOf = (value: string) => new Date(`${value.slice(0, 7)}-01T00:00:00`)

/**
 * Inline range calendar. The first tap sets the arrival day, the second the
 * final day; a third tap starts a new range. Arrow keys move day by day,
 * Page Up/Down move by month.
 */
export default function StayCalendar({ selectedDates, min, onChange, errorId }: Props) {
  const first = selectedDates[0]
  const last = selectedDates[selectedDates.length - 1]
  const [anchor, setAnchor] = useState(first ?? '')
  const [complete, setComplete] = useState(selectedDates.length > 1)
  const [focusDate, setFocusDate] = useState(first ?? min)
  const [view, setView] = useState(() => monthOf(first ?? min))
  const gridRef = useRef<HTMLDivElement>(null)
  const shouldFocus = useRef(false)

  const year = view.getFullYear()
  const month = view.getMonth()
  const leading = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, index) => dateKey(new Date(year, month, index + 1)))
  const monthLabel = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const canGoBack = dateKey(new Date(year, month, 0)) >= min
  const selected = new Set(selectedDates)
  const today = dateKey(new Date())

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus()
  }, [focusDate, view])

  const select = (date: string) => {
    if (date < min) return
    setFocusDate(date)
    if (!anchor || complete) {
      setAnchor(date)
      setComplete(false)
      onChange([date])
    } else {
      setComplete(true)
      onChange(getStayDates(anchor, date))
    }
  }

  const clear = () => { setAnchor(''); setComplete(false); onChange([]) }

  const moveFocus = (date: string) => {
    const next = date < min ? min : date
    shouldFocus.current = true
    setFocusDate(next)
    if (next.slice(0, 7) !== dateKey(view).slice(0, 7)) setView(monthOf(next))
  }

  const onGridKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    const step = steps[event.key]
    if (step !== undefined) {
      event.preventDefault()
      moveFocus(addDays(focusDate, step))
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      const date = new Date(`${focusDate}T00:00:00`)
      date.setMonth(date.getMonth() + (event.key === 'PageDown' ? 1 : -1))
      moveFocus(dateKey(date))
    }
  }

  // Keep a tabbable day inside the visible month.
  const tabbable = days.includes(focusDate) ? focusDate : days.find((day) => day >= min) ?? days[0]
  const summary = !first ? 'No dates selected yet' : first === last ? `${displayDate(first)} · 1 day` : `${displayDate(first)} – ${displayDate(last ?? first)} · ${selectedDates.length} days`
  const prompt = !anchor || complete ? 'Select your arrival day' : 'Now select your final day, or keep a single day'

  return (
    <div className="border border-ink/15 bg-cream-50">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
        <button type="button" aria-label="Previous month" disabled={!canGoBack} onClick={() => setView(new Date(year, month - 1, 1))} className="grid size-11 place-items-center text-navy-950 hover:bg-cream-200 disabled:opacity-30">
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
        <p className="font-serif text-lede text-navy-950" aria-live="polite">{monthLabel}</p>
        <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))} className="grid size-11 place-items-center text-navy-950 hover:bg-cream-200">
          <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-2 pt-2 pb-3 sm:px-4">
        <div className="grid grid-cols-7" aria-hidden="true">
          {weekdays.map((day) => <span key={day} className="py-2 text-center text-eyebrow font-semibold uppercase text-ink-muted">{day.slice(0, 2)}</span>)}
        </div>
        <div ref={gridRef} role="group" aria-label={`${monthLabel}. ${prompt}.`} aria-describedby={errorId} onKeyDown={onGridKey} className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: leading }, (_, index) => <span key={`blank-${index}`} />)}
          {days.map((day) => {
            const isSelected = selected.has(day)
            const isEdge = day === first || day === last
            const disabled = day < min
            const label = new Date(`${day}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            return (
              <button
                key={day}
                type="button"
                data-date={day}
                tabIndex={day === tabbable ? 0 : -1}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${label}${day === today ? ', today' : ''}`}
                onClick={() => select(day)}
                onFocus={() => setFocusDate(day)}
                className={cx(
                  'relative grid h-11 place-items-center text-sm tabular-nums transition-colors duration-150 disabled:cursor-not-allowed disabled:text-ink/30 focus-visible:z-10',
                  isSelected && isEdge && 'bg-navy-950 text-cream-50',
                  isSelected && !isEdge && 'bg-cream-300 text-navy-950',
                  !isSelected && !disabled && 'text-ink hover:bg-cream-200',
                )}
              >
                {Number(day.slice(8))}
                {day === today && <span aria-hidden="true" className={cx('absolute bottom-1.5 size-1 rounded-full', isSelected && isEdge ? 'bg-gold-400' : 'bg-lacquer')} />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-t border-ink/10 px-4 py-2">
        <p className="text-sm text-ink" aria-live="polite">{summary}</p>
        {selectedDates.length > 0 && (
          <button type="button" onClick={clear} className="min-h-10 text-eyebrow font-semibold uppercase text-navy-950 underline decoration-ink/25 underline-offset-4 hover:decoration-navy-950">
            Clear dates
          </button>
        )}
      </div>
    </div>
  )
}

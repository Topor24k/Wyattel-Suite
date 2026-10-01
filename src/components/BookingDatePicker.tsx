import React, { useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { getStayDates } from '../utils/bookingDates'

type Props = { selectedDates: string[]; min: string; onChange: (dates: string[]) => void }

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const displayDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function BookingDatePicker({ selectedDates, min, onChange }: Props) {
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [firstDay, setFirstDay] = useState(selectedDates[0] ?? '')
  const [viewDate, setViewDate] = useState(() => new Date(`${selectedDates[0] ?? min}T00:00:00`))
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const calendarDays = Array.from({ length: monthStart.getDay() + daysInMonth }, (_, index) => index < monthStart.getDay() ? null : index - monthStart.getDay() + 1)
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const today = dateKey(new Date())
  const previousDisabled = dateKey(new Date(viewDate.getFullYear(), viewDate.getMonth(), 0)) < min
  const selectedSet = new Set(selectedDates)
  const countLabel = `${selectedDates.length} ${selectedDates.length === 1 ? 'day' : 'days'} selected`
  const dateSummary = selectedDates.length === 0 ? 'Choose your stay dates' : selectedDates.length === 1 ? displayDate(selectedDates[0]) : `${displayDate(selectedDates[0])} – ${displayDate(selectedDates[selectedDates.length - 1])}`

  // Keep the first clicked day anchored. Every later click adjusts the other
  // endpoint, filling the complete interval instead of creating separate dates.
  const selectDate = (date: string) => {
    if (date < min) return
    const anchor = firstDay || date
    setFirstDay(anchor)
    onChange(getStayDates(anchor, date))
  }

  const clearDates = () => { setFirstDay(''); onChange([]) }

  const jumpToToday = () => {
    const now = new Date()
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1))
    if (today >= min && !selectedSet.has(today)) selectDate(today)
  }

  const closePicker = () => { setOpen(false); triggerRef.current?.focus() }
  const closeWhenFocusLeaves = () => requestAnimationFrame(() => {
    if (!pickerRef.current?.contains(document.activeElement)) setOpen(false)
  })

  return (
    <div className="date-picker booking-multiple-dates" ref={pickerRef} onBlur={closeWhenFocusLeaves} onKeyDownCapture={(event) => {
      if (event.key === 'Escape' && open) { event.stopPropagation(); closePicker() }
    }}>
      <input name="bookingDates" value={JSON.stringify(selectedDates)} type="hidden" />
      <input name="bookingDays" value={selectedDates.length} type="hidden" />
      <span className="booking-field-label">BOOKING DATES</span>
      <button ref={triggerRef} className={`date-picker-trigger${open ? ' is-open' : ''}${selectedDates.length ? ' has-value' : ''}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={`Booking dates: ${dateSummary}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="booking-dates-calendar">
        <span className="date-picker-icon"><CalendarDays size={18} strokeWidth={1.5} /></span>
        <span className="date-picker-copy"><small>{selectedDates.length ? countLabel.toUpperCase() : 'ONE DAY OR MORE'}</small><strong data-selectable={selectedDates.length ? 'true' : undefined}>{dateSummary}</strong></span>
        <ChevronDown className="date-picker-chevron" size={16} strokeWidth={1.5} />
      </button>
      {open && <div className="date-picker-popover" id="booking-dates-calendar" role="dialog" aria-label="Select booking dates" tabIndex={-1} onPointerDown={(event) => {
        // Blank areas must keep focus inside the picker, not blur to the page
        // and trigger its focus-leave dismissal. Date/action buttons keep their normal behavior.
        if (!(event.target as Element).closest('button:not([disabled])')) {
          event.preventDefault()
          event.currentTarget.focus({ preventScroll: true })
        }
      }}>
        <div className="date-picker-head">
          <div><span className="date-picker-kicker">{firstDay ? 'CHOOSE YOUR FINAL DAY' : 'CHOOSE YOUR FIRST DAY'}</span><strong>{monthLabel}</strong></div>
          <div className="date-picker-nav">
            <button type="button" disabled={previousDisabled} onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={17} /></button>
            <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={17} /></button>
          </div>
        </div>
        <div className="date-picker-weekdays">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => <span key={day} aria-label={day}>{day.slice(0, 1)}</span>)}</div>
        <div className="date-picker-grid">{calendarDays.map((day, index) => {
          if (day === null) return <span className="date-picker-empty" key={`empty-${index}`} />
          const currentDate = dateKey(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))
          const selected = selectedSet.has(currentDate)
          const endpoint = selected && (currentDate === selectedDates[0] || currentDate === selectedDates[selectedDates.length - 1])
          return <button className={`${selected ? 'is-selected ' : ''}${selected && !endpoint ? 'is-stay-between ' : ''}${currentDate === today ? 'is-today' : ''}`} disabled={currentDate < min} key={day} type="button" onClick={() => selectDate(currentDate)} aria-label={`${monthLabel} ${day}`} aria-pressed={selected} aria-current={currentDate === today ? 'date' : undefined}>{day}</button>
        })}</div>
        <div className="date-picker-foot">
          <div className="booking-calendar-status"><span aria-live="polite">{selectedDates.length ? countLabel : 'Choose your stay dates'}</span>{selectedDates.length > 0 && <button className="booking-calendar-clear" type="button" onClick={clearDates}>CLEAR DATES</button>}</div>
          <div className="booking-calendar-actions">
            <button className="booking-calendar-today" type="button" onClick={jumpToToday}>TODAY</button>
            <button className="booking-calendar-done" type="button" disabled={!selectedDates.length} onClick={closePicker}>DONE</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Expand, Lock, Minus, Plus, X } from 'lucide-react'
import StayCalendar from './StayCalendar'
import EnquiryHandoff from './EnquiryHandoff'
import BookingGallery from './BookingGallery'
import { Picture } from './ui/Picture'
import { Button } from './ui/Button'
import { useDialog } from '../hooks/useDialog'
import { useSheetDrag } from '../hooks/useSheetDrag'
import { photosForRoom } from '../data/photos'
import { deliverEnquiry } from '../utils/enquiries'
import { EMAIL_PATTERN, LIMITS, PHONE_PATTERN } from '../utils/enquiryRules'
import { dateKey, formatRate, pad } from '../utils/format'
import { inertProps } from '../utils/inert'
import { cx } from '../utils/cx'
import type { BookingRequest, ReservationEnquiry, Room } from '../types'

type Props = { rooms: Room[]; request: BookingRequest; onClose: () => void }
type FieldName = 'dates' | 'firstName' | 'email' | 'mobile' | 'consent'
type Errors = Partial<Record<FieldName, string>>
type Result = { enquiry: ReservationEnquiry; error?: string; id?: string }
type GalleryTrigger = 'panel' | 'banner'

const steps = ['Dates', 'Suite', 'Details'] as const
const stepId = (number: number) => `booking-step-${number}`

const inputClass =
  'mt-2 block w-full border-0 border-b border-ink/30 bg-transparent px-0 py-2 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-navy-950 aria-invalid:border-danger'
const labelClass = 'text-eyebrow font-semibold uppercase text-ink-muted'

function validate(enquiry: ReservationEnquiry): Errors {
  const errors: Errors = {}
  if (!enquiry.selectedDates.length) errors.dates = 'Choose at least one day for your stay.'
  if (!enquiry.firstName.trim()) errors.firstName = 'Tell us your first name.'
  if (!EMAIL_PATTERN.test(enquiry.email)) errors.email = 'Enter an email address like name@example.com.'
  if (!PHONE_PATTERN.test(enquiry.mobile)) errors.mobile = 'Enter a contact number, for example 0912 345 6789.'
  if (!enquiry.consent) errors.consent = 'Please agree so the team can reply to you.'
  return errors
}

function Field({ name, label, error, children }: { name: FieldName | 'surname'; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`booking-${name}`} className={labelClass}>{label}</label>
      {children}
      {error && <p id={`booking-${name}-error`} className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <fieldset id={stepId(number)} tabIndex={-1} className="scroll-mt-20 border-t border-ink/15 pt-8 outline-none">
      <legend className="float-left mb-6 flex w-full items-baseline gap-4">
        <span className="font-serif text-lede text-gold-700">{pad(number)}</span>
        <span className="font-serif text-title text-navy-950">{title}</span>
      </legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  )
}

export default function BookingModal({ rooms, request, onClose }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { ref, onKeyDown } = useDialog<HTMLDivElement>({ onClose, initialFocus: titleRef })
  const dragHandle = useSheetDrag(ref, onClose)
  const today = dateKey(new Date())
  const initialRoom = rooms.find((room) => room.name === request.room) ?? rooms[0]
  const [roomName, setRoomName] = useState(initialRoom?.name ?? '')
  const [dates, setDates] = useState<string[]>(() => (request.dates ?? []).filter((date) => date >= today))
  const [guests, setGuests] = useState(Math.min(LIMITS.guests, Math.max(1, request.guests ?? 2)))
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const galleryTrigger = useRef<GalleryTrigger>('panel')
  const wasGalleryOpen = useRef(false)
  const requestId = useRef(crypto.randomUUID())
  const submittedPayload = useRef('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const selectedRoom = rooms.find((room) => room.name === roomName) ?? initialRoom
  const selectedPhotos = selectedRoom ? photosForRoom(selectedRoom) : null

  useEffect(() => { if (result) resultRef.current?.focus({ preventScroll: true }) }, [result])

  // Closing the photo viewer returns focus to whichever control opened it.
  useEffect(() => {
    if (wasGalleryOpen.current && !galleryOpen) {
      ref.current?.querySelector<HTMLElement>(`[data-gallery-trigger="${galleryTrigger.current}"]`)?.focus({ preventScroll: true })
    }
    wasGalleryOpen.current = galleryOpen
  }, [galleryOpen, ref])

  // Highlight the form section currently in view.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    let frame: number | null = null
    const update = () => {
      frame = null
      const line = container.getBoundingClientRect().top + container.clientHeight / 3
      let current = 1
      steps.forEach((_, index) => {
        const section = document.getElementById(stepId(index + 1))
        if (section && section.getBoundingClientRect().top <= line) current = index + 1
      })
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 8) current = steps.length
      setActiveStep(current)
    }
    const onScroll = () => { if (frame === null) frame = requestAnimationFrame(update) }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  const openGallery = (trigger: GalleryTrigger) => {
    galleryTrigger.current = trigger
    setGalleryOpen(true)
  }

  const goToStep = (number: number) => {
    const section = document.getElementById(stepId(number))
    if (!section) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    section.focus({ preventScroll: true })
  }

  const describe = (name: FieldName) => (errors[name] ? { 'aria-invalid': true, 'aria-describedby': `booking-${name}-error` } : {})

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const enquiry: ReservationEnquiry = {
      kind: 'reservation',
      firstName: String(data.get('firstName') ?? '').trim(),
      surname: String(data.get('surname') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      mobile: String(data.get('mobile') ?? '').trim(),
      room: roomName,
      selectedDates: dates,
      guests,
      message: String(data.get('message') ?? ''),
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? ''),
    }
    const found = validate(enquiry)
    setErrors(found)
    const firstInvalid = (['dates', 'firstName', 'email', 'mobile', 'consent'] as const).find((name) => found[name])
    if (firstInvalid) {
      const target = firstInvalid === 'dates'
        ? formRef.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]')
        : formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
      target?.focus()
      return
    }

    // Retrying the same enquiry reuses its id so the server can de-duplicate it.
    const payload = JSON.stringify(enquiry)
    if (submittedPayload.current !== payload) {
      requestId.current = crypto.randomUUID()
      submittedPayload.current = payload
    }
    setPending(true)
    try {
      const response = await deliverEnquiry(enquiry, requestId.current)
      setResult({ enquiry, id: response.id })
    } catch (error) {
      setResult({ enquiry, error: error instanceof Error ? error.message : 'Your enquiry has not been sent. Please use the email draft or call the hotel.' })
    } finally {
      setPending(false)
    }
    scrollRef.current?.scrollTo({ top: 0 })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-navy-950/70 backdrop-blur-sm md:items-center md:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onKeyDown={(event) => {
          // Escape steps back from the photo viewer before it closes the form.
          if (galleryOpen && event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            setGalleryOpen(false)
            return
          }
          onKeyDown(event)
        }}
        className="relative grid h-sheet w-full max-w-6xl grid-rows-1 overflow-hidden bg-cream-100 max-md:animate-sheet-up max-md:rounded-t-3xl md:h-full md:max-h-224 md:animate-sheet-in md:grid-cols-5"
      >
        {/* Reserves the left column; the photo panel is layered over it so it can widen across the form. */}
        <div aria-hidden="true" className="hidden md:col-span-2 md:block" />

        <div ref={scrollRef} className="min-h-0 overflow-y-auto overscroll-contain md:col-span-3" {...(galleryOpen ? inertProps : {})}>
          <div className="sticky top-0 z-10 border-b border-ink/10 bg-cream-100/95 backdrop-blur-md">
          {/* Phones: grab handle — drag the sheet down to close it. */}
          <div {...dragHandle} aria-hidden="true" className="flex h-5 cursor-grab touch-none items-center justify-center active:cursor-grabbing md:hidden">
            <span className="h-1 w-10 rounded-full bg-ink/20" />
          </div>
          <div className="flex items-center justify-between gap-4 px-4 pb-2 sm:px-6 md:px-10 md:pt-2">
            {result ? (
              <p className="text-eyebrow font-semibold uppercase text-gold-700">Reservation request</p>
            ) : (
              <nav aria-label="Form sections" className="-ml-2 flex">
                {steps.map((label, index) => {
                  const number = index + 1
                  const current = activeStep === number
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => goToStep(number)}
                      aria-current={current ? 'step' : undefined}
                      className={cx(
                        'inline-flex min-h-11 items-center gap-2 border-b-2 px-2 text-eyebrow font-semibold uppercase transition-colors sm:px-3',
                        current ? 'border-gold-500 text-navy-950' : 'border-transparent text-ink-muted hover:text-navy-950',
                      )}
                    >
                      <span className="hidden tabular-nums text-gold-700 sm:inline">{pad(number)}</span>
                      {label}
                    </button>
                  )
                })}
              </nav>
            )}
            <button type="button" onClick={onClose} aria-label="Close reservation request" className="-mr-2 grid size-11 shrink-0 place-items-center text-navy-950 hover:bg-cream-200">
              <X aria-hidden="true" size={20} strokeWidth={1.25} />
            </button>
          </div>
          </div>

          <div className="px-4 pt-8 pb-10 sm:px-6 md:px-10">
            <h2 ref={titleRef} id="booking-title" tabIndex={-1} className="text-heading tracking-tight text-navy-950 outline-none">
              {result ? 'Your enquiry' : <>Plan <em className="text-gold-700">your stay.</em></>}
            </h2>

            {result && (
              <div ref={resultRef} tabIndex={-1} className="mt-8 outline-none">
                <EnquiryHandoff enquiry={result.enquiry} error={result.error} sentId={result.id} />
                {!result.id && (
                  <Button variant="text" arrow="back" className="mt-8" onClick={() => { setResult(null); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('[name="firstName"]')?.focus()) }}>
                    Edit your enquiry
                  </Button>
                )}
              </div>
            )}

            <div hidden={Boolean(result)}>
              <p className="mt-4 max-w-lg text-base text-ink-muted">Tell us what feels right. The hotel confirms availability, guest capacity and current rates with you before anything is booked.</p>

              <form ref={formRef} onSubmit={submit} noValidate className="mt-10 space-y-10">
                <Step number={1} title="When are you coming?">
                  <StayCalendar selectedDates={dates} min={today} onChange={(next) => { setDates(next); setErrors((current) => ({ ...current, dates: undefined })) }} errorId={errors.dates ? 'booking-dates-error' : undefined} />
                  {errors.dates && <p id="booking-dates-error" className="mt-3 text-sm text-danger" role="alert">{errors.dates}</p>}

                  <div className="mt-6 flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
                    <span id="booking-guests-label" className={labelClass}>Guests</span>
                    <div role="group" aria-labelledby="booking-guests-label" className="flex items-center gap-4">
                      <button type="button" aria-label="Remove a guest" disabled={guests <= 1} onClick={() => setGuests((count) => Math.max(1, count - 1))} className="grid size-11 place-items-center rounded-full border border-ink/25 text-navy-950 hover:border-navy-950 disabled:opacity-30">
                        <Minus aria-hidden="true" size={16} />
                      </button>
                      <output aria-live="polite" className="w-20 text-center font-serif text-lede text-navy-950">{guests} {guests === 1 ? 'guest' : 'guests'}</output>
                      <button type="button" aria-label="Add a guest" disabled={guests >= LIMITS.guests} onClick={() => setGuests((count) => Math.min(LIMITS.guests, count + 1))} className="grid size-11 place-items-center rounded-full border border-ink/25 text-navy-950 hover:border-navy-950 disabled:opacity-30">
                        <Plus aria-hidden="true" size={16} />
                      </button>
                    </div>
                  </div>
                </Step>

                <Step number={2} title="Choose a suite">
                  {/* Phones have no side panel, so the selected suite's photo lives here. */}
                  {selectedRoom && selectedPhotos?.photos[0] && (
                    <button
                      type="button"
                      data-gallery-trigger="banner"
                      onClick={() => openGallery('banner')}
                      aria-label={`View ${selectedRoom.name} photos in full`}
                      className="group relative mb-6 block w-full overflow-hidden md:hidden"
                    >
                      <Picture src={selectedPhotos.photos[0].src} alt="" sizes="100vw" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" />
                      <span className="absolute bottom-3 left-3 inline-flex min-h-9 items-center gap-2 bg-cream-50 px-3 text-eyebrow font-semibold uppercase text-navy-950">
                        <Expand aria-hidden="true" size={14} strokeWidth={1.5} />
                        {selectedPhotos.representative ? 'Representative photo' : `View ${selectedPhotos.photos.length} photos`}
                      </span>
                    </button>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rooms.map((room) => {
                      const cover = room.gallery?.[0]?.src ?? room.image
                      return (
                        <label key={room.name} className="group relative flex cursor-pointer items-center gap-4 border border-ink/15 bg-cream-50 p-3 transition-colors hover:border-navy-950 has-checked:border-navy-950 has-checked:bg-navy-950 has-checked:text-cream-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-500">
                          <input type="radio" name="room" value={room.name} checked={roomName === room.name} onChange={() => setRoomName(room.name)} className="sr-only" />
                          <Picture src={cover} alt="" sizes="64px" className="size-16 shrink-0 object-cover" />
                          <span className="min-w-0">
                            <span className="block font-serif text-lede leading-tight">{room.name}</span>
                            <span className="block text-xs opacity-80">{formatRate(room.rate)} / night · {room.tagline}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </Step>

                <Step number={3} title="Your details">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field name="firstName" label="First name" error={errors.firstName}>
                      <input id="booking-firstName" name="firstName" autoComplete="given-name" maxLength={LIMITS.name} className={inputClass} {...describe('firstName')} />
                    </Field>
                    <Field name="surname" label="Surname (optional)">
                      <input id="booking-surname" name="surname" autoComplete="family-name" maxLength={LIMITS.name} className={inputClass} />
                    </Field>
                    <Field name="email" label="Email" error={errors.email}>
                      <input id="booking-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} placeholder="you@example.com" className={inputClass} {...describe('email')} />
                    </Field>
                    <Field name="mobile" label="Mobile" error={errors.mobile}>
                      <input id="booking-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} placeholder="0912 345 6789" className={inputClass} {...describe('mobile')} />
                    </Field>
                    <div className="sm:col-span-2">
                      <label htmlFor="booking-message" className={labelClass}>A note for your stay (optional)</label>
                      <textarea id="booking-message" name="message" rows={3} maxLength={LIMITS.message} defaultValue={request.note} placeholder="Celebrating something, arriving late, or need an accessible room?" className={cx(inputClass, 'resize-y')} />
                    </div>
                  </div>
                  <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                </Step>

                <div className="border-t border-ink/15 pt-8">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                    <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-navy-950" {...describe('consent')} />
                    <span>I agree that Wyattel Suite may use these details to reply to my enquiry. I understand this is not a confirmed booking.</span>
                  </label>
                  {errors.consent && <p id="booking-consent-error" className="mt-2 pl-8 text-sm text-danger">{errors.consent}</p>}
                </div>

                {/* Phones: the send button stays pinned to the bottom of the sheet, like an app checkout. */}
                <div className="max-md:sticky max-md:bottom-0 max-md:z-10 max-md:-mx-4 max-md:border-t max-md:border-ink/10 max-md:bg-cream-100/95 max-md:px-4 max-md:pt-3 max-md:pb-safe max-md:backdrop-blur-md sm:max-md:-mx-6 sm:max-md:px-6">
                  <Button type="submit" size="lg" arrow disabled={pending} aria-busy={pending} className="w-full max-md:rounded-full">
                    {pending ? 'Sending your request…' : 'Send reservation request'}
                  </Button>
                  <p className="mt-3 flex items-center justify-center gap-2 pb-3 text-center text-xs text-ink-muted md:mt-4 md:pb-0">
                    <Lock aria-hidden="true" size={12} className="shrink-0" />
                    No payment taken. If online sending is unavailable, we’ll prepare an email for you.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {selectedRoom && (
          <BookingGallery
            key={selectedRoom.name}
            room={selectedRoom}
            expanded={galleryOpen}
            onExpand={() => openGallery('panel')}
            onCollapse={() => setGalleryOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Check, Copy, Mail, Phone } from 'lucide-react'
import { enquiryEmail, hotelFacebook, hotelPhones } from '../data/site'
import { emailDraftLink, enquirySummary } from '../utils/enquiries'
import { ButtonLink, Button } from './ui/Button'
import type { ReservationEnquiry } from '../types'

type Props = { enquiry: ReservationEnquiry; error?: string; sentId?: string }

/** Outcome of an enquiry: confirmation of delivery, or a clear manual hand-off. */
export default function EnquiryHandoff({ enquiry, error, sentId }: Props) {
  const [copyStatus, setCopyStatus] = useState('')
  const draft = emailDraftLink(enquiryEmail, enquiry)
  const summary = enquirySummary(enquiry)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopyStatus('Copied. Paste it into an email or message to the hotel.')
    } catch {
      setCopyStatus('Select and copy the enquiry text below.')
    }
  }

  if (sentId) {
    return (
      <div className="border-l-2 border-success bg-cream-50 p-6 md:p-8">
        <p className="flex items-center gap-2 text-eyebrow font-semibold uppercase text-success">
          <Check aria-hidden="true" size={14} strokeWidth={2} />
          Enquiry submitted
        </p>
        <h3 className="mt-4 text-title text-navy-950">The next step is personal.</h3>
        <p className="mt-3 text-base text-ink-muted" role="status" data-selectable="true">
          The email service has accepted your enquiry. This is not a confirmed booking—the team will contact you to confirm availability and arrangements.
        </p>
        <p className="mt-4 text-sm text-ink" data-selectable="true">Reference: <span className="font-semibold">{sentId}</span></p>
        <PhoneLinks />
      </div>
    )
  }

  return (
    <div className="border-l-2 border-lacquer bg-cream-50 p-6 md:p-8">
      <p className="text-eyebrow font-semibold uppercase text-lacquer">Ready — not sent yet</p>
      <h3 className="mt-4 text-title text-navy-950">One more step to connect.</h3>
      <p className="mt-3 text-base text-ink-muted" role="status" data-selectable="true">
        {error || 'Open the prepared email, review it, and press Send in your email app. Nothing has been delivered yet.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {draft && <ButtonLink href={draft} arrow><Mail aria-hidden="true" size={14} />Open email draft</ButtonLink>}
        <Button variant="secondary" onClick={copy}><Copy aria-hidden="true" size={14} />Copy enquiry</Button>
        <ButtonLink variant="secondary" href={hotelFacebook} target="_blank" rel="noreferrer">Message on Facebook<span className="sr-only"> (opens in a new tab)</span></ButtonLink>
      </div>
      <p className="mt-3 min-h-6 text-sm text-ink" role="status">{copyStatus}</p>
      <details className="mt-4 border-t border-ink/10 pt-4">
        <summary className="min-h-11 text-sm font-semibold text-navy-950 underline decoration-ink/25 underline-offset-4">Review your enquiry</summary>
        <pre className="mt-3 overflow-x-auto bg-cream-200 p-4 font-sans text-xs whitespace-pre-wrap text-ink" data-selectable="true">{summary}</pre>
      </details>
      <PhoneLinks />
    </div>
  )
}

function PhoneLinks() {
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6">
      {hotelPhones.map((phone) => (
        <a key={phone.href} href={phone.href} className="inline-flex min-h-11 items-center gap-2 text-sm text-navy-950 underline decoration-ink/25 underline-offset-4 hover:decoration-navy-950">
          <Phone aria-hidden="true" size={14} strokeWidth={1.5} />
          Call {phone.label}
        </a>
      ))}
    </div>
  )
}

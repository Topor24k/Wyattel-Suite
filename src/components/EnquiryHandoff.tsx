import React, { useEffect, useRef, useState } from 'react'
import { enquiryEmail, hotelFacebook, hotelPhones } from '../data/site'
import { emailDraftLink, enquirySummary } from '../utils/enquiries'
import { Arrow } from './UI'

export default function EnquiryHandoff({ enquiry, error, sentId }: { enquiry: any; error?: string; sentId?: string }) {
  const [copyStatus, setCopyStatus] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const status = statusRef.current
    if (!status || status.closest('[role="dialog"]')) return
    status.focus({ preventScroll: true })
    status.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [])
  const draft = emailDraftLink(enquiryEmail, enquiry)
  const copy = async () => { try { await navigator.clipboard.writeText(enquirySummary(enquiry)); setCopyStatus('Enquiry copied. Paste it into your email or message to the hotel.') } catch { setCopyStatus('Select and copy your enquiry text below.') } }
  return <div className="enquiry-handoff" ref={statusRef} tabIndex={-1}>
    <p className="overline">{sentId ? 'ENQUIRY SUBMITTED' : 'YOUR ENQUIRY IS READY — NOT SENT'}</p><h2>{sentId ? 'The next step is personal.' : 'One more step to connect.'}</h2>
    <p data-selectable="true" role="status">{sentId ? 'The email service has accepted your enquiry. This is not a confirmed booking. The team must confirm availability and your arrangements.' : error || 'Open the prepared email, review it, and press Send in your email app. Nothing has been delivered yet.'}</p>
    {sentId && <p className="enquiry-reference" data-selectable="true">Enquiry reference: {sentId}</p>}
    {!sentId && <><div className="enquiry-handoff-actions">{draft && <a className="enquiry-email-action" href={draft}>OPEN EMAIL DRAFT <Arrow /></a>}<button className="enquiry-copy-action" type="button" onClick={copy}>COPY ENQUIRY <Arrow /></button><a className="enquiry-facebook-action" href={hotelFacebook} target="_blank" rel="noreferrer">CONTACT ON FACEBOOK <Arrow /></a></div><p className="enquiry-copy-status" role="status">{copyStatus}</p><details className="enquiry-summary"><summary>Review your enquiry</summary><pre data-selectable="true">{enquirySummary(enquiry)}</pre></details></>}
    <div className="enquiry-phone-actions">{hotelPhones.map(phone => <a key={phone.href} href={phone.href}>CALL {phone.label}</a>)}</div>
  </div>
}

import { enquirySummary } from '../src/utils/enquiries.js'
import { getStayDates } from '../src/utils/bookingDates.js'

const validRooms = new Set(['Deluxe Suite', 'Twin Suite', 'Presidential Suite', 'Matrimonial Suite', 'Family Suite'])
const validEvents = new Set(['Wedding preparation', 'Private celebration', 'Meeting or group event', 'Dining enquiry'])
const limits = new Map()
const text = (value, max, required = false) => typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0)
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value

export function validateEnquiry(data, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })) {
  if (!data || !['reservation', 'event'].includes(data.kind)) return 'Choose a valid enquiry type.'
  if (!text(data.firstName, 100, true) || !text(data.surname || '', 100) || !text(data.message || '', 5000)) return 'Check your name and message length.'
  if (!text(data.email, 254, true) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Enter a valid email address.'
  if (!text(data.mobile, 40, true) || !/^[+\d\s().-]{7,40}$/.test(data.mobile)) return 'Enter a valid contact number.'
  if (data.consent !== true) return 'Please agree to the use of your details for this enquiry.'
  if (data.website) return 'The enquiry could not be accepted.'
  if (data.kind === 'reservation') {
    if (!validRooms.has(data.room) || !Number.isInteger(data.guests) || data.guests < 1 || data.guests > 12) return 'Check your suite and guest count.'
    if (!Array.isArray(data.selectedDates) || !data.selectedDates.length || data.selectedDates.some(date => !validDate(date) || date < today)) return 'Choose valid stay dates that are not in the past.'
    const span = (Date.parse(`${data.selectedDates.at(-1)}T00:00:00Z`) - Date.parse(`${data.selectedDates[0]}T00:00:00Z`)) / 86400000 + 1
    if (span !== data.selectedDates.length) return 'Choose one connected stay, without gaps or duplicate dates.'
    const connected = getStayDates(data.selectedDates[0], data.selectedDates.at(-1))
    if (connected.length !== data.selectedDates.length || connected.some((date, index) => date !== data.selectedDates[index])) return 'Choose one connected stay, without gaps or duplicate dates.'
  } else if (!validEvents.has(data.eventType) || !validDate(data.eventDate) || data.eventDate < today || !Number.isInteger(data.eventGuests) || data.eventGuests < 1 || data.eventGuests > 10000) return 'Check your occasion, date, and estimated attendance.'
  return null
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Use POST for enquiries.' }) }
  const origin = req.headers.origin
  const host = req.headers.host
  if (origin && (!host || (() => { try { return new URL(origin).host !== host } catch { return true } })())) return res.status(403).json({ message: 'Please send your enquiry from the hotel website.' })
  let data
  try {
    if (Number(req.headers['content-length'] || 0) > 131072) return res.status(413).json({ message: 'This enquiry is too large.' })
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (Buffer.byteLength(JSON.stringify(data) || '') > 131072) return res.status(413).json({ message: 'This enquiry is too large.' })
  } catch { return res.status(400).json({ message: 'Check your enquiry format.' }) }
  const issue = validateEnquiry(data)
  if (issue) return res.status(400).json({ message: issue })
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  for (const [key, entry] of limits) if (entry.until < now) limits.delete(key)
  if (limits.size > 10000) return res.status(429).json({ message: 'Enquiries are busy right now. Please try again shortly or call the hotel.' })
  const quota = limits.get(ip) || { count: 0, until: now + 60000 }
  if (quota.count >= 5) return res.status(429).json({ message: 'Please wait a minute before sending another enquiry.' })
  quota.count += 1; limits.set(ip, quota)
  const { RESEND_API_KEY, RESERVATION_TO_EMAIL, RESERVATION_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !RESERVATION_TO_EMAIL || !RESERVATION_FROM_EMAIL) return res.status(503).json({ message: 'Automatic email delivery is not enabled yet. Your enquiry has not been sent. Open the prepared email draft and send it from your email app, or call the hotel.' })
  const enquiryId = String(req.headers['x-enquiry-id'] || '')
  if (!/^[a-zA-Z0-9-]{16,64}$/.test(enquiryId)) return res.status(400).json({ message: 'Refresh the page before submitting your enquiry.' })
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `wyattel-${enquiryId}` }, body: JSON.stringify({ from: RESERVATION_FROM_EMAIL, to: [RESERVATION_TO_EMAIL], reply_to: data.email, subject: `Wyattel ${data.kind === 'event' ? 'event / dining' : 'reservation'} enquiry`, text: enquirySummary(data) }), signal: AbortSignal.timeout(12000) })
    const result = await response.json()
    if (!response.ok || !result.id) return res.status(502).json({ message: 'The email service did not accept this enquiry. Please use the prepared email draft or call the hotel.' })
    return res.status(200).json({ id: result.id })
  } catch { return res.status(502).json({ message: 'Email delivery could not be confirmed. Please use the prepared email draft or contact the hotel before trying again.' }) }
}

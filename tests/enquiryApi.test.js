import test from 'node:test'
import assert from 'node:assert/strict'
import handler, { validateEnquiry } from '../api/enquiry.js'
import { getStayDates } from '../src/utils/bookingDates.js'

const fixture = { kind: 'reservation', firstName: 'Test Guest', surname: '', email: 'guest@example.com', mobile: '09123456789', room: 'Deluxe Suite', selectedDates: ['2050-10-01'], guests: 2, message: '', consent: true, website: '' }
const req = body => ({ method: 'POST', headers: { host: 'localhost:5173', origin: 'http://localhost:5173', 'x-enquiry-id': 'test-enquiry-000001', 'x-forwarded-for': `test-${Math.random()}` }, body })
const res = () => ({ code: 0, body: null, headers: {}, setHeader(key, value) { this.headers[key] = value }, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })

test('enquiry validation supports single days and long connected ranges', () => {
  assert.equal(validateEnquiry(fixture, '2026-10-01'), null)
  assert.equal(validateEnquiry({ ...fixture, selectedDates: getStayDates('2050-10-01', '2051-11-20') }, '2026-10-01'), null)
})
test('enquiry validation rejects gaps, duplicates, reversed ranges, invalid dates, and past dates', () => {
  for (const selectedDates of [['2050-10-01','2050-10-16'], ['2050-10-01','2050-10-01'], ['2050-10-02','2050-10-01'], ['2050-02-30'], ['2020-01-01'], ['2050-10-01','9999-12-31']]) assert.ok(validateEnquiry({ ...fixture, selectedDates }, '2026-10-01'))
})
test('contacts, consent, honeypot, and genuine room choices are required', () => {
  for (const change of [{ consent: false }, { email: 'not-an-email' }, { email: 'a@example.com\nBcc:x@example.com' }, { room: 'Imaginary Suite' }, { website: 'spam' }, { guests: 1.2 }, { message: 'x'.repeat(5001) }]) assert.ok(validateEnquiry({ ...fixture, ...change }, '2026-10-01'))
})
test('event enquiries are validated separately from room reservations', () => {
  const event = { ...fixture, kind: 'event', eventType: 'Wedding preparation', eventDate: '2050-10-01', eventGuests: 30 }
  assert.equal(validateEnquiry(event, '2026-10-01'), null)
  assert.ok(validateEnquiry({ ...event, eventGuests: 0 }, '2026-10-01'))
  assert.ok(validateEnquiry({ ...event, eventType: 'Unlisted service' }, '2026-10-01'))
})
test('endpoint rejects methods, cross-origin requests, and malformed requests', async () => {
  const method = res(); await handler({ ...req(fixture), method: 'GET' }, method); assert.equal(method.code, 405)
  const cross = res(); await handler({ ...req(fixture), headers: { host: 'localhost', origin: 'https://untrusted.example' } }, cross); assert.equal(cross.code, 403)
  const malformed = res(); await handler(req('{broken'), malformed); assert.equal(malformed.code, 400)
  const invalid = res(); await handler(req({ ...fixture, consent: false }), invalid); assert.equal(invalid.code, 400)
})
test('unconfigured delivery returns not-sent rather than a fake confirmation', async () => {
  const before = process.env.RESEND_API_KEY
  delete process.env.RESEND_API_KEY
  try { const response = res(); await handler(req(fixture), response); assert.equal(response.code, 503); assert.match(response.body.message, /has not been sent/) }
  finally { if (before !== undefined) process.env.RESEND_API_KEY = before }
})
test('provider acceptance and failure are checked without sending any real email', async () => {
  const keys = ['RESEND_API_KEY', 'RESERVATION_TO_EMAIL', 'RESERVATION_FROM_EMAIL']
  const before = Object.fromEntries(keys.map(key => [key, process.env[key]]))
  const originalFetch = globalThis.fetch
  process.env.RESEND_API_KEY = 'test-only-key'; process.env.RESERVATION_TO_EMAIL = 'approved@example.com'; process.env.RESERVATION_FROM_EMAIL = 'verified@example.com'
  try {
    let sentBody, sentHeaders
    globalThis.fetch = async (_, options) => { sentBody = JSON.parse(options.body); sentHeaders = options.headers; return { ok: true, json: async () => ({ id: 'mock-provider-id' }) } }
    const accepted = res(); await handler(req(fixture), accepted)
    assert.equal(accepted.code, 200); assert.equal(accepted.body.id, 'mock-provider-id')
    assert.deepEqual(sentBody.to, ['approved@example.com']); assert.equal(sentBody.reply_to, fixture.email)
    assert.match(sentHeaders['Idempotency-Key'], /^wyattel-/)
    globalThis.fetch = async () => ({ ok: false, json: async () => ({ message: 'provider detail' }) })
    const failed = res(); await handler(req(fixture), failed); assert.equal(failed.code, 502); assert.equal(failed.body.id, undefined)
  } finally {
    globalThis.fetch = originalFetch
    for (const key of keys) { if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key] }
  }
})

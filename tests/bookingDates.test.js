import test from 'node:test'
import assert from 'node:assert/strict'
import { getStayDates } from '../src/utils/bookingDates.js'

test('October 1 through 16 includes every day, with no gaps', () => {
  const dates = getStayDates('2026-10-01', '2026-10-16')
  assert.deepEqual(dates, Array.from({ length: 16 }, (_, index) => `2026-10-${String(index + 1).padStart(2, '0')}`))
})

test('a single day is valid', () => {
  assert.deepEqual(getStayDates('2026-10-01', '2026-10-01'), ['2026-10-01'])
})

test('reverse selection still produces one connected chronological stay', () => {
  assert.deepEqual(getStayDates('2026-11-02', '2026-10-31'), ['2026-10-31', '2026-11-01', '2026-11-02'])
})

test('ranges include leap days and daylight-saving boundary days', () => {
  assert.deepEqual(getStayDates('2028-02-28', '2028-03-01'), ['2028-02-28', '2028-02-29', '2028-03-01'])
  assert.deepEqual(getStayDates('2026-03-07', '2026-03-10'), ['2026-03-07', '2026-03-08', '2026-03-09', '2026-03-10'])
})

test('a long stay is not limited to two days or one month', () => {
  assert.equal(getStayDates('2026-01-01', '2026-12-31').length, 365)
})

test('missing or invalid endpoints cannot create a stay', () => {
  assert.deepEqual(getStayDates('', '2026-10-01'), [])
  assert.deepEqual(getStayDates('invalid', '2026-10-01'), [])
})

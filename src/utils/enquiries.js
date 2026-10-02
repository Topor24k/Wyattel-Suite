export function enquirySummary(enquiry) {
  return [
    `WYATTEL SUITE · ${enquiry.kind === 'event' ? 'EVENT / DINING ENQUIRY' : 'RESERVATION ENQUIRY'}`,
    `Name: ${enquiry.firstName} ${enquiry.surname || ''}`.trim(),
    `Email: ${enquiry.email}`,
    `Mobile: ${enquiry.mobile}`,
    enquiry.room ? `Suite: ${enquiry.room}` : '',
    enquiry.selectedDates?.length ? `Stay dates (inclusive): ${enquiry.selectedDates[0]}${enquiry.selectedDates.length > 1 ? ` to ${enquiry.selectedDates.at(-1)}` : ''}` : '',
    enquiry.guests ? `Guests: ${enquiry.guests}` : '',
    enquiry.eventType ? `Occasion: ${enquiry.eventType}` : '',
    enquiry.eventDate ? `Preferred date: ${enquiry.eventDate}` : '',
    enquiry.eventGuests ? `Estimated attendance: ${enquiry.eventGuests}` : '',
    `Message: ${enquiry.message || 'No additional requests.'}`,
    '', 'Please confirm availability, current rates, inclusions, and applicable policies.',
  ].filter(line => line !== '').join('\n')
}

export function emailDraftLink(recipient, enquiry) {
  if (!recipient) return ''
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(`Wyattel ${enquiry.kind === 'event' ? 'event / dining' : 'reservation'} enquiry`)}&body=${encodeURIComponent(enquirySummary(enquiry))}`
}

export async function deliverEnquiry(enquiry, requestId, fetcher = fetch) {
  const response = await fetcher('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Enquiry-Id': requestId }, body: JSON.stringify(enquiry), signal: AbortSignal.timeout(15000) })
  let result
  try { result = await response.json() } catch { throw new Error('Online delivery is unavailable. Your enquiry has not been sent. Use the email draft or call the hotel.') }
  if (!response.ok || !result.id) throw new Error(result.message || 'Your enquiry has not been sent. Please use the email draft or contact the hotel.')
  return result
}

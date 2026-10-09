// Shared by the browser form and api/enquiry.js so both accept the same input.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_PATTERN = /^[+\d\s().-]{7,40}$/
export const LIMITS = { name: 100, email: 254, phone: 40, message: 5000, guests: 12 }

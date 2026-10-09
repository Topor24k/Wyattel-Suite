export type RoomPhoto = {
  src: string
  alt: string
  caption: string
}

export type Room = {
  name: string
  /** Short positioning line shown under the suite name. */
  tagline: string
  /** Listed reference rate in PHP per night. Must be confirmed by the hotel. */
  rate: number
  image: string
  text: string
  /** Listed room features, in sentence case. */
  features: string[]
  gallery?: RoomPhoto[]
}

export type Experience = {
  id: string
  number: string
  title: string
  eyebrow: string
  text: string
  image: string
  imageAlt: string
  action: { label: string; href?: string; enquiryNote?: string }
}

/** Shape sent to /api/enquiry; mirrors validateEnquiry in api/enquiry.js. */
export type ReservationEnquiry = {
  kind: 'reservation'
  firstName: string
  surname: string
  email: string
  mobile: string
  room: string
  selectedDates: string[]
  guests: number
  message: string
  consent: boolean
  website: string
}

/** Opens the reservation enquiry with optional prefilled choices. */
export type BookingRequest = {
  room?: string
  note?: string
  dates?: string[]
  guests?: number
}

export type OpenBooking = (request?: BookingRequest) => void

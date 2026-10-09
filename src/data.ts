import type { Experience, Room } from './types'
import { suiteGalleries } from './data/suiteGalleries'

// Rates and features are listed reference details; the hotel confirms them per stay.
export const rooms: Room[] = [
  { name: 'Deluxe Suite', tagline: 'Comfort for every stay', rate: 1900, image: '/Pictures/Wyattel%20Suite%201%20Background.png', text: 'A polished, comfortable suite with the essentials for an easy overnight stay in Tacurong.', features: ['Air-conditioned', 'Private bath'] },
  { name: 'Twin Suite', tagline: 'Accessible comfort', rate: 2400, image: '/Pictures/Wyattel%20Suite%202%20Background.png', text: 'A thoughtful suite for guests who value extra comfort and a stay that feels easy from arrival.', features: ['Accessible', 'Private bath'] },
  { name: 'Presidential Suite', tagline: 'A more spacious stay', rate: 2400, image: '/Pictures/Wyattel%20Suite%201%20Background.png', text: 'A generous room for settling in, with a calm atmosphere for business trips, celebrations and longer visits.', features: ['Spacious room', 'Private bath'] },
  { name: 'Matrimonial Suite', tagline: 'A private stay for two', rate: 2900, image: '/Pictures/Wyattel%20Suite%202%20Background.png', text: 'A restful suite for two, with a comfortable bed and the quiet ease of a private retreat.', features: ['Queen bed', 'Private bath'] },
  { name: 'Family Suite', tagline: 'Room for everyone', rate: 3400, image: '/Pictures/Wyattel%20Suite%201%20Background.png', text: 'A practical, welcoming choice for family visits, with room to settle in together.', features: ['Family stay', 'Private bath'] },
].map((room) => ({ ...room, gallery: suiteGalleries[room.name] }))

export const lowestRate = Math.min(...rooms.map((room) => room.rate))

export const experiences: Experience[] = [
  { id: 'weddings', number: '01', title: 'Say “I Do”', eyebrow: 'To the perfect beginning', text: 'Begin your wedding story at Wyattel Suite. Our elegant wedding room is ideal for preparation and photo-shoot moments—a beautiful setting to create timeless memories in style and comfort.', image: '/Pictures/Wyattel%20Suite%20Wedding.png', imageAlt: 'Wedding couple at Wyattel Suite', action: { label: 'Enquire about a wedding morning', enquiryNote: 'I would like to enquire about a wedding preparation room and photo-shoot arrangements.' } },
  { id: 'modern-luxury', number: '02', title: 'Modern Luxury Hotel', eyebrow: 'A refined stay, made for you', text: 'Discover modern luxury at Wyattel Suite, where thoughtfully designed rooms, contemporary comfort and warm hospitality come together. Settle in, slow down and enjoy a stay that feels beautifully personal.', image: '/Pictures/Wyattel%20Suite%201%20Background.png', imageAlt: 'Guest suite at Wyattel Suite', action: { label: 'Explore the suites', href: '/suites' } },
  { id: 'events', number: '03', title: 'Every Event, Handled Here', eyebrow: 'Every occasion belongs here', text: 'From birthdays and reunions to meetings and milestone celebrations, make Wyattel Suite part of your occasion. Share your plans with our team and let us help shape an event that feels right for you.', image: '/Pictures/Wyattel%20Hero%20Background.png', imageAlt: 'Wyattel Suite building and entrance in Tacurong City', action: { label: 'Enquire about an event', enquiryNote: 'I would like to enquire about hosting an event. Occasion, date and estimated guests:' } },
  { id: 'dining', number: '04', title: 'Delicious Dining', eyebrow: 'Be full with our delicious food menu', text: 'Come hungry and leave satisfied. Explore our delicious food menu and enjoy a comforting meal with family, friends or fellow travellers at Wyattel Suite.', image: '/Pictures/Wyattel%20Suite%20Filipino%20Menu.png', imageAlt: 'Wyattel Suite Filipino food menu', action: { label: 'View the menu', href: '/gallery?category=Dining' } },
]

/** Facts the hotel lists publicly; shown on the homepage and story page. */
export const hotelServices = [
  'Free Wi-Fi access',
  'Free on-site parking',
  'On-site restaurant',
  'Various dishes served',
  'Function hall for 50–100 guests',
  'Air-conditioned rooms',
]

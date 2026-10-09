// `import.meta.env` is undefined outside Vite (e.g. the node test runner).
export const enquiryEmail: string = import.meta.env?.VITE_ENQUIRY_EMAIL || ''
export const hotelFacebook = 'https://www.facebook.com/WyattelSuites/'
export const hotelMaps = 'https://maps.google.com/?q=Wyattel+Suite+Tacurong'
export const hotelAddress = 'Prk. Waya-waya, National Highway, Tacurong City, Sultan Kudarat'
export const hotelAddressLines = ['Prk. Waya-waya, National Highway', 'Tacurong City, Sultan Kudarat']
export const hotelPhones = [{ label: '0912 292 9592', href: 'tel:+639122929592' }, { label: '0965 977 0234', href: 'tel:+639659770234' }]

export type NavLink = { label: string; href: string; image: string }

/** Primary navigation. The image previews beside the link in the full-screen menu. */
export const navLinks: NavLink[] = [
  { label: 'Home', href: '/', image: '/Pictures/Wyattel%20Hero%20Background.png' },
  { label: 'Our suites', href: '/suites', image: '/Deluxe%20Suite%20Images/Wyattel%20Suite%20Deluxe%201.png' },
  { label: 'The gallery', href: '/gallery', image: '/Pictures/Wyattel%20Story%20Detail%20Background.png' },
  { label: 'Dining & celebrations', href: '/experiences', image: '/Pictures/Wyattel%20Suite%20Wedding.png' },
  { label: 'The journal', href: '/journal', image: '/Matrimonial%20Suite%20Images/Wyattel%20Suite%20Matrimonial%201.png' },
  { label: 'Plan your stay', href: '/plan-your-stay', image: '/Family%20Suite%20Images/Wyattel%20Suite%20Family%201.png' },
  { label: 'Offers', href: '/offers', image: '/Twin%20Suite%20Images/Wyattel%20Suite%20Twin%201.png' },
  { label: 'Our story', href: '/our-story', image: '/Pictures/Wyattel%20Story%20Main%20Background.png' },
]

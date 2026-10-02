export type HotelOffer = { id: string; title: string; description: string; image: string; starts: string; ends: string; inclusions: string[]; terms: string; approved: boolean }
// Publish only hotel-approved, dated offers here. No fabricated discounts.
export const approvedOffers: HotelOffer[] = []
export const activeOffers = (today: string) => approvedOffers.filter(offer => offer.approved && offer.starts <= today && offer.ends >= today)

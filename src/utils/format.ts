const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })

/** ₱1,900 */
export const formatRate = (rate: number) => peso.format(rate)

/** 1 → "01" */
export const pad = (value: number) => String(value).padStart(2, '0')

/** ISO `YYYY-MM-DD` for a local calendar day. */
export const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** "Oct 7, 2026" for an ISO date key. */
export const displayDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/** Adds whole days to an ISO date key. */
export const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return dateKey(date)
}

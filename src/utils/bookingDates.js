// Calendar days, inclusive of both endpoints; UTC avoids daylight-saving gaps.
export function getStayDates(firstDate, lastDate) {
  if (!firstDate || !lastDate) return []
  const [start, end] = [firstDate, lastDate].sort()
  const cursor = new Date(`${start}T00:00:00Z`)
  const finalDay = new Date(`${end}T00:00:00Z`)
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(finalDay.getTime())) return []
  const dates = []
  while (cursor <= finalDay) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return dates
}

const MONTH_YEAR = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
const FULL_DATE = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' })
const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const formatMonthYear = (iso: string) => MONTH_YEAR.format(new Date(iso))
export const formatDate = (iso: string) => FULL_DATE.format(new Date(iso))

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/** "3 days ago", "last month", "2 years ago" */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

const RECENT_MS = 45 * 24 * 3600 * 1000

/** Recent activity reads as "3 days ago"; anything older as a plain "Mar 2025". */
export function formatActivity(iso: string, now: number = Date.now()): string {
  return now - new Date(iso).getTime() < RECENT_MS ? timeAgo(iso, now) : formatMonthYear(iso)
}

import { useMemo } from 'react'
import type { ContributionCalendar, ContributionDay } from '@/types'

/** Ember intensity scale, level 0 → 4 (GitHub's own buckets). */
const LEVELS = ['rgb(255 255 255 / 0.055)', '#5a2a1c', '#9c4024', '#e05a30', '#ff9068']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CELL = 11
const GAP = 3
const STEP = CELL + GAP

const DAY = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

interface Cell extends ContributionDay {
  week: number
  weekday: number
}

function layout(days: ContributionDay[]) {
  const cells: Cell[] = []
  const monthLabels: { week: number; label: string }[] = []
  let week = 0
  let lastMonth = -1

  days.forEach((day, index) => {
    const date = new Date(`${day.date}T00:00:00Z`)
    const weekday = date.getUTCDay()
    if (index > 0 && weekday === 0) week += 1
    cells.push({ ...day, week, weekday })

    const month = date.getUTCMonth()
    if (month !== lastMonth) {
      // Label a month at the first week that starts inside it; skip labels that would collide.
      const previous = monthLabels[monthLabels.length - 1]
      const labelWeek = weekday === 0 ? week : week + 1
      if (!previous || labelWeek - previous.week >= 3) monthLabels.push({ week: labelWeek, label: MONTHS[month]! })
      lastMonth = month
    }
  })

  return { cells, monthLabels, weeks: week + 1 }
}

/**
 * GitHub-style contribution calendar. The grid is one SVG that scales to the
 * card's width (so the whole year is visible on a phone without scrolling);
 * the labels are HTML so they stay readable at any size.
 */
export function ContributionHeatmap({ calendar }: { calendar: ContributionCalendar }) {
  const { cells, monthLabels, weeks } = useMemo(() => layout(calendar.days), [calendar.days])
  const width = weeks * STEP - GAP
  const height = 7 * STEP - GAP

  return (
    <div>
      <div className="flex gap-2.5">
        {/* Weekday labels — hidden on small screens where rows are only a few pixels tall */}
        <div
          className="hidden shrink-0 grid-rows-7 pt-5 font-mono text-[0.6875rem] leading-none text-faint sm:grid"
          aria-hidden
        >
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
            <span key={index} className="flex items-center">
              {label}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-5 font-mono text-[0.6875rem] text-faint" aria-hidden>
            {monthLabels
              .filter((month) => month.week < weeks - 2)
              .map((month, index) => (
                <span
                  key={`${month.label}-${month.week}`}
                  // On phones every second label is dropped so they never collide.
                  className={index % 2 === 1 ? 'absolute hidden sm:inline' : 'absolute'}
                  style={{ left: `${((month.week * STEP) / width) * 100}%` }}
                >
                  {month.label}
                </span>
              ))}
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`Contribution calendar: ${calendar.total} contributions in the last year`}
          >
            {cells.map((cell) => (
              <rect
                key={cell.date}
                x={cell.week * STEP}
                y={cell.weekday * STEP}
                width={CELL}
                height={CELL}
                rx={2.5}
                fill={LEVELS[Math.min(cell.level, 4)]}
              >
                <title>
                  {cell.count === 0 ? 'No contributions' : `${cell.count} contribution${cell.count === 1 ? '' : 's'}`}{' '}
                  on {DAY.format(new Date(`${cell.date}T00:00:00Z`))}
                </title>
              </rect>
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-xs text-faint">
        <span>Less</span>
        {LEVELS.map((color) => (
          <span key={color} className="size-2.5 rounded-[3px]" style={{ backgroundColor: color }} aria-hidden />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

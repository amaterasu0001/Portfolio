import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Stat {
  label: string
  value: ReactNode
  hint?: string
}

/** Row of headline numbers. Only pass stats that were actually retrieved. */
export function GitHubStats({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line', className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-ink-900 px-4 py-4">
          <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-faint">{stat.label}</dt>
          <dd className="mt-1.5 truncate text-[1.375rem] font-semibold tracking-tight text-fg tabular-nums">
            {stat.value}
          </dd>
          {stat.hint && <p className="mt-0.5 text-xs text-faint">{stat.hint}</p>}
        </div>
      ))}
    </dl>
  )
}

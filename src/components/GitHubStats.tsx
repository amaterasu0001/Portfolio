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
    <dl className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line', className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-ink-900 px-4 py-4">
          <dt className="font-mono text-xs text-faint">{stat.label}</dt>
          <dd className="mt-2 truncate text-[1.375rem] font-medium tracking-[-0.01em] text-fg tabular-nums">
            {stat.value}
          </dd>
          {stat.hint && <p className="mt-1 text-xs text-faint">{stat.hint}</p>}
        </div>
      ))}
    </dl>
  )
}

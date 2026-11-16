import { RefreshCw } from 'lucide-react'
import { useGitHub } from '@/hooks/useGitHub'
import { cn } from '@/lib/cn'
import { formatDate, timeAgo } from '@/lib/format'

const reasons = {
  'rate-limited': 'API rate limit reached',
  offline: 'API unreachable',
  error: 'API error',
} as const

/** Says where the GitHub numbers on screen came from, and offers a retry when they are not live. */
export function DataSourceBadge({ className }: { className?: string }) {
  const { data, refreshing, refresh } = useGitHub()
  const degraded = data.reason !== undefined

  let label: string
  if (refreshing) label = 'Syncing with GitHub…'
  else if (data.source === 'live') label = 'Live from the GitHub API'
  else if (data.source === 'cache') label = `GitHub data from ${timeAgo(data.fetchedAt)}`
  else label = `GitHub snapshot from ${formatDate(data.fetchedAt)}`

  return (
    <p
      className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs text-faint', className)}
      role="status"
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          refreshing ? 'animate-pulse-soft bg-gold' : degraded ? 'bg-gold' : 'bg-ok',
        )}
        aria-hidden
      />
      <span>
        {label}
        {!refreshing && degraded && ` · ${reasons[data.reason!]}`}
      </span>
      {!refreshing && degraded && (
        <>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-muted transition-colors hover:border-white/25 hover:text-fg"
          >
            <RefreshCw className="size-3" aria-hidden />
            Retry
          </button>
        </>
      )}
    </p>
  )
}

import { languageColor } from '@/lib/languageColors'
import type { LanguageShare } from '@/lib/github'

const MAX_SHOWN = 6
const percent = (share: number) => (share < 0.01 ? '<1%' : `${Math.round(share * 100)}%`)

/** Stacked bar + legend of the language mix. */
export function LanguageBar({ languages }: { languages: LanguageShare[] }) {
  if (languages.length === 0) {
    return <p className="text-sm text-muted">No language data available.</p>
  }

  const shown = languages.slice(0, MAX_SHOWN)
  const rest = languages.slice(MAX_SHOWN)
  const restShare = rest.reduce((n, l) => n + l.share, 0)
  const segments = restShare > 0 ? [...shown, { language: 'Other', share: restShare, bytes: 0, repos: 0 }] : shown

  return (
    <div>
      <div
        className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={`Language mix: ${segments.map((l) => `${l.language} ${percent(l.share)}`).join(', ')}`}
      >
        {segments.map((l) => (
          <span
            key={l.language}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${l.share * 100}%`, backgroundColor: languageColor(l.language), minWidth: 3 }}
          />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm lg:grid-cols-1 xl:grid-cols-2">
        {segments.map((l) => (
          <li key={l.language} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-fg">
              <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-inset ring-white/15"
                style={{ backgroundColor: languageColor(l.language) }}
                aria-hidden
              />
              <span className="truncate">{l.language}</span>
            </span>
            <span className="font-mono text-xs text-faint">{percent(l.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import { formatActivity } from '@/lib/format'
import type { RepoView } from '@/lib/repos'
import { GitHubIcon } from './BrandIcons'
import { LanguageDot } from './LanguageDot'
import { Spotlight } from './Spotlight'
import { Tag } from './Tag'

interface RepoCardProps {
  view: RepoView
  onOpen: (repo: string) => void
}

/** Compact repository card for the explorer grid. */
export function RepoCard({ view, onOpen }: RepoCardProps) {
  const hasDetails = view.project !== null
  const titleClass =
    'text-left text-[1.0625rem] font-semibold tracking-tight text-fg transition-colors after:absolute after:inset-0 after:rounded-[inherit] hover:text-ember-300'

  return (
    <Spotlight as="article" className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow !text-[0.65rem] text-faint">
          {view.category}
          {view.isFork && ' · fork'}
        </p>
        {view.tier === 1 && (
          <span className="rounded-full bg-ember/12 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-ember-300">
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-3">
        {/* The whole card is the click target; the GitHub link below sits above it. */}
        {hasDetails ? (
          <button type="button" className={titleClass} onClick={() => onOpen(view.repo)} aria-haspopup="dialog">
            {view.name}
          </button>
        ) : (
          <a href={view.url} target="_blank" rel="noreferrer noopener" className={titleClass}>
            {view.name}
          </a>
        )}
      </h3>
      {view.name !== view.repo && <p className="mt-0.5 font-mono text-xs text-faint">{view.repo}</p>}

      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{view.description}</p>

      {view.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {view.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 font-mono text-xs text-faint">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-1">
          <LanguageDot language={view.language} />
          {view.stars > 0 && (
            <span className="inline-flex items-center gap-1" title="Stars">
              <Star className="size-3.5" aria-hidden />
              <span className="sr-only">Stars: </span>
              {view.stars}
            </span>
          )}
          {view.forks > 0 && (
            <span className="inline-flex items-center gap-1" title="Forks">
              <GitFork className="size-3.5" aria-hidden />
              <span className="sr-only">Forks: </span>
              {view.forks}
            </span>
          )}
          <time dateTime={view.pushedAt} title={new Date(view.pushedAt).toLocaleDateString()}>
            {formatActivity(view.pushedAt)}
          </time>
        </div>
        <a
          href={view.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${view.name} on GitHub`}
          className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-white/25 hover:text-fg"
        >
          <GitHubIcon className="size-3.5" />
          <ArrowUpRight className="sr-only" aria-hidden />
        </a>
      </div>
    </Spotlight>
  )
}

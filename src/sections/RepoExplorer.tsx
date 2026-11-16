import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpDown, ChevronDown, Search, X } from 'lucide-react'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { RepoCard } from '@/components/RepoCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { useGitHub } from '@/hooks/useGitHub'
import { cn } from '@/lib/cn'
import { plural } from '@/lib/format'
import { buildRepoViews, type RepoView } from '@/lib/repos'

type SortKey = 'relevance' | 'updated' | 'name' | 'stars'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Most significant' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'stars', label: 'Stars' },
]

const sorters: Record<SortKey, (a: RepoView, b: RepoView) => number> = {
  relevance: (a, b) => a.tier - b.tier || b.pushedAt.localeCompare(a.pushedAt),
  updated: (a, b) => b.pushedAt.localeCompare(a.pushedAt),
  name: (a, b) => a.name.localeCompare(b.name),
  stars: (a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt),
}

const ALL = 'All'

/** Unique values, in first-seen order. */
const unique = (values: string[]): string[] => [...new Set(values)]

export function RepoExplorer({ onOpenProject }: { onOpenProject: (repo: string) => void }) {
  const { data } = useGitHub()
  const [query, setQuery] = useState('')
  const [tech, setTech] = useState(ALL)
  const [category, setCategory] = useState(ALL)
  const [sort, setSort] = useState<SortKey>('relevance')

  const views = useMemo(() => buildRepoViews(data.repos), [data.repos])
  // Filter chips follow project significance, so the strongest stacks come first.
  const ranked = useMemo(() => [...views].sort(sorters.relevance), [views])
  const techs = useMemo(() => unique(ranked.flatMap((view) => view.tags)), [ranked])
  const categories = useMemo(() => unique(ranked.map((view) => view.category)), [ranked])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return views
      .filter((view) => tech === ALL || view.tags.includes(tech))
      .filter((view) => category === ALL || view.category === category)
      .filter((view) => {
        if (!needle) return true
        const haystack = [
          view.name,
          view.repo,
          view.description,
          view.language ?? '',
          view.category,
          ...view.tags,
          ...(view.project?.technologies ?? []),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(needle)
      })
      .sort(sorters[sort])
  }, [views, query, tech, category, sort])

  const filtered = query !== '' || tech !== ALL || category !== ALL
  const reset = () => {
    setQuery('')
    setTech(ALL)
    setCategory(ALL)
  }

  return (
    <section id="repositories" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="04"
            eyebrow="All repositories"
            title={
              <>
                Everything public, <span className="accent-serif text-ember-300">nothing hidden</span>.
              </>
            }
            description="The small ones too — first pages, coursework, re-uploads. Loaded from the GitHub API, so new repositories appear here on their own."
          />
          <Reveal className="shrink-0">
            <DataSourceBadge />
          </Reveal>
        </div>

        {/* Toolbar */}
        <Reveal delay={0.05} className="surface mt-10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, technology or description…"
                aria-label="Search repositories"
                className="h-11 w-full rounded-xl border border-line bg-ink-950 pl-10 pr-3 text-sm text-fg placeholder:text-faint transition-colors focus:border-ember/60 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
            <label className="relative flex items-center">
              <span className="sr-only">Sort repositories</span>
              <ArrowUpDown className="pointer-events-none absolute left-3.5 size-4 text-faint" aria-hidden />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 w-full appearance-none rounded-xl border border-line bg-ink-950 pl-10 pr-9 text-sm text-fg transition-colors focus:border-ember/60 focus:outline-none sm:w-auto"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4 text-faint" aria-hidden />
            </label>
          </div>

          <FilterRow label="Technology" options={[ALL, ...techs]} value={tech} onChange={setTech} />
          <FilterRow label="Category" options={[ALL, ...categories]} value={category} onChange={setCategory} />
        </Reveal>

        <div className="mt-6 flex items-center justify-between gap-4 font-mono text-xs text-faint">
          <p role="status" aria-live="polite">
            {filtered
              ? `${results.length} of ${plural(views.length, 'repository', 'repositories')}`
              : plural(views.length, 'repository', 'repositories')}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
            >
              <X className="size-3.5" aria-hidden />
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((view) => (
                <motion.li
                  key={view.repo}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <RepoCard view={view} onOpen={onOpenProject} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="mt-4 rounded-[1.125rem] border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="text-base font-medium text-fg">No repositories match those filters.</p>
            <p className="mt-1.5 text-sm text-muted">Try a different search term or clear the filters.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm text-fg transition-colors hover:bg-white/[0.06]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

interface FilterRowProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterRow({ label, options, value, onChange }: FilterRowProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <p className="w-24 shrink-0 font-mono text-[0.68rem] uppercase tracking-widest text-faint">{label}</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
        {options.map((option) => {
          const active = option === value
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors duration-200',
                active
                  ? 'border-fg bg-fg font-medium text-ink-950'
                  : 'border-line text-muted hover:border-white/25 hover:text-fg',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

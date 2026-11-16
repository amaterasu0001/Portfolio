import { useMemo } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { GitHubIcon } from '@/components/BrandIcons'
import { Button } from '@/components/Button'
import { ContributionHeatmap } from '@/components/ContributionHeatmap'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { GitHubStats, type Stat } from '@/components/GitHubStats'
import { LanguageBar } from '@/components/LanguageBar'
import { LanguageDot } from '@/components/LanguageDot'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { projectByRepo } from '@/data/projects'
import { profile } from '@/data/profile'
import { useGitHub } from '@/hooks/useGitHub'
import { languageBreakdown } from '@/lib/github'
import { formatActivity } from '@/lib/format'

export function GitHubSection() {
  const { data, calendar, calendarLoading } = useGitHub()
  const { user, repos } = data

  const languages = useMemo(() => languageBreakdown(repos), [repos])
  const recent = useMemo(
    () => [...repos].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 4),
    [repos],
  )
  const activeDays = calendar?.days.filter((day) => day.count > 0).length ?? 0
  const ownRepos = repos.filter((repo) => !repo.fork).length

  // Only real, retrieved numbers. Followers appear once there are some to show.
  const stats: Stat[] = [
    { label: 'Public repos', value: user.public_repos, hint: `${ownRepos} original` },
    ...(calendar ? [{ label: 'Contributions', value: calendar.total, hint: 'last 12 months' }] : []),
    ...(languages[0] ? [{ label: 'Top language', value: languages[0].language, hint: 'by bytes of code' }] : []),
    { label: 'Member since', value: new Date(user.created_at).getFullYear() },
    ...(user.followers > 0 ? [{ label: 'Followers', value: user.followers }] : []),
    ...(user.followers > 0 && user.following > 0 ? [{ label: 'Following', value: user.following }] : []),
  ]

  return (
    <section id="github" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="06"
            eyebrow="GitHub"
            title={
              <>
                The work, <span className="accent-serif text-ember-300">as GitHub sees it</span>.
              </>
            }
            description="Pulled from the public GitHub API when you opened this page. No hand-typed numbers."
          />
          <Reveal>
            <DataSourceBadge />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Contributions */}
          <Reveal className="surface min-w-0 p-5 sm:p-6 md:col-span-2 lg:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-[0.9375rem] font-medium text-fg">Contribution activity</h3>
              {calendar && (
                <p className="font-mono text-xs text-faint">
                  <span className="text-fg">{calendar.total}</span> contributions ·{' '}
                  <span className="text-fg">{activeDays}</span> active days · last 12 months
                </p>
              )}
            </div>
            <div className="mt-5">
              {calendar ? (
                <ContributionHeatmap calendar={calendar} />
              ) : calendarLoading ? (
                <div className="h-[8.5rem] animate-pulse-soft rounded-xl bg-white/[0.04]" role="status" aria-label="Loading contribution calendar" />
              ) : (
                <p className="rounded-xl border border-dashed border-line-strong px-4 py-10 text-center text-sm text-muted">
                  The contribution calendar couldn’t be loaded right now.{' '}
                  <a href={user.html_url} target="_blank" rel="noreferrer noopener" className="text-ember-300 underline-offset-4 hover:underline">
                    See it on GitHub
                  </a>
                  .
                </p>
              )}
            </div>
            <p className="-mt-4 max-w-[60%] text-xs leading-relaxed text-faint max-sm:mt-3 max-sm:max-w-none">
              The same calendar shown on the public GitHub profile.
            </p>
          </Reveal>

          {/* Profile */}
          <Reveal delay={0.04} className="surface flex min-w-0 flex-col p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <img
                src={`${user.avatar_url}&s=160`}
                alt={`${profile.fullName}’s GitHub avatar`}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="size-16 rounded-2xl border border-line-strong bg-ink-800 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight text-fg">{profile.fullName}</p>
                <p className="truncate font-mono text-sm text-muted">@{user.login}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-faint">
                  <MapPin className="size-3.5" aria-hidden />
                  {profile.location}
                </p>
              </div>
            </div>

            <GitHubStats stats={stats} className="mt-6" />

            <div className="mt-auto pt-5">
              <Button href={user.html_url} className="w-full" size="sm">
                <GitHubIcon className="size-4" />
                View profile on GitHub
              </Button>
            </div>
          </Reveal>

          {/* Languages */}
          <Reveal delay={0.08} className="surface flex min-w-0 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-[0.9375rem] font-medium text-fg">Language mix</h3>
              <p className="font-mono text-xs text-faint">by bytes</p>
            </div>
            <div className="mt-5">
              <LanguageBar languages={languages} />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-faint">
              As detected by GitHub across {ownRepos} original repositories. It counts every file — C is
              inflated by the graphics headers bundled with DarkSiders, HTML and CSS by design exports.
            </p>
          </Reveal>

          {/* Recently pushed */}
          <Reveal delay={0.12} className="surface flex min-w-0 flex-col p-5 sm:p-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-[0.9375rem] font-medium text-fg">Recently pushed</h3>
            <ul className="mt-3 divide-y divide-line">
              {recent.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-3 py-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-fg transition-colors group-hover:text-ember-300">
                        {projectByRepo.get(repo.name)?.name ?? repo.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-3 font-mono text-[0.7rem] text-faint">
                        <LanguageDot language={projectByRepo.get(repo.name)?.primaryLanguage ?? repo.language} />
                        <time dateTime={repo.pushed_at}>{formatActivity(repo.pushed_at)}</time>
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-faint transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

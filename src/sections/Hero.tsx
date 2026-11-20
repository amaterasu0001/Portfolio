import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, FileText, MapPin } from 'lucide-react'
import { Button } from '@/components/Button'
import { ProfilePortrait } from '@/components/ProfilePortrait'
import { SocialLink } from '@/components/SocialLink'
import { Terminal, type TerminalStep } from '@/components/Terminal'
import { featuredProjects, projectByRepo } from '@/data/projects'
import { profile, socials } from '@/data/profile'
import { useGitHub } from '@/hooks/useGitHub'
import { plural, timeAgo } from '@/lib/format'
import type { SocialLink as SocialLinkData } from '@/types'

const ease = [0.16, 1, 0.3, 1] as const
// One entrance on load: a short fade and rise with a small stagger.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
})

export function Hero() {
  const { data, calendar } = useGitHub()

  const latest = useMemo(
    () => [...data.repos].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0],
    [data.repos],
  )
  const latestName = latest ? (projectByRepo.get(latest.name)?.name ?? latest.name) : null

  const steps = useMemo<TerminalStep[]>(
    () => [
      {
        command: 'whoami',
        output: (
          <>
            <p className="text-fg">{profile.fullName}</p>
            <p>
              developer · CSE @ {profile.education.shortName} · {profile.location}
            </p>
          </>
        ),
      },
      {
        command: 'ls projects/ --featured',
        output: (
          <ul className="space-y-0.5">
            {featuredProjects.map((project) => (
              <li key={project.repo} className="grid grid-cols-[7.25rem_1fr] gap-2 xl:grid-cols-[8.5rem_1fr]">
                <span className="text-ember-300">{project.name}/</span>
                <span className="truncate">
                  {project.stackLine ?? project.technologies.slice(0, 3).join(' · ')}
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      {
        command: 'git log -1 --format="%cr"',
        output: latest ? (
          <p>
            <span className="text-ok">●</span> {timeAgo(latest.pushed_at)} — pushed to{' '}
            <span className="text-fg">{latest.name}</span>
          </p>
        ) : (
          <p>no commits found</p>
        ),
      },
    ],
    [latest],
  )

  // GitHub, LinkedIn and (once it is set in profile.ts) email.
  const contactLinks: SocialLinkData[] = [
    ...socials.filter((link) => link.primary),
    ...(profile.email
      ? [{ label: 'Email', href: `mailto:${profile.email}`, handle: profile.email, icon: 'mail' as const, primary: true }]
      : []),
  ]

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center pb-20 pt-28 sm:pt-32 lg:pb-24">
      <div className="container-page relative grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_30rem] xl:gap-16">
        <div className="min-w-0">
          {/*
            Portrait on the left, name and title on the right, vertically centred as a pair.
            The bio and actions run full width underneath: on desktop this column shares the
            row with the terminal, and squeezing the bio beside the photo left it ~400px wide.
            On phones everything stacks and centres.
          */}
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            <motion.div {...rise(0)}>
              <ProfilePortrait className="size-36 sm:size-40 xl:size-42" />
            </motion.div>

            <div className="min-w-0 flex-1">
              <motion.p {...rise(0.05)} className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                <MapPin className="size-4 text-faint" aria-hidden />
                {profile.location}
                <span className="text-faint" aria-hidden>
                  ·
                </span>
                CSE @ {profile.education.shortName}
              </motion.p>

              <motion.h1
                {...rise(0.1)}
                className="mt-4 text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-fg sm:text-5xl xl:text-[3.5rem]"
              >
                {profile.fullName}
              </motion.h1>

              <motion.p {...rise(0.15)} className="mt-4 text-balance text-lg leading-snug text-muted sm:text-xl">
                {profile.title}
              </motion.p>
            </div>
          </div>

          <motion.p
            {...rise(0.2)}
            className="mx-auto mt-8 max-w-xl text-center text-[1.0625rem] leading-relaxed text-muted sm:mx-0 sm:max-w-2xl sm:text-left"
          >
            {profile.intro}
          </motion.p>

          <motion.p
            {...rise(0.2)}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs sm:justify-start"
          >
            <span className="text-faint">Working with</span>
            {profile.stack.map((tech, index) => (
              <span key={tech} className="flex items-center gap-2 text-muted">
                {index > 0 && <span className="text-faint" aria-hidden>·</span>}
                {tech}
              </span>
            ))}
          </motion.p>

          <motion.div
            {...rise(0.25)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
          >
            <Button href="#projects" variant="primary">
              View projects
              <ArrowDown className="size-4 transition-transform duration-200 group-hover/btn:translate-y-0.5" aria-hidden />
            </Button>
            <Button href="#contact">Contact me</Button>
            {/* Rendered only once a real résumé is configured in src/data/profile.ts */}
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="ghost" download>
                <FileText className="size-4" aria-hidden />
                Résumé
              </Button>
            )}
          </motion.div>

          <motion.div
            {...rise(0.3)}
            className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:mt-12 sm:flex-row sm:items-end sm:justify-between"
          >
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-center sm:flex sm:gap-x-8 sm:text-left [&>*:nth-child(3)]:col-span-2">
              <HeroStat label="Public repos" value={String(data.user.public_repos)} />
              {calendar && <HeroStat label="Contributions, last year" value={String(calendar.total)} />}
              {latest && latestName && (
                <HeroStat label="Latest push" value={latestName} hint={timeAgo(latest.pushed_at)} />
              )}
            </dl>
            <ul className="flex items-center justify-center gap-2" aria-label="Profiles">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <SocialLink link={link} />
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="relative min-w-0"
        >
          <Terminal steps={steps} title={`${profile.username} — zsh`} />
          <p className="mt-3 text-right font-mono text-xs text-faint">
            {plural(featuredProjects.length, 'featured project')} · last line comes from the GitHub API
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function HeroStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    // min-w-0 + truncate: a long repository name shortens instead of wrapping the row.
    <div className="flex min-w-0 flex-col">
      <dt className="font-mono text-xs leading-snug text-faint sm:whitespace-nowrap">{label}</dt>
      <dd
        className="mt-auto flex min-w-0 items-baseline justify-center gap-2 pt-2 sm:justify-start"
        title={hint ? `${value} · ${hint}` : value}
      >
        {/* The value shortens first; the hint ("12 minutes ago") always stays readable. */}
        <span className="truncate text-xl font-medium tracking-[-0.01em] text-fg tabular-nums">{value}</span>
        {hint && <span className="shrink-0 whitespace-nowrap text-sm text-faint">{hint}</span>}
      </dd>
    </div>
  )
}

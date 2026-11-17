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
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
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
    <section id="home" className="relative overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28">
      {/* Background: dot grid + one restrained ember glow */}
      <div className="bg-dots pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-48 right-[-12%] h-[38rem] w-[38rem] rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(255 106 61 / 0.16), transparent 62%)' }}
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-14 xl:grid-cols-[minmax(0,1fr)_29rem] xl:gap-12">
        <div className="min-w-0">
          {/*
            Portrait on the left, name and title on the right, vertically centred as a pair.
            The bio and actions run full width underneath: on desktop this column shares the
            row with the terminal, and squeezing the bio beside the photo left it ~400px wide.
            On phones everything stacks and centres.
          */}
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <ProfilePortrait className="size-36 sm:size-40 xl:size-42" />
            </motion.div>

            <div className="min-w-0 flex-1">
              <motion.p
                {...rise(0.06)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1.5 pl-2.5 pr-3.5 font-mono text-xs text-muted"
              >
                <MapPin className="size-3.5 text-ember" aria-hidden />
                {profile.location}
                <span className="text-faint" aria-hidden>
                  ·
                </span>
                CSE @ {profile.education.shortName}
              </motion.p>

              <motion.h1
                {...rise(0.12)}
                className="mt-4 text-[2.625rem] font-semibold leading-none tracking-[-0.035em] text-fg sm:text-5xl xl:text-[3.5rem]"
              >
                {profile.fullName}
              </motion.h1>

              <motion.p
                {...rise(0.18)}
                className="mt-3.5 text-lg font-medium leading-snug tracking-tight text-fg/85 sm:text-xl"
              >
                <span className="text-balance">{profile.title}.</span>
                <span className="accent-serif mt-0.5 block text-[1.12em] text-ember-300">I build things.</span>
              </motion.p>
            </div>
          </div>

          <motion.p
            {...rise(0.24)}
            className="mx-auto mt-8 max-w-xl text-center text-[1.0625rem] leading-relaxed text-muted sm:mx-0 sm:max-w-2xl sm:text-left"
          >
            {profile.intro}
          </motion.p>

          <motion.p
            {...rise(0.3)}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-mono text-xs sm:justify-start"
          >
            <span className="text-faint">Working with</span>
            {profile.stack.map((tech, index) => (
              <span key={tech} className="flex items-center gap-2.5 text-muted">
                {index > 0 && <span className="size-1 rounded-full bg-ember/70" aria-hidden />}
                {tech}
              </span>
            ))}
          </motion.p>

          <motion.div
            {...rise(0.36)}
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
            <span className="mx-1 hidden h-6 w-px bg-line-strong sm:block" aria-hidden />
            <ul className="flex w-full items-center justify-center gap-2 sm:w-auto" aria-label="Profiles">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <SocialLink link={link} />
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.dl
            {...rise(0.44)}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 text-center sm:mt-12 sm:flex sm:gap-x-8 sm:text-left [&>*:nth-child(3)]:col-span-2"
          >
            <HeroStat label="Public repos" value={String(data.user.public_repos)} />
            {calendar && <HeroStat label="Contributions, last year" value={String(calendar.total)} />}
            {latest && latestName && (
              <HeroStat label="Latest push" value={latestName} hint={timeAgo(latest.pushed_at)} />
            )}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative min-w-0"
        >
          <Terminal steps={steps} title={`${profile.username} — zsh`} />
          <p className="mt-3 text-right font-mono text-[0.68rem] text-faint">
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
      <dt className="font-mono text-[0.68rem] uppercase leading-snug tracking-widest text-faint sm:whitespace-nowrap">{label}</dt>
      <dd
        className="mt-auto flex min-w-0 items-baseline justify-center gap-2 pt-1.5 sm:justify-start"
        title={hint ? `${value} · ${hint}` : value}
      >
        {/* The value shortens first; the hint ("12 minutes ago") always stays readable. */}
        <span className="truncate text-xl font-semibold tracking-tight text-fg tabular-nums">{value}</span>
        {hint && <span className="shrink-0 whitespace-nowrap text-sm text-faint">{hint}</span>}
      </dd>
    </div>
  )
}

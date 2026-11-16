import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, FileText, MapPin } from 'lucide-react'
import { GitHubIcon } from '@/components/BrandIcons'
import { Button } from '@/components/Button'
import { Terminal, type TerminalStep } from '@/components/Terminal'
import { featuredProjects, projectByRepo } from '@/data/projects'
import { profile } from '@/data/profile'
import { useGitHub } from '@/hooks/useGitHub'
import { plural, timeAgo } from '@/lib/format'

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

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* Background: dot grid + one restrained ember glow */}
      <div className="bg-dots pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-48 right-[-12%] h-[38rem] w-[38rem] rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(255 106 61 / 0.16), transparent 62%)' }}
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10 xl:grid-cols-[1.08fr_0.92fr] xl:gap-12">
        <div>
          <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1.5 pl-2.5 pr-3.5 font-mono text-xs text-muted">
            <MapPin className="size-3.5 text-ember" aria-hidden />
            {profile.location}
            <span className="text-faint" aria-hidden>·</span>
            CSE @ {profile.education.shortName}
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-fg sm:text-6xl xl:text-[4.25rem]"
          >
            Hi, I’m {profile.firstName}.
            <br />
            <span className="text-muted">I </span>
            <span className="accent-serif text-ember-300">build things</span>
            <span className="text-muted">.</span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="eyebrow mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            {profile.roles.map((role, index) => (
              <span key={role} className="flex items-center gap-3">
                {index > 0 && <span className="size-1 rounded-full bg-ember" aria-hidden />}
                {role}
              </span>
            ))}
          </motion.p>

          <motion.p {...rise(0.22)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.intro}
          </motion.p>

          <motion.div {...rise(0.3)} className="mt-9 flex flex-wrap gap-3">
            <Button href="#projects" variant="primary">
              View projects
              <ArrowDown className="size-4 transition-transform duration-200 group-hover/btn:translate-y-0.5" aria-hidden />
            </Button>
            <Button href={profile.githubUrl}>
              <GitHubIcon className="size-4" />
              GitHub
            </Button>
            <Button href="#contact" variant="ghost">
              Contact me
            </Button>
            {/* Rendered only once a real résumé is configured in src/data/profile.ts */}
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="ghost" download>
                <FileText className="size-4" aria-hidden />
                Résumé
              </Button>
            )}
          </motion.div>

          <motion.dl
            {...rise(0.38)}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7"
          >
            <HeroStat label="Public repositories" value={String(data.user.public_repos)} />
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
          className="relative"
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
    <div>
      <dt className="font-mono text-[0.68rem] uppercase tracking-widest text-faint">{label}</dt>
      <dd className="mt-1.5 text-xl font-semibold tracking-tight text-fg tabular-nums">
        {value}
        {hint && <span className="ml-2 text-sm font-normal text-faint">{hint}</span>}
      </dd>
    </div>
  )
}

import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { profile } from '@/data/profile'
import { useGitHub } from '@/hooks/useGitHub'
import { projectByRepo } from '@/data/projects'
import { formatMonthYear, timeAgo } from '@/lib/format'

export function About() {
  const { data } = useGitHub()
  const latest = [...data.repos].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0]

  const facts: { label: string; value: string }[] = [
    { label: 'Based in', value: profile.location },
    { label: 'Studying', value: `${profile.education.program}, ${profile.education.shortName}` },
    { label: 'On GitHub since', value: formatMonthYear(data.user.created_at) },
    { label: 'Writes', value: 'TypeScript, JavaScript, Python, C/C++' },
    { label: 'Public repos', value: String(data.user.public_repos) },
    ...(latest
      ? [
          {
            label: 'Latest push',
            value: `${projectByRepo.get(latest.name)?.name ?? latest.name} · ${timeAgo(latest.pushed_at)}`,
          },
        ]
      : []),
  ]

  return (
    <section id="about" className="border-t border-line py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <SectionHeading
            index="01"
            eyebrow="About"
            title={
              <>
                From a game in C to a system with a{' '}
                <span className="accent-serif text-ember-300">database policy</span>.
              </>
            }
          />

          <Reveal delay={0.08} className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
            <p>
              I’m a Computer Science &amp; Engineering student at {profile.education.school} in Dhaka. I started
              where most CSE students do — C and C++ — and the first thing I shipped was{' '}
              <span className="text-fg">a three-level 2D action game</span>, drawn sprite by sprite with a thin
              OpenGL wrapper and no engine.
            </p>
            <p>
              Since then every project has moved closer to the web and a layer deeper. Hand-written HTML pages
              turned into <span className="text-fg">a MERN tutoring platform with real-time chat</span>. That
              turned into a Telegram bot that survives restarts, and then into{' '}
              <span className="text-fg">a TypeScript system</span> with a backend-for-frontend, Postgres
              row-level security and a PyTorch inference service behind it.
            </p>
            <p>
              I learn a stack by building something real with it, usually alongside teammates, and I’d rather
              point to a repository than describe one. Everything on this page links to code you can read.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:pt-14">
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <p className="eyebrow text-faint">Fact sheet</p>
              <p className="font-mono text-xs text-faint">verified from GitHub</p>
            </div>
            <dl className="divide-y divide-line">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[8.5rem_1fr] gap-4 px-5 py-3.5 text-sm">
                  <dt className="font-mono text-xs leading-6 text-faint">{fact.label}</dt>
                  <dd className="text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { useState } from 'react'
import {
  Braces,
  Database,
  Layers,
  Plug,
  Server,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SkillBadge } from '@/components/SkillBadge'
import { projectByRepo } from '@/data/projects'
import { selfReported, skillGroups, skills } from '@/data/skills'
import type { Skill, SkillGroup } from '@/types'

const groupIcons: Record<SkillGroup, LucideIcon> = {
  Languages: Braces,
  Frontend: Layers,
  Backend: Server,
  Data: Database,
  'Tools & Infra': Wrench,
  'AI & Integrations': Plug,
}

const DEFAULT_SKILL = skills.find((skill) => skill.name === 'React') ?? skills[0]!

export function Skills({ onOpenProject }: { onOpenProject: (repo: string) => void }) {
  const [selected, setSelected] = useState<Skill>(DEFAULT_SKILL)
  const selectedRepos = new Set(selected.usedIn)

  return (
    <section id="skills" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Tech stack"
            title="Only what the repositories can back up"
            description="Every item below is used in at least one public repo. Select one to see where."
          />
        </div>

        {/* Evidence panel — the "used in projects" relationship */}
        <Reveal delay={0.05} className="mt-10">
          <div
            className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            aria-live="polite"
          >
            <p className="text-sm text-muted">
              <span className="font-mono text-xs text-faint">Used in</span>
              <span className="ml-3 text-lg font-medium text-fg">{selected.name}</span>
            </p>
            <ul className="flex flex-wrap gap-2">
              {selected.usedIn.map((repo) => {
                const project = projectByRepo.get(repo)
                return (
                  <li key={repo}>
                    <button
                      type="button"
                      onClick={() => onOpenProject(repo)}
                      aria-haspopup="dialog"
                      className="inline-flex h-8 items-center rounded-lg border border-line-strong px-3 text-sm text-fg transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.06]"
                    >
                      {project?.name ?? repo}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map(({ group, blurb }, index) => {
            const Icon = groupIcons[group]
            const items = skills.filter((skill) => skill.group === group)
            return (
              <Reveal key={group} delay={0.04 * index} className="surface p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white/[0.04] text-muted">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[0.9375rem] font-medium text-fg">{group}</h3>
                    <p className="text-xs text-faint">{blurb}</p>
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li key={skill.name}>
                      <SkillBadge
                        skill={skill}
                        selected={skill.name === selected.name}
                        related={skill.usedIn.some((repo) => selectedRepos.has(repo))}
                        onSelect={setSelected}
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-5">
          <p className="font-mono text-xs leading-relaxed text-faint">
            The number on each chip is how many repositories use it; chips dim when they share no project
            with your selection. Also listed on my GitHub profile, with no public repo yet:{' '}
            <span className="text-muted">{selfReported.join(', ')}</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

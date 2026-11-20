import { ArrowRight, Flag, GraduationCap, Hammer, Rocket, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Tag } from '@/components/Tag'
import { currentFocus, journey } from '@/data/journey'
import { projectByRepo } from '@/data/projects'
import type { JourneyItem } from '@/types'

const kindIcons: Record<JourneyItem['kind'], LucideIcon> = {
  project: Hammer,
  education: GraduationCap,
  milestone: Flag,
  hackathon: Rocket,
}

export function Journey({ onOpenProject }: { onOpenProject: (repo: string) => void }) {
  return (
    <section id="journey" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Journey"
          title="A timeline written by commit history"
          description="No job titles to list yet, so this is the honest version: what I built and when, with every date taken from the repositories."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          {/* Timeline */}
          <ol className="relative">
            <span className="absolute bottom-2 left-[1.125rem] top-2 w-px bg-line" aria-hidden />
            {journey.map((item, index) => {
              const Icon = kindIcons[item.kind]
              const hasCaseStudy = item.repo !== undefined && projectByRepo.has(item.repo)
              return (
                <Reveal as="li" key={item.title} delay={Math.min(index * 0.04, 0.2)} className="relative pb-12 pl-14 last:pb-0">
                  <span
                    className={`absolute left-0 top-0 inline-flex size-9 items-center justify-center rounded-full border bg-ink-950 ${
                      index === 0 ? 'border-white/30 text-fg' : 'border-line-strong text-muted'
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <p className="font-mono text-xs leading-9 text-faint">
                    {item.date}
                    {index === 0 && <span className="ml-2 text-muted">· latest</span>}
                  </p>
                  <h3 className="text-lg font-medium text-fg">{item.title}</h3>
                  <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{item.body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {item.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    {hasCaseStudy && (
                      <button
                        type="button"
                        onClick={() => onOpenProject(item.repo!)}
                        aria-haspopup="dialog"
                        className="ml-2 inline-flex items-center gap-1 text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-fg"
                      >
                        Read the case study
                        <ArrowRight className="size-4" aria-hidden />
                      </button>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </ol>

          {/* Current focus */}
          <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <span className="size-2 rounded-full bg-ok" aria-hidden />
                <h3 className="text-[0.9375rem] font-medium text-fg">Current focus</h3>
              </div>
              <ul className="divide-y divide-line">
                {currentFocus.map((focus) => (
                  <li key={focus.title} className="px-5 py-4">
                    <p className="text-[0.9375rem] font-medium text-fg">{focus.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{focus.body}</p>
                    <p className="mt-2 font-mono text-xs text-faint">evidence: {focus.evidence}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 font-mono text-xs leading-relaxed text-faint">
              Inferred from the most recent commits and the profile README (“Learning JavaScript and React”).
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

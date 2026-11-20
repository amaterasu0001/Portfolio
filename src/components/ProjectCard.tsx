import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatActivity } from '@/lib/format'
import type { RepoView } from '@/lib/repos'
import { GitHubIcon } from './BrandIcons'
import { Button } from './Button'
import { LanguageDot } from './LanguageDot'
import { Tag } from './Tag'
import { ProjectVisual } from './visuals'

interface ProjectCardProps {
  view: RepoView
  index: number
  /** Put the visual on the right instead of the left (desktop only) */
  flip?: boolean
  onOpen: (repo: string) => void
}

const MAX_TAGS = 7

/** Large featured-project card: visual on one side, the case in brief on the other. */
export function ProjectCard({ view, index, flip, onOpen }: ProjectCardProps) {
  const project = view.project
  if (!project) return null

  const extraTags = project.technologies.length - MAX_TAGS

  return (
    // Nested radius: 20px card − 8px padding = 12px visual corner.
    <article className="surface rounded-[1.25rem] p-2">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Visual */}
        <div className={cn('min-w-0', flip && 'lg:order-2')}>
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              loading="lazy"
              decoding="async"
              className="h-full min-h-[19rem] w-full rounded-xl border border-line object-cover"
            />
          ) : (
            project.visual && <ProjectVisual visual={project.visual} />
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col px-4 pb-4 sm:px-6 lg:py-6 lg:pl-2 lg:pr-8">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-faint">
            <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            {project.context && (
              <>
                <span aria-hidden>·</span>
                <span className="text-muted">{project.context}</span>
              </>
            )}
          </p>

          <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-fg sm:text-[1.75rem]">{project.name}</h3>
          <p className="mt-2 text-base leading-relaxed text-muted">{project.description}</p>

          {project.problem && (
            <p className="mt-4 border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-muted">
              <span className="font-medium text-fg">Why: </span>
              {project.problem}
            </p>
          )}

          <ul className="mt-5 space-y-2">
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-fg/90">
                <Check className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.slice(0, MAX_TAGS).map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
            {extraTags > 0 && (
              <li>
                <Tag className="text-faint">+{extraTags}</Tag>
              </li>
            )}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-faint">
            <LanguageDot language={view.language} />
            <span>last push: <span className="text-muted">{formatActivity(view.pushedAt)}</span></span>
            {project.facts?.slice(0, 2).map((fact) => (
              <span key={fact.label}>
                {fact.label.toLowerCase()}: <span className="text-muted">{fact.value}</span>
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5 lg:mt-auto lg:pt-6">
            <Button variant="primary" size="sm" onClick={() => onOpen(view.repo)} aria-haspopup="dialog">
              Case study
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            <Button href={view.url} size="sm" aria-label={`${project.name} on GitHub`}>
              <GitHubIcon className="size-4" />
              Code
            </Button>
            {view.liveUrl && (
              <Button href={view.liveUrl} size="sm">
                <ExternalLink className="size-4" aria-hidden />
                Live demo
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

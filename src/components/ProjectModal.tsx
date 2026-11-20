import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ExternalLink, Info, Users, X } from 'lucide-react'
import { formatDate, formatMonthYear } from '@/lib/format'
import type { RepoView } from '@/lib/repos'
import { GitHubIcon } from './BrandIcons'
import { Button } from './Button'
import { LanguageDot } from './LanguageDot'
import { Tag } from './Tag'
import { ProjectVisual } from './visuals'

interface ProjectModalProps {
  /** The project to show, or null when closed */
  view: RepoView | null
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Case-study dialog: focus-trapped, Esc / backdrop to close, scroll-locked page behind it. */
export function ProjectModal({ view, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {view?.project && <Dialog key={view.repo} view={view} onClose={onClose} />}
    </AnimatePresence>
  )
}

function Dialog({ view, onClose }: { view: RepoView; onClose: () => void }) {
  const project = view.project!
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock page scroll, move focus in, and give it back on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      previouslyFocused?.focus?.()
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (focusable.length === 0) return
    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const titleId = `project-title-${view.repo}`

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[1.25rem] border border-line-strong bg-ink-900 shadow-[0_32px_80px_-24px_rgb(0_0_0/0.9)] sm:max-h-[88dvh] sm:rounded-[1.25rem]"
        initial={{ y: 32, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-8">
          <p className="eyebrow flex min-w-0 items-center gap-2 text-faint">
            <span className="text-muted">Case study</span>
            <span aria-hidden>/</span>
            <span className="truncate">{view.repo}</span>
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-control border border-line text-muted transition-colors hover:border-white/25 hover:text-fg"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8 sm:pt-8">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-faint">
            <span>{project.category}</span>
            {project.context && (
              <>
                <span aria-hidden>·</span>
                <span className="text-muted">{project.context}</span>
              </>
            )}
          </p>

          <h2 id={titleId} className="mt-3 text-3xl font-medium tracking-[-0.02em] text-fg sm:text-4xl">
            {project.name}
          </h2>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">{project.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={view.url} variant="primary" size="sm">
              <GitHubIcon className="size-4" />
              View repository
            </Button>
            {view.liveUrl && (
              <Button href={view.liveUrl} size="sm">
                <ExternalLink className="size-4" aria-hidden />
                Live demo
              </Button>
            )}
          </div>

          {/* Meta strip */}
          {/* Cells flex to fill each row, so any number of facts tiles cleanly. */}
          <dl className="mt-8 flex flex-wrap gap-px overflow-hidden rounded-xl border border-line bg-line">
            <Meta label="Language">
              <LanguageDot language={view.language} />
            </Meta>
            <Meta label="Last push">
              <time dateTime={view.pushedAt}>{formatDate(view.pushedAt)}</time>
            </Meta>
            {view.createdAt && <Meta label="Created">{formatMonthYear(view.createdAt)}</Meta>}
            {view.stars > 0 && <Meta label="Stars">{view.stars}</Meta>}
            {project.facts?.map((fact) => (
              <Meta key={fact.label} label={fact.label}>
                {fact.value}
              </Meta>
            ))}
          </dl>

          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              loading="lazy"
              decoding="async"
              className="mt-8 w-full rounded-xl border border-line"
            />
          ) : (
            project.visual && (
              <div className="mt-8">
                <ProjectVisual visual={project.visual} />
              </div>
            )
          )}

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Block title="Overview" className="md:col-span-2">
              <p>{project.description}</p>
            </Block>
            {project.problem && (
              <Block title="The problem">
                <p>{project.problem}</p>
              </Block>
            )}
            {project.solution && (
              <Block title="How it works">
                <p>{project.solution}</p>
              </Block>
            )}
          </div>

          {project.features.length > 0 && (
            <Block title="Features" className="mt-8">
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-fg/90">
                    <Check className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {project.technicalDetails && project.technicalDetails.length > 0 && (
            <Block title="Technical details" className="mt-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.technicalDetails.map((detail) => (
                  <div key={detail.title} className="rounded-xl border border-line bg-white/[0.02] p-4">
                    <h4 className="text-sm font-medium text-fg">{detail.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{detail.body}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          <Block title="Stack" className="mt-8">
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Tag className="px-2 py-1.5 text-xs">{tech}</Tag>
                </li>
              ))}
            </ul>
          </Block>

          {(project.team || project.status) && (
            <div className="mt-8 space-y-3">
              {project.team && (
                <Note icon={<Users className="size-4" aria-hidden />} label="Team">
                  {project.team}
                </Note>
              )}
              {project.status && (
                <Note icon={<Info className="size-4" aria-hidden />} label="Status">
                  {project.status}
                </Note>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-[8.5rem] flex-1 bg-ink-900 px-4 py-3 sm:min-w-[10.5rem]">
      <dt className="font-mono text-xs text-faint">{label}</dt>
      <dd className="mt-1 text-sm text-fg">{children}</dd>
    </div>
  )
}

function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h3 className="text-sm font-medium text-fg">{title}</h3>
      <div className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{children}</div>
    </section>
  )
}

function Note({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <p className="flex gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-faint">{icon}</span>
      <span>
        <span className="font-medium text-fg">{label} · </span>
        {children}
      </span>
    </p>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface VisualFrameProps {
  /** What the drawing is and where its content comes from — these are diagrams, not screenshots. */
  caption: string
  children: ReactNode
  className?: string
}

/** Shared canvas for the code-drawn project visuals. */
export function VisualFrame({ caption, children, className }: VisualFrameProps) {
  return (
    <figure
      className={cn(
        'relative flex h-full min-h-[19rem] min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-ink-950',
        className,
      )}
    >
      <div className="relative flex min-w-0 flex-1 items-center justify-center p-3 sm:p-6">{children}</div>
      <figcaption className="relative border-t border-line px-4 py-3 font-mono text-xs text-faint">
        {caption}
      </figcaption>
    </figure>
  )
}

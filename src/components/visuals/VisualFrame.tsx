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
        'relative flex h-full min-h-[19rem] min-w-0 flex-col overflow-hidden rounded-[0.875rem] border border-line bg-ink-950',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 85%)',
        }}
        aria-hidden
      />
      <div className="relative flex min-w-0 flex-1 items-center justify-center p-3 sm:p-6">{children}</div>
      <figcaption className="relative border-t border-line px-4 py-2.5 font-mono text-[0.68rem] tracking-wide text-faint">
        {caption}
      </figcaption>
    </figure>
  )
}

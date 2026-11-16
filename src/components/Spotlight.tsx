import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SpotlightProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}

/**
 * Card wrapper with a soft ember glow that follows the pointer.
 * Pure CSS custom properties — no re-renders on mouse move.
 */
export function Spotlight({ children, className, as: Component = 'div' }: SpotlightProps) {
  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <Component
      onMouseMove={onMove}
      className={cn(
        'surface group/spot relative isolate overflow-hidden transition-[border-color] duration-300 hover:border-white/[0.16]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(255 106 61 / 0.09), transparent 65%)',
        }}
        aria-hidden
      />
      {children}
    </Component>
  )
}

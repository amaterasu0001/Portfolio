import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Small technology / metadata chip. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[0.72rem] leading-none text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

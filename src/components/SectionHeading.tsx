import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  /** Short section name, shown as a terminal prompt above the title, e.g. "❯ about" */
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <SectionPrompt label={eyebrow} />
      <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em] text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </Reveal>
  )
}

/** The site's signature: an ember prompt, the same one the hero terminal uses. */
export function SectionPrompt({ label }: { label: string }) {
  return (
    <p className="font-mono text-sm text-muted">
      <span className="mr-2 select-none text-ember" aria-hidden>
        ❯
      </span>
      {label.toLowerCase()}
    </p>
  )
}

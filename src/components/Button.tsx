import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_8px_24px_-12px_rgb(255_106_61/0.55)]',
  secondary:
    'border border-line-strong bg-white/[0.03] text-fg hover:border-white/30 hover:bg-white/[0.07]',
  ghost: 'text-muted hover:text-fg hover:bg-white/[0.05]',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  sm: 'h-9 px-3.5 text-sm',
}

const baseClass =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

interface Common {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonProps = Common &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
  )

/** Renders an <a> when `href` is given (external links open in a new tab), otherwise a <button>. */
export function Button({ variant = 'secondary', size = 'md', className, children, ...rest }: ButtonProps) {
  const classes = cn(baseClass, variants[variant], sizes[size], className)

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...anchor}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

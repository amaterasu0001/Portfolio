import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { SocialLink as SocialLinkData } from '@/types'
import { SocialIcon } from './BrandIcons'

interface SocialLinkProps {
  link: SocialLinkData
  /** `card` shows label + handle; `icon` is a compact round button */
  variant?: 'card' | 'icon'
  className?: string
}

export function SocialLink({ link, variant = 'icon', className }: SocialLinkProps) {
  const external = link.href.startsWith('http')
  const linkProps = external ? { target: '_blank', rel: 'noreferrer noopener' } : {}

  if (variant === 'icon') {
    return (
      <a
        href={link.href}
        aria-label={`${link.label} — ${link.handle}`}
        title={link.label}
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-control border border-line text-muted transition-colors duration-150 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg',
          className,
        )}
        {...linkProps}
      >
        <SocialIcon icon={link.icon} className="size-4" />
      </a>
    )
  }

  return (
    <a
      href={link.href}
      className={cn(
        'surface group flex items-center gap-4 p-4 transition-colors duration-150 hover:border-white/20 hover:bg-ink-850',
        className,
      )}
      {...linkProps}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white/[0.04] text-fg">
        <SocialIcon icon={link.icon} className="size-4" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium text-fg">{link.label}</span>
        <span className="block truncate font-mono text-xs text-faint">{link.handle}</span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-faint transition-colors duration-150 group-hover:text-fg"
        aria-hidden
      />
    </a>
  )
}

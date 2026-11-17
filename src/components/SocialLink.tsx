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
          'inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.06] hover:text-fg',
          className,
        )}
        {...linkProps}
      >
        <SocialIcon icon={link.icon} className="size-[1.05rem]" />
      </a>
    )
  }

  return (
    <a
      href={link.href}
      className={cn(
        'surface group flex items-center gap-4 p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/20',
        className,
      )}
      {...linkProps}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.04] text-fg">
        <SocialIcon icon={link.icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium text-fg">{link.label}</span>
        <span className="block truncate font-mono text-xs text-faint">{link.handle}</span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-faint transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember"
        aria-hidden
      />
    </a>
  )
}

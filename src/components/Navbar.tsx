import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navLinks, profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { GitHubIcon } from './BrandIcons'
import { Monogram } from './Monogram'

const sectionIds = navLinks.map((link) => link.id)

export function Navbar() {
  const scrolled = useScrolled()
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close the mobile menu on Escape, and when the viewport grows past the breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onChange = () => desktop.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <div
        className={cn(
          'border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled || open ? 'glass border-line' : 'border-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'container-page flex items-center justify-between transition-[height] duration-300',
            scrolled ? 'h-14' : 'h-[4.5rem]',
          )}
        >
          <a
            href="#home"
            onClick={close}
            className="group flex items-center gap-3"
            aria-label={`${profile.fullName} — home`}
          >
            <Monogram className="transition-transform duration-300 group-hover:-rotate-6" />
            <span className="text-[0.9375rem] font-medium tracking-tight text-fg">
              {profile.fullName}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200',
                      isActive ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-line bg-white/[0.06]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden h-9 items-center gap-2 rounded-full border border-line-strong px-3.5 text-sm text-fg transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.06] sm:inline-flex"
            >
              <GitHubIcon className="size-4" />
              <span className="font-mono text-xs">{profile.username}</span>
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>

        {/*
          Mobile menu.

          The open/close animation is plain CSS (grid rows 0fr ↔ 1fr), on purpose.
          Animating `height: auto` with Motion makes the library measure the element and
          then call `window.scrollTo()` to restore the scroll position. That cancelled the
          smooth scroll started by the very tap that closes this menu: the links updated
          the URL hash but the page never moved.

          `invisible` keeps the closed menu out of the tab order and the accessibility tree.
        */}
        <div
          id="mobile-menu"
          className={cn(
            'grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out-expo lg:hidden',
            open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <ul className="container-page grid gap-1 pb-5 pt-1">
              {navLinks.map((link, index) => (
                <li key={link.id}>
                  {/* A real anchor: the browser does the hash update and the smooth scroll. */}
                  <a
                    href={`#${link.id}`}
                    onClick={close}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-3 text-base transition-colors',
                      active === link.id ? 'bg-white/[0.06] text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {link.label}
                    <span className="font-mono text-xs text-faint">0{index + 1}</span>
                  </a>
                </li>
              ))}
              <li className="mt-2 sm:hidden">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={close}
                  className="flex items-center gap-2 rounded-xl border border-line px-3 py-3 text-sm text-fg"
                >
                  <GitHubIcon className="size-4" />
                  <span className="font-mono">{profile.username}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

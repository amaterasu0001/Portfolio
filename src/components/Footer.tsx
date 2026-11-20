import { navLinks, profile, socials } from '@/data/profile'
import { Monogram } from './Monogram'
import { SocialLink } from './SocialLink'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_auto]">
        <div>
          <a href="#home" className="inline-flex items-center gap-3" aria-label="Back to top">
            <Monogram />
            <span className="text-[0.9375rem] font-medium text-fg">{profile.fullName}</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Developer and CSE student in {profile.location}. I learn a stack by shipping something with it.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-medium text-fg">Navigate</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-medium text-fg">Elsewhere</p>
          <ul className="mt-4 flex gap-2">
            {socials.map((link) => (
              <li key={link.label}>
                <SocialLink link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.fullName}
          </p>
          <p>Built with React, TypeScript &amp; Tailwind · data from the GitHub API</p>
        </div>
      </div>
    </footer>
  )
}

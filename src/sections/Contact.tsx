import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/BrandIcons'
import { Button } from '@/components/Button'
import { Reveal } from '@/components/Reveal'
import { SocialLink } from '@/components/SocialLink'
import { profile, socials } from '@/data/profile'

export function Contact() {
  const linkedIn = socials.find((link) => link.icon === 'linkedin')

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-22rem] mx-auto h-[36rem] w-[min(60rem,100%)] rounded-full opacity-80 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(255 106 61 / 0.13), transparent 65%)' }}
        aria-hidden
      />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow flex items-center justify-center gap-3 text-faint">
            <span className="text-ember">07</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Contact
          </p>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl md:text-6xl md:leading-[1.05]">
            Let’s build something <span className="accent-serif text-ember-300">meaningful</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            An opportunity, a project idea, a hackathon team or a question about anything on this page — message me
            and I’ll get back to you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {/* The email button appears once `email` is set in src/data/profile.ts */}
            {profile.email && (
              <Button href={`mailto:${profile.email}`} variant="primary">
                <Mail className="size-4" aria-hidden />
                {profile.email}
              </Button>
            )}
            {linkedIn && (
              <Button href={linkedIn.href} variant={profile.email ? 'secondary' : 'primary'}>
                <LinkedInIcon className="size-4" />
                Message me on LinkedIn
              </Button>
            )}
            <Button href={profile.githubUrl}>
              <GitHubIcon className="size-4" />
              Follow on GitHub
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-2">
          {socials.map((link) => (
            <SocialLink key={link.label} link={link} variant="card" />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

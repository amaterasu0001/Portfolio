import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/BrandIcons'
import { Button } from '@/components/Button'
import { Reveal } from '@/components/Reveal'
import { SectionPrompt } from '@/components/SectionHeading'
import { SocialLink } from '@/components/SocialLink'
import { profile, socials } from '@/data/profile'

export function Contact() {
  const linkedIn = socials.find((link) => link.icon === 'linkedin')

  return (
    <section id="contact" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionPrompt label="Contact" />
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl md:leading-[1.1]">
            Have a role, a project or a hackathon team in mind?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Send me a message about it, or about anything else on this page, and I’ll get back to you.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
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

        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          {socials.map((link) => (
            <SocialLink key={link.label} link={link} variant="card" />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

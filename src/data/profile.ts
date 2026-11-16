import type { SocialLink } from '@/types'

/**
 * Single source of truth for identity and contact details.
 * Everything here was taken from the public GitHub profile and repositories;
 * fields marked TODO are things only Mahir can supply.
 */
export const profile = {
  firstName: 'Mahir',
  /** Full name as written on the DarkSiders project slides and the LinkedIn profile. */
  fullName: 'Mahir Faisal',
  username: 'amaterasu0001',
  roles: ['Developer', 'CSE Student', 'Builder'],
  location: 'Dhaka, Bangladesh',
  githubUrl: 'https://github.com/amaterasu0001',

  /**
   * Verified from the course repositories: CSE 3100 (fork of the AUST course repo)
   * and CSE 2200 (LearnSphere README).
   */
  education: {
    school: 'Ahsanullah University of Science and Technology',
    shortName: 'AUST',
    program: 'Computer Science & Engineering',
  },

  headline:
    'I build full-stack web apps, bots and games — and I learn each stack by shipping something with it.',
  intro:
    'CSE student in Dhaka. My repositories run from a 2D action game in C/C++ to a MERN tutoring platform with real-time chat, a Telegram reminder bot, and A.V.I.A. — a crew-health monitoring system built for NASA Space Apps 2026.',

  /** TODO: add a public contact email, e.g. 'you@example.com'. The Email button appears automatically. */
  email: null as string | null,

  /**
   * TODO: drop your résumé at public/resume.pdf and set this to './resume.pdf'.
   * The "Résumé" button in the hero only renders when this is set.
   */
  resumeUrl: null as string | null,

  /** Canonical site URL once deployed (used for absolute Open Graph URLs). TODO after deploying. */
  siteUrl: null as string | null,
} as const

/** GitHub, Facebook and Instagram are listed on the public GitHub profile; the LinkedIn URL was supplied by Mahir. */
export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/amaterasu0001',
    handle: '@amaterasu0001',
    icon: 'github',
    primary: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mahirfaisal0001/',
    handle: 'in/mahirfaisal0001',
    icon: 'linkedin',
    primary: true,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/MadaraUchiha00001',
    handle: 'MadaraUchiha00001',
    icon: 'facebook',
    primary: false,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/madaraa_uchihaaa__/',
    handle: '@madaraa_uchihaaa__',
    icon: 'instagram',
    primary: false,
  },
]

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
] as const

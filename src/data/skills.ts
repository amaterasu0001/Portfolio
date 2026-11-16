import type { Skill, SkillGroup } from '@/types'

/**
 * Only technologies that appear in the public repositories are listed, and each
 * one names the repositories that prove it (`usedIn` holds repo names).
 */
export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', group: 'Languages', usedIn: ['Nasa_App'] },
  { name: 'JavaScript', group: 'Languages', usedIn: ['LearnSphere', 'cse-3100'] },
  { name: 'Python', group: 'Languages', usedIn: ['MemoryMateBot', 'Nasa_App'] },
  { name: 'C / C++', group: 'Languages', usedIn: ['DarkSiders'] },
  { name: 'Dart', group: 'Languages', usedIn: ['ShoeSphere'] },
  { name: 'SQL', group: 'Languages', usedIn: ['Nasa_App', 'MemoryMateBot'] },
  {
    name: 'HTML & CSS',
    group: 'Languages',
    usedIn: ['web-project-1', 'web-project-2', 'LearnSphere', 'cse-3100'],
  },

  // Frontend
  { name: 'React', group: 'Frontend', usedIn: ['Nasa_App', 'LearnSphere', 'cse-3100'] },
  { name: 'Vite', group: 'Frontend', usedIn: ['Nasa_App', 'LearnSphere', 'cse-3100'] },
  { name: 'React Router', group: 'Frontend', usedIn: ['LearnSphere', 'cse-3100'] },
  { name: 'Bootstrap', group: 'Frontend', usedIn: ['LearnSphere', 'cse-3100'] },
  { name: 'React Three Fiber', group: 'Frontend', usedIn: ['Nasa_App'] },
  { name: 'Flutter', group: 'Frontend', usedIn: ['ShoeSphere'] },

  // Backend
  { name: 'Node.js', group: 'Backend', usedIn: ['Nasa_App', 'LearnSphere'] },
  { name: 'Express', group: 'Backend', usedIn: ['LearnSphere'] },
  { name: 'Fastify', group: 'Backend', usedIn: ['Nasa_App'] },
  { name: 'Socket.IO', group: 'Backend', usedIn: ['LearnSphere'] },
  { name: 'JWT auth', group: 'Backend', usedIn: ['LearnSphere'] },
  { name: 'FastAPI', group: 'Backend', usedIn: ['Nasa_App'] },
  { name: 'Flask', group: 'Backend', usedIn: ['MemoryMateBot'] },

  // Data
  { name: 'MongoDB', group: 'Data', usedIn: ['LearnSphere'] },
  { name: 'PostgreSQL', group: 'Data', usedIn: ['Nasa_App'] },
  { name: 'Redis', group: 'Data', usedIn: ['Nasa_App'] },
  { name: 'SQLite', group: 'Data', usedIn: ['MemoryMateBot'] },

  // Tools & infra
  {
    name: 'Git & GitHub',
    group: 'Tools & Infra',
    usedIn: ['LearnSphere', 'cse-3100', 'ShoeSphere', 'Nasa_App'],
  },
  { name: 'Docker Compose', group: 'Tools & Infra', usedIn: ['Nasa_App'] },
  { name: 'Nginx', group: 'Tools & Infra', usedIn: ['Nasa_App'] },
  { name: 'Visual Studio', group: 'Tools & Infra', usedIn: ['DarkSiders'] },
  { name: 'OpenGL / GLUT', group: 'Tools & Infra', usedIn: ['DarkSiders'] },

  // AI & integrations
  { name: 'Telegram Bot API', group: 'AI & Integrations', usedIn: ['MemoryMateBot'] },
  { name: 'OpenRouter (LLM)', group: 'AI & Integrations', usedIn: ['MemoryMateBot'] },
  { name: 'PyTorch inference', group: 'AI & Integrations', usedIn: ['Nasa_App'] },
  { name: 'Nodemailer', group: 'AI & Integrations', usedIn: ['LearnSphere'] },
  { name: 'REST APIs', group: 'AI & Integrations', usedIn: ['cse-3100', 'LearnSphere', 'Nasa_App'] },
]

export const skillGroups: { group: SkillGroup; blurb: string }[] = [
  { group: 'Languages', blurb: 'What the repositories are written in' },
  { group: 'Frontend', blurb: 'Interfaces for web and mobile' },
  { group: 'Backend', blurb: 'APIs, auth and real-time' },
  { group: 'Data', blurb: 'Where state lives' },
  { group: 'Tools & Infra', blurb: 'Shipping and collaboration' },
  { group: 'AI & Integrations', blurb: 'Third-party services and models' },
]

/**
 * Listed on the GitHub profile README but not yet backed by a public repository.
 * Shown separately so the skills grid stays evidence-only.
 */
export const selfReported = ['Java']

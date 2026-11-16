import type { JourneyItem } from '@/types'

/**
 * Every date below comes from commit history in the public repositories.
 * Newest first. Add hackathon results, certifications or jobs here as they happen.
 */
export const journey: JourneyItem[] = [
  {
    date: 'Nov 2026',
    title: 'A.V.I.A. for NASA Space Apps 2026',
    body: 'A crew-health monitoring system: two React clients, a Fastify BFF and core API, PostgreSQL with row-level security, Redis and a PyTorch inference service, all in one Docker Compose stack.',
    kind: 'hackathon',
    repo: 'Nasa_App',
    tags: ['TypeScript', 'Fastify', 'PostgreSQL', 'Docker'],
  },
  {
    date: 'Jun – Jul 2025',
    title: 'CSE 3100 — Web Application Development with DevOps',
    body: 'Coursework at AUST. Built a React character explorer with URL-synced search, filtering and pagination, shipped through eleven pull requests.',
    kind: 'education',
    repo: 'cse-3100',
    tags: ['React', 'Pull requests'],
  },
  {
    date: 'Jun 2025',
    title: 'MemoryMateBot',
    body: 'My first public Python repository: a Telegram bot with persistent, restart-safe reminders and an LLM chat mode.',
    kind: 'project',
    repo: 'MemoryMateBot',
    tags: ['Python', 'SQLite', 'LLM API'],
  },
  {
    date: 'Jan – Mar 2025',
    title: 'LearnSphere',
    body: 'My first full-stack repository — a MERN tutoring platform with JWT auth, email-code password reset and Socket.IO chat. 61 commits with two teammates for Software Development Lab-3.',
    kind: 'project',
    repo: 'LearnSphere',
    tags: ['React', 'Express', 'MongoDB', 'Socket.IO'],
  },
  {
    date: 'Dec 2024',
    title: 'Picked a direction: the web',
    body: 'Set up my GitHub profile README and named the focus: JavaScript and React.',
    kind: 'milestone',
  },
  {
    date: 'Sep 2024',
    title: 'DarkSiders and first web pages',
    body: 'Published a three-level 2D action game in C/C++ built with two teammates, alongside my first hand-written HTML and CSS pages.',
    kind: 'project',
    repo: 'DarkSiders',
    tags: ['C / C++', 'HTML', 'CSS'],
  },
  {
    date: 'May 2024',
    title: 'ShoeSphere — first shared repository',
    body: 'Started a Flutter storefront with a teammate — my first public repository built through a feature branch and pull requests.',
    kind: 'project',
    repo: 'ShoeSphere',
    tags: ['Flutter', 'Dart', 'Git'],
  },
]

/** What recent commits and the profile README point to. */
export const currentFocus = [
  {
    title: 'TypeScript across the stack',
    body: 'The latest repository is TypeScript end-to-end — React clients, a Fastify BFF and a Fastify core API.',
    evidence: 'Nasa_App',
  },
  {
    title: 'React, beyond the basics',
    body: 'From Bootstrap pages to polling hooks, feature-sliced views and a 3D digital twin in React Three Fiber.',
    evidence: 'Nasa_App · LearnSphere',
  },
  {
    title: 'Backend architecture',
    body: 'Backend-for-frontend, Redis caching, Postgres row-level security and one-command Docker environments.',
    evidence: 'Nasa_App',
  },
  {
    title: 'Putting models behind APIs',
    body: 'Calling LLMs from a bot, and wiring a PyTorch inference service into a transactional ingest path.',
    evidence: 'MemoryMateBot · Nasa_App',
  },
]

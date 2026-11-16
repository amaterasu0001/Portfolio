/* ---------- GitHub ---------- */

export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  twitter_username: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
  archived: boolean
  topics: string[]
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
}

export interface ContributionDay {
  date: string
  count: number
  /** 0–4, GitHub's own intensity bucket */
  level: number
}

export interface ContributionCalendar {
  total: number
  days: ContributionDay[]
}

/** language name → bytes, keyed by repository name */
export type RepoLanguages = Record<string, Record<string, number>>

export interface GitHubSnapshot {
  generatedAt: string
  user: GitHubUser
  repos: GitHubRepo[]
  languages: RepoLanguages
  contributions: ContributionCalendar | null
}

export type DataSource = 'live' | 'cache' | 'snapshot'
export type FallbackReason = 'rate-limited' | 'offline' | 'error'

export interface GitHubData {
  user: GitHubUser
  repos: GitHubRepo[]
  source: DataSource
  /** ISO time the data was fetched (or the snapshot generated) */
  fetchedAt: string
  /** Set when live data could not be loaded */
  reason?: FallbackReason
}

/* ---------- Portfolio content ---------- */

export type ProjectTier = 1 | 2 | 3

export type ProjectCategory =
  | 'Full-stack'
  | 'Web'
  | 'Mobile'
  | 'Game'
  | 'Bot'
  | 'Coursework'
  | 'Profile'

export type VisualKey = 'avia' | 'learnsphere' | 'memorymate' | 'darksiders'

export interface ProjectFact {
  label: string
  value: string
}

export interface TechnicalDetail {
  title: string
  body: string
}

export interface Project {
  /** Repository name on GitHub — the join key with live API data */
  repo: string
  /** Display name */
  name: string
  tagline: string
  description: string
  /** Why it exists */
  problem?: string
  /** How it works */
  solution?: string
  features: string[]
  technologies: string[]
  /** Three-item stack summary for compact listings (falls back to the first technologies) */
  stackLine?: string
  /** Short tags used by the explorer's technology filter */
  filterTags: string[]
  /** What the project is actually written in (GitHub's detector can be skewed by vendored or generated code) */
  primaryLanguage: string
  category: ProjectCategory
  tier: ProjectTier
  featured: boolean
  githubUrl: string
  liveUrl?: string
  /** Path to a real screenshot in /public — none of the repos ship one yet */
  image?: string
  /** Code-drawn diagram used when there is no screenshot */
  visual?: VisualKey
  context?: string
  team?: string
  facts?: ProjectFact[]
  technicalDetails?: TechnicalDetail[]
  /** Honest status / limitations */
  status?: string
  /** Fallback last-activity date if the API is unavailable (YYYY-MM-DD) */
  lastActivity: string
}

export type SkillGroup =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Data'
  | 'Tools & Infra'
  | 'AI & Integrations'

export interface Skill {
  name: string
  group: SkillGroup
  /** Repository names where this technology is actually used */
  usedIn: string[]
}

export interface JourneyItem {
  date: string
  title: string
  body: string
  kind: 'project' | 'education' | 'milestone' | 'hackathon'
  repo?: string
  tags?: string[]
}

export interface SocialLink {
  label: string
  href: string
  handle: string
  icon: 'github' | 'linkedin' | 'facebook' | 'instagram' | 'mail'
  primary: boolean
}

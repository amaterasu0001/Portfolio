import { projectByRepo } from '@/data/projects'
import type { GitHubRepo, Project, ProjectCategory } from '@/types'

/** A repository as the UI shows it: live GitHub metadata merged with curated content. */
export interface RepoView {
  repo: string
  name: string
  description: string
  language: string | null
  tags: string[]
  category: ProjectCategory | 'Other'
  tier: 1 | 2 | 3
  url: string
  liveUrl: string | null
  stars: number
  forks: number
  isFork: boolean
  pushedAt: string
  createdAt: string | null
  /** Curated case-study content, when it exists */
  project: Project | null
}

function fromRepo(repo: GitHubRepo): RepoView {
  const project = projectByRepo.get(repo.name) ?? null
  return {
    repo: repo.name,
    name: project?.name ?? repo.name,
    description: project?.tagline ?? repo.description ?? 'No description yet.',
    language: project?.primaryLanguage ?? repo.language,
    tags: project?.filterTags ?? (repo.language ? [repo.language] : []),
    category: project?.category ?? 'Other',
    tier: project?.tier ?? 3,
    url: project?.githubUrl ?? repo.html_url,
    liveUrl: project?.liveUrl ?? repo.homepage ?? null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isFork: repo.fork,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    project,
  }
}

/**
 * Every public repository, curated or not. Repositories pushed after this site
 * was built show up automatically with their GitHub description and language.
 */
export function buildRepoViews(repos: GitHubRepo[]): RepoView[] {
  return repos.map(fromRepo)
}

/** View for a curated project, using live metadata when the API returned that repo. */
export function viewForProject(project: Project, repos: GitHubRepo[]): RepoView {
  const live = repos.find((repo) => repo.name === project.repo)
  if (live) return fromRepo(live)
  return {
    repo: project.repo,
    name: project.name,
    description: project.tagline,
    language: project.primaryLanguage,
    tags: project.filterTags,
    category: project.category,
    tier: project.tier,
    url: project.githubUrl,
    liveUrl: project.liveUrl ?? null,
    stars: 0,
    forks: 0,
    isFork: false,
    pushedAt: project.lastActivity,
    createdAt: null,
    project,
  }
}

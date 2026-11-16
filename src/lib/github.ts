/**
 * GitHub data layer — the only module that talks to the network.
 *
 * Strategy (no token is ever used or shipped):
 *   1. Fresh localStorage cache  → use it, zero requests.
 *   2. Live public API           → 2 requests per visit (user + repos), then cached.
 *   3. On rate limit / offline   → stale cache if there is one, otherwise the
 *                                  snapshot committed in src/data/github-snapshot.json.
 *
 * The site therefore renders fully even when api.github.com is unreachable.
 */
import snapshotJson from '@/data/github-snapshot.json'
import { profile } from '@/data/profile'
import type {
  ContributionCalendar,
  FallbackReason,
  GitHubData,
  GitHubRepo,
  GitHubSnapshot,
  GitHubUser,
} from '@/types'

export const snapshot = snapshotJson as GitHubSnapshot

const API = 'https://api.github.com'
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4'
const USERNAME = profile.username

const DATA_KEY = `gh:${USERNAME}:data:v1`
const CALENDAR_KEY = `gh:${USERNAME}:calendar:v1`
const DATA_TTL = 30 * 60 * 1000 // 30 minutes
const CALENDAR_TTL = 6 * 60 * 60 * 1000 // 6 hours
const TIMEOUT = 8000

/* ---------- errors ---------- */

class GitHubApiError extends Error {
  readonly reason: FallbackReason
  constructor(reason: FallbackReason, message: string) {
    super(message)
    this.name = 'GitHubApiError'
    this.reason = reason
  }
}

const reasonOf = (error: unknown): FallbackReason =>
  error instanceof GitHubApiError ? error.reason : 'error'

/* ---------- cache ---------- */

interface CacheEntry<T> {
  savedAt: number
  value: T
}

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null
  } catch {
    return null // storage blocked or corrupted — behave as a cache miss
  }
}

function writeCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value } satisfies CacheEntry<T>))
  } catch {
    /* private mode / quota — caching is best-effort */
  }
}

const isFresh = (entry: CacheEntry<unknown> | null, ttl: number) =>
  entry !== null && Date.now() - entry.savedAt < ttl

/* ---------- transport ---------- */

async function getJson<T>(url: string, headers?: HeadersInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT) })
  } catch {
    throw new GitHubApiError('offline', `Network request failed: ${url}`)
  }
  if (!response.ok) {
    // GitHub answers 403 (or 429) with x-ratelimit-remaining: 0 once the hourly quota is spent.
    const remaining = response.headers.get('x-ratelimit-remaining')
    const limited =
      response.status === 429 || (response.status === 403 && (remaining === null || remaining === '0'))
    throw new GitHubApiError(limited ? 'rate-limited' : 'error', `HTTP ${response.status}: ${url}`)
  }
  return (await response.json()) as T
}

const github = <T>(path: string) =>
  getJson<T>(`${API}${path}`, { Accept: 'application/vnd.github+json' })

/* ---------- public API ---------- */

/** Synchronous, always-available data — used for the first paint and as the last-resort fallback. */
export function getSnapshotData(reason?: FallbackReason): GitHubData {
  return {
    user: snapshot.user,
    repos: snapshot.repos,
    source: 'snapshot',
    fetchedAt: snapshot.generatedAt,
    reason,
  }
}

/** Best data available without touching the network. */
export function getInitialData(): GitHubData {
  const cached = readCache<{ user: GitHubUser; repos: GitHubRepo[] }>(DATA_KEY)
  if (cached) {
    return { ...cached.value, source: 'cache', fetchedAt: new Date(cached.savedAt).toISOString() }
  }
  return getSnapshotData()
}

/** Profile + repositories. Never rejects: degrades to cache, then to the snapshot. */
export async function fetchGitHubData(options: { force?: boolean } = {}): Promise<GitHubData> {
  const cached = readCache<{ user: GitHubUser; repos: GitHubRepo[] }>(DATA_KEY)
  const fromCache = (reason?: FallbackReason): GitHubData => ({
    ...cached!.value,
    source: 'cache',
    fetchedAt: new Date(cached!.savedAt).toISOString(),
    reason,
  })

  if (!options.force && isFresh(cached, DATA_TTL)) return fromCache()

  try {
    const [user, repos] = await Promise.all([
      github<GitHubUser>(`/users/${USERNAME}`),
      github<GitHubRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=pushed`),
    ])
    writeCache(DATA_KEY, { user, repos })
    return { user, repos, source: 'live', fetchedAt: new Date().toISOString() }
  } catch (error) {
    const reason = reasonOf(error)
    return cached ? fromCache(reason) : getSnapshotData(reason)
  }
}

export interface CalendarResult {
  calendar: ContributionCalendar | null
  live: boolean
}

/** Last-year contribution calendar (public data, via a CORS-enabled proxy of the profile page). */
export async function fetchContributions(): Promise<CalendarResult> {
  const cached = readCache<ContributionCalendar>(CALENDAR_KEY)
  if (isFresh(cached, CALENDAR_TTL)) return { calendar: cached!.value, live: true }

  try {
    const json = await getJson<{
      total: { lastYear: number }
      contributions: ContributionCalendar['days']
    }>(`${CONTRIBUTIONS_API}/${USERNAME}?y=last`)
    const calendar: ContributionCalendar = {
      total: json.total.lastYear,
      days: json.contributions.map(({ date, count, level }) => ({ date, count, level })),
    }
    writeCache(CALENDAR_KEY, calendar)
    return { calendar, live: true }
  } catch {
    return { calendar: cached?.value ?? snapshot.contributions, live: false }
  }
}

/* ---------- derived statistics ---------- */

export interface LanguageShare {
  language: string
  bytes: number
  share: number
  repos: number
}

/**
 * Language mix across the user's own (non-fork) repositories, by bytes, as
 * detected by GitHub. Per-repo language data lives in the snapshot so the site
 * does not spend one API request per repository on every visit.
 */
export function languageBreakdown(repos: GitHubRepo[]): LanguageShare[] {
  const totals = new Map<string, { bytes: number; repos: number }>()
  for (const repo of repos) {
    if (repo.fork) continue
    for (const [language, bytes] of Object.entries(snapshot.languages[repo.name] ?? {})) {
      const entry = totals.get(language) ?? { bytes: 0, repos: 0 }
      entry.bytes += bytes
      entry.repos += 1
      totals.set(language, entry)
    }
  }
  const sum = [...totals.values()].reduce((n, e) => n + e.bytes, 0)
  return [...totals.entries()]
    .map(([language, e]) => ({ language, ...e, share: sum ? e.bytes / sum : 0 }))
    .sort((a, b) => b.bytes - a.bytes)
}

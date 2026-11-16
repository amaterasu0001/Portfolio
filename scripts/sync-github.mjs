#!/usr/bin/env node
/**
 * Refreshes src/data/github-snapshot.json — the offline fallback the site uses
 * whenever the live GitHub API is unreachable or rate-limited.
 *
 *   npm run sync:github
 *
 * Unauthenticated requests are limited to 60/hour per IP. To raise that to
 * 5,000/hour, set a token for this one command (it is never bundled or shipped):
 *
 *   GITHUB_TOKEN=ghp_xxx npm run sync:github
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const USERNAME = process.env.GITHUB_USERNAME ?? 'amaterasu0001'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-snapshot.json')
const API = 'https://api.github.com'

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-snapshot-script',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function gh(path) {
  const res = await fetch(`${API}${path}`, { headers })
  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000
    if ((res.status === 403 || res.status === 429) && remaining === '0') {
      throw new Error(
        `GitHub API rate limit reached. Resets at ${new Date(reset).toLocaleTimeString()}. ` +
          'Set GITHUB_TOKEN to avoid this.',
      )
    }
    throw new Error(`GitHub API ${res.status} for ${path}`)
  }
  return res.json()
}

const pickUser = (u) => ({
  login: u.login,
  name: u.name,
  bio: u.bio,
  company: u.company,
  blog: u.blog,
  location: u.location,
  email: u.email,
  twitter_username: u.twitter_username,
  avatar_url: u.avatar_url,
  html_url: u.html_url,
  public_repos: u.public_repos,
  followers: u.followers,
  following: u.following,
  created_at: u.created_at,
})

const pickRepo = (r) => ({
  name: r.name,
  description: r.description,
  html_url: r.html_url,
  homepage: r.homepage || null,
  language: r.language,
  stargazers_count: r.stargazers_count,
  forks_count: r.forks_count,
  fork: r.fork,
  archived: r.archived,
  topics: r.topics ?? [],
  size: r.size,
  created_at: r.created_at,
  updated_at: r.updated_at,
  pushed_at: r.pushed_at,
})

/** Public contribution calendar (the same data as the green squares on a profile). */
async function contributions() {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
  if (!res.ok) throw new Error(`Contribution calendar unavailable (${res.status})`)
  const json = await res.json()
  return {
    total: json.total?.lastYear ?? json.contributions.reduce((n, d) => n + d.count, 0),
    days: json.contributions.map(({ date, count, level }) => ({ date, count, level })),
  }
}

async function main() {
  console.log(`Syncing GitHub data for @${USERNAME} …`)
  const [user, repos] = await Promise.all([
    gh(`/users/${USERNAME}`),
    gh(`/users/${USERNAME}/repos?per_page=100&sort=pushed`),
  ])

  const languages = {}
  for (const repo of repos) {
    languages[repo.name] = await gh(`/repos/${USERNAME}/${repo.name}/languages`)
  }

  let calendar = null
  try {
    calendar = await contributions()
  } catch (error) {
    console.warn(`  ! ${error.message} — keeping snapshot without a calendar.`)
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    user: pickUser(user),
    repos: repos.map(pickRepo),
    languages,
    contributions: calendar,
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`  ✓ ${repos.length} repositories, ${calendar ? `${calendar.total} contributions` : 'no calendar'}`)
  console.log(`  ✓ wrote ${OUT}`)
}

main().catch((error) => {
  console.error(`✗ ${error.message}`)
  process.exitCode = 1 // let open sockets close on their own (process.exit here can abort on Windows)
})

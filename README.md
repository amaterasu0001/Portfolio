# Mahir Faisal — Portfolio

Personal developer portfolio. React + Vite + TypeScript + Tailwind CSS, with live data from the public GitHub API.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run sync:github` | Refresh the offline GitHub snapshot |

## Editing content

All content lives in `src/data/` — no copy is hard-coded in components.

| File | Contains |
| --- | --- |
| `profile.ts` | Name, location, education, social links, **email** and **résumé** (both `null` until you add them) |
| `projects.ts` | Curated write-up for each repository: tagline, problem, solution, features, stack, tier |
| `skills.ts` | Skills, each with the repositories that use it |
| `journey.ts` | Timeline and current focus |
| `github-snapshot.json` | Generated — do not edit by hand |

**Add a résumé:** put the PDF at `public/resume.pdf` and set `resumeUrl: './resume.pdf'` in `profile.ts`. The button appears in the hero.

**Add an email:** set `email` in `profile.ts`. The contact section shows it automatically.

**Add a screenshot:** put the image in `public/projects/` and set `image: './projects/<file>'` on the project. It replaces the code-drawn diagram on the card and in the case study.

**Add a project:** push the repository to GitHub — it shows up in the explorer on its own. Add an entry to `projects.ts` to give it a case study, and set `featured: true` / `tier: 1` to feature it.

## How the GitHub data works

`src/lib/github.ts` is the only module that touches the network.

1. First paint uses cached data (localStorage) or the committed snapshot, so nothing waits on the network.
2. It then requests the profile and repository list from `api.github.com` (2 requests, cached for 30 minutes) and the contribution calendar (cached for 6 hours).
3. If GitHub is rate-limited (60 requests/hour per IP without a token) or unreachable, the site keeps showing the cached or snapshot data and says so, with a retry button.

No token is used in the browser. Run `npm run sync:github` before deploying to refresh the snapshot; `GITHUB_TOKEN=… npm run sync:github` raises the script's rate limit.

## Deploy

The build is fully static (`dist/`) and uses relative asset paths, so it works on a root domain or a sub-path.

- **Vercel / Netlify / Cloudflare Pages:** import the repository. Build command `npm run build`, output directory `dist`.
- **GitHub Pages:** build, then publish the contents of `dist/` (for example with the `actions/deploy-pages` workflow).

After deploying, set `og:url` and make `og:image` an absolute URL in `index.html` so link previews work everywhere.

## Structure

```
src/
  components/   Reusable UI (Navbar, ProjectCard, ProjectModal, SkillBadge, GitHubStats, …)
    visuals/    Code-drawn project diagrams
  sections/     Page sections (Hero, About, Skills, FeaturedProjects, RepoExplorer, …)
  data/         Content + GitHub snapshot
  hooks/        GitHub provider, active-section, URL state
  lib/          GitHub client, formatting helpers
  types/        Shared TypeScript types
scripts/        sync-github.mjs, og-image.svg (source of public/og.png)
```

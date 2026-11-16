import type { Project } from '@/types'

const gh = (repo: string) => `https://github.com/amaterasu0001/${repo}`

/**
 * Curated project content, keyed by GitHub repository name.
 *
 * Every statement here was checked against the repository's source, README or
 * commit history. Live numbers (stars, forks, last push) are merged in at
 * runtime from the GitHub API — see src/lib/github.ts.
 *
 * To add a project: push the repo, then add an entry here. Repos without an
 * entry still appear in the explorer using their GitHub metadata.
 * To add a screenshot: put it in /public/projects and set `image`.
 */
export const projects: Project[] = [
  /* ───────────── Tier 1 — featured ───────────── */
  {
    repo: 'Nasa_App',
    name: 'A.V.I.A.',
    tagline: 'Autonomous Vital Intelligence Agent — crew health monitoring for long-duration spaceflight.',
    description:
      'An offline-first system that ingests crew biometrics, runs on-board ML inference and surfaces risk on a desktop cockpit with a 3D digital twin and a wearable-style edge client.',
    problem:
      'On a long-duration mission, a crew cannot rely on ground control to interpret their vitals — the link is delayed or absent. Health monitoring has to run on board and keep working without a network.',
    solution:
      'Two React clients talk only to a Fastify backend-for-frontend, which shapes and caches responses in Redis. A core API owns PostgreSQL, fills gaps in each reading, calls a PyTorch inference service, then stores the reading, its inference and any alerts in a single row-level-secured transaction.',
    features: [
      'Cockpit dashboard with six views: overview, 3D digital twin, analytics, alerts, behavioral health and mission setup',
      'Pulse — a smartwatch-style edge client that submits telemetry and symptom logs',
      'Inference pipeline: four encoders → fusion → GRU over a 72-hour window, returning scores, attribution and a 7-step forecast',
      'Alert lifecycle with one active alert per crew member and condition, auto-resolving when it clears',
      'Readings are still stored when the models are down — the API degrades to a 503 instead of losing data',
      'One-command Docker Compose stack: Postgres, Redis, inference agent, API, BFF and both clients',
    ],
    technologies: [
      'TypeScript',
      'React',
      'Vite',
      'React Three Fiber',
      'Fastify',
      'Node.js',
      'PostgreSQL',
      'Redis',
      'Python',
      'FastAPI',
      'PyTorch',
      'Docker',
      'Nginx',
    ],
    stackLine: 'TypeScript · Fastify · PostgreSQL',
    filterTags: ['TypeScript', 'React', 'Python', 'Node.js'],
    primaryLanguage: 'TypeScript',
    category: 'Full-stack',
    tier: 1,
    featured: true,
    githubUrl: gh('Nasa_App'),
    visual: 'avia',
    context: 'NASA Space Apps 2026',
    team: 'Team project — the repository integrates models trained by the team’s ML members.',
    facts: [
      { label: 'Compose', value: '9 services' },
      { label: 'Clients', value: 'Cockpit + Pulse' },
      { label: 'Tests', value: 'Unit, e2e + pytest' },
    ],
    technicalDetails: [
      {
        title: 'Backend-for-frontend',
        body: 'Clients never call the core API or the inference service directly. The BFF exposes one contract per client, caches Cockpit views in Redis and invalidates them on every write.',
      },
      {
        title: 'Row-level security',
        body: 'The API connects as a non-owner Postgres role. Every crew-scoped query runs inside withCrew(), which sets app.crew_id for the transaction, so vitals, inferences and alerts only expose that crew member’s rows.',
      },
      {
        title: 'Ingest orchestration',
        body: 'Missing fields are filled by carry-forward, then personal baseline, then documented defaults; a 6-step history window is built and sent to the agent; the reading, inference and alerts commit together.',
      },
      {
        title: 'Why the core API calls the models',
        body: 'Model outputs are persisted data that get read back later, so they are written in the same transaction as the reading rather than from the BFF.',
      },
    ],
    status:
      'Hackathon build. Its own architecture notes are upfront that there is no authentication yet — the crew id comes from the URL — and list which panels are not model-derived.',
    lastActivity: '2026-11-16',
  },
  {
    repo: 'LearnSphere',
    name: 'LearnSphere',
    tagline: 'A tutoring marketplace on the MERN stack with real-time chat.',
    description:
      'Students post tuition requests, tutors browse and save them, and both sides talk in a live chat — backed by JWT auth, role-based profiles and an email-code password reset.',
    problem:
      'Finding a home tutor usually means word of mouth and phone calls. Students need one place to describe what they need; tutors need a way to find and follow up on matching requests.',
    solution:
      'A React single-page app on an Express API with MongoDB. Private routes gate everything behind login; Socket.IO keeps a userId → socket map so each message is saved to MongoDB first and then pushed to both participants.',
    features: [
      'Sign-up and login with bcrypt-hashed passwords and JWT sessions',
      'Forgot-password flow: emailed verification code via Nodemailer, then reset',
      'Separate student and tutor profiles with role-specific fields',
      'Tutor requests: subjects, class, area, schedule and salary range',
      'Tuition job board with a favourites list for tutors',
      'One-to-one chat over Socket.IO with persisted history',
    ],
    technologies: [
      'JavaScript',
      'React',
      'Vite',
      'React Router',
      'Bootstrap',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'Socket.IO',
      'JWT',
      'Nodemailer',
    ],
    stackLine: 'React · Express · MongoDB',
    filterTags: ['JavaScript', 'React', 'Node.js'],
    primaryLanguage: 'JavaScript',
    category: 'Full-stack',
    tier: 1,
    featured: true,
    githubUrl: gh('LearnSphere'),
    visual: 'learnsphere',
    context: 'CSE 2200 · Software Development Lab-3',
    team: 'Three contributors — 46 of the 61 commits are mine.',
    facts: [
      { label: 'Commits', value: '61' },
      { label: 'Contributors', value: '3' },
      { label: 'Routes', value: '10' },
    ],
    technicalDetails: [
      {
        title: 'Auth',
        body: 'Passwords are hashed with bcryptjs, sessions are signed JWTs, and a PrivateRoute wrapper guards the profile, tutor-request, favourites, reset-password and chat routes.',
      },
      {
        title: 'Real-time messaging',
        body: 'On connect a client registers its user id; the server stores each message through the Chat model, then emits newMessage to the receiver’s and sender’s sockets. History loads over REST.',
      },
      {
        title: 'Data model',
        body: 'Five Mongoose models — User, Profile, TutorRequest, Favourite and Chat — with a role enum separating student and tutor profile fields.',
      },
    ],
    lastActivity: '2025-03-16',
  },
  {
    repo: 'MemoryMateBot',
    name: 'MemoryMateBot',
    tagline: 'A Telegram bot that remembers things for you — and answers questions with an LLM.',
    description:
      'Set a reminder in plain text and the bot messages you at that time. Switch to AI mode and it becomes a chat assistant that keeps conversation context.',
    problem:
      'Reminders are most useful where you already are. A chat you open every day beats another app — but a bot that forgets its schedule on restart is worse than no bot.',
    solution:
      'Reminders are stored in SQLite and scheduled with APScheduler. On startup the bot delivers anything it missed while offline and re-schedules the rest. AI mode keeps a per-user message history and sends it to OpenRouter.',
    features: [
      '/remember <text> at <date time> — with duplicate detection',
      '/list and /delete to manage saved reminders',
      'Missed reminders are delivered on restart, future ones are re-scheduled',
      '/ask and /stop toggle an AI chat mode with per-user context',
      'Secrets loaded from environment variables via python-dotenv',
      'Small Flask keep-alive endpoint for always-on hosting',
    ],
    technologies: [
      'Python',
      'python-telegram-bot',
      'APScheduler',
      'SQLite',
      'OpenRouter API',
      'Flask',
    ],
    stackLine: 'Python · SQLite · LLM API',
    filterTags: ['Python'],
    primaryLanguage: 'Python',
    category: 'Bot',
    tier: 1,
    featured: true,
    githubUrl: gh('MemoryMateBot'),
    visual: 'memorymate',
    facts: [
      { label: 'Commands', value: '6' },
      { label: 'Storage', value: 'SQLite' },
      { label: 'Scheduler', value: 'APScheduler' },
    ],
    technicalDetails: [
      {
        title: 'Bridging threads and asyncio',
        body: 'APScheduler fires jobs on a background thread, while python-telegram-bot is async. The bot captures the running event loop at startup and uses run_coroutine_threadsafe to send each reminder.',
      },
      {
        title: 'Surviving restarts',
        body: 'A post-init hook scans the reminders table: anything already due is sent with a “[Missed]” label and deleted, anything in the future is put back on the scheduler.',
      },
      {
        title: 'AI mode',
        body: 'Non-command messages are only handled for users who ran /ask. Their history is posted to OpenRouter’s chat completions endpoint and the reply appended, so follow-ups keep context.',
      },
    ],
    lastActivity: '2025-06-19',
  },
  {
    repo: 'DarkSiders',
    name: 'DarkSiders',
    tagline: 'A 2D side-scrolling action game written in C/C++ on iGraphics.',
    description:
      'Three levels, a different enemy type on each, sprite-animated combat, a life bar and a persistent high-score table — built without a game engine.',
    problem:
      'A first real programming project: turn loops, structs and file I/O into something playable, with only a thin OpenGL/GLUT wrapper for drawing.',
    solution:
      'A game-state machine drives menu, play, pause, score and credits screens. Timers advance sprite frames and scroll tiled backgrounds; enemies live in struct arrays and are removed by bounding-box checks against the hero’s projectile.',
    features: [
      'Three levels with their own backgrounds, enemy sprites and speeds',
      'Walk, jump and attack animations in both directions',
      'Projectile-versus-enemy collision with score updates',
      'Six-state life bar, pause and game-over screens',
      'Player name entry and a sorted high-score table saved to disk',
      'Menu with mouse-driven buttons, background music and a mute toggle',
    ],
    technologies: ['C', 'C++', 'iGraphics', 'OpenGL / GLUT', 'Visual Studio'],
    stackLine: 'C/C++ · OpenGL · no engine',
    filterTags: ['C / C++'],
    primaryLanguage: 'C++',
    category: 'Game',
    tier: 1,
    featured: true,
    githubUrl: gh('DarkSiders'),
    visual: 'darksiders',
    context: 'University game project',
    team: 'Built by a team of three; the project slides and report are in the repository.',
    facts: [
      { label: 'Levels', value: '3' },
      { label: 'Engine', value: 'None' },
      { label: 'Team', value: '3 people' },
    ],
    technicalDetails: [
      {
        title: 'Structure',
        body: 'Logic is split into headers by concern — hero movement, three villain modules, menu, scores and shared variables — included from a single iMain.cpp that owns the draw loop and input handlers.',
      },
      {
        title: 'Collision',
        body: 'Each enemy is a struct with position, sprite index and a visibility flag. Every tick the projectile’s rectangle is tested against each visible enemy; a hit hides it and increments the score.',
      },
      {
        title: 'Persistence',
        body: 'Scores are appended to a text file with the player’s name, then read back, sorted and rendered on the high-score page.',
      },
    ],
    status: 'Windows only — it links against the bundled GLUT libraries and opens in Visual Studio.',
    lastActivity: '2024-09-14',
  },

  /* ───────────── Tier 2 — strong ───────────── */
  {
    repo: 'cse-3100',
    name: 'Character Explorer',
    tagline: 'React assignment for CSE 3100 — search, filter and paginate an external REST API.',
    description:
      'My work in a fork of the AUST “Web Application Development with DevOps” course repository: a React app on the Rick and Morty API, delivered feature-by-feature through pull requests.',
    problem:
      'The course assignment: extend a starter app into a multi-page React site, using a branch-and-PR workflow instead of committing straight to main.',
    solution:
      'Search text, status filter and page number live in the URL query string, so every view is shareable. The API returns 20 items per page; the app maps each of its own 10-item pages onto the right half of the right API page.',
    features: [
      'Name search and status filter synced to the URL',
      'Custom 10-per-page pagination over a 20-per-page API',
      'Character detail, About and Contact pages with a shared navbar',
      'Eleven pull requests across five feature branches',
    ],
    technologies: ['JavaScript', 'React', 'React Router', 'Bootstrap', 'Vite', 'REST API'],
    filterTags: ['JavaScript', 'React'],
    primaryLanguage: 'JavaScript',
    category: 'Coursework',
    tier: 2,
    featured: false,
    githubUrl: `${gh('cse-3100')}/tree/assignemnt-01-20220204073`,
    context: 'CSE 3100 · AUST',
    status:
      'Fork of the instructor’s course repository. My work is on the assignment branch, not main — the link opens that branch.',
    lastActivity: '2025-07-04',
  },
  {
    repo: 'ShoeSphere',
    name: 'ShoeSphere',
    tagline: 'A Flutter shoe-store app — early stage.',
    description:
      'The foundation of a mobile storefront: splash screen, onboarding carousel and login UI, with GetX routing, light/dark themes and responsive sizing.',
    problem: 'A first mobile project, and a first repository shared with a teammate through branches and pull requests.',
    solution:
      'Named routes are declared with GetX, screens scale with flutter_screenutil against a 360×690 design, and reusable button and text-field widgets keep the auth screens consistent.',
    features: [
      'Splash → onboarding → login flow with named GetX routes',
      'Light and dark Material themes',
      'Reusable custom button and text-field widgets',
      'Built with a teammate via feature branch and pull requests',
    ],
    technologies: ['Dart', 'Flutter', 'GetX'],
    filterTags: ['Dart'],
    primaryLanguage: 'Dart',
    category: 'Mobile',
    tier: 2,
    featured: false,
    githubUrl: gh('ShoeSphere'),
    team: 'Two contributors.',
    status:
      'Work in progress. Firebase and bKash payment packages are declared but not wired up yet; registration and password-reset screens are stubs. GitHub labels the repo C++ because of Flutter’s generated desktop runner code.',
    lastActivity: '2024-05-21',
  },

  /* ───────────── Tier 3 — other ───────────── */
  {
    repo: 'web-project-2',
    name: 'Bike Shop Landing Page',
    tagline: 'A multi-section landing page in plain HTML and CSS.',
    description:
      'A vehicle-showroom page with a sticky navigation bar, hero, product cards, client logos and a contact form, plus a separate stylesheet for narrow screens.',
    features: [
      'Flexbox layout with a sticky header',
      'Dedicated phone stylesheet loaded by media query',
      'No JavaScript or frameworks',
    ],
    technologies: ['HTML', 'CSS'],
    filterTags: ['HTML / CSS'],
    primaryLanguage: 'CSS',
    category: 'Web',
    tier: 3,
    featured: false,
    githubUrl: gh('web-project-2'),
    lastActivity: '2024-09-14',
  },
  {
    repo: 'web-project-1',
    name: 'Fitness Gym Page',
    tagline: 'My first web page — a gym sign-up layout in HTML and CSS only.',
    description:
      'A single-page layout with a navigation bar, call-to-action buttons and a membership form. The starting point for everything web-related that came after.',
    features: ['Hand-written HTML and CSS', 'Positioned navbar and styled form controls'],
    technologies: ['HTML', 'CSS'],
    filterTags: ['HTML / CSS'],
    primaryLanguage: 'HTML',
    category: 'Web',
    tier: 3,
    featured: false,
    githubUrl: gh('web-project-1'),
    lastActivity: '2024-09-14',
  },
  {
    repo: 'project2',
    name: 'project2',
    tagline: 'Re-upload of the bike shop landing page.',
    description: 'Same HTML and CSS as web-project-2, pushed again in December 2024.',
    features: [],
    technologies: ['HTML', 'CSS'],
    filterTags: ['HTML / CSS'],
    primaryLanguage: 'CSS',
    category: 'Web',
    tier: 3,
    featured: false,
    githubUrl: gh('project2'),
    status: 'Duplicate of web-project-2.',
    lastActivity: '2024-12-14',
  },
  {
    repo: 'project1',
    name: 'project1',
    tagline: 'Re-upload of the fitness gym page.',
    description: 'Same HTML and CSS as web-project-1, pushed again in December 2024.',
    features: [],
    technologies: ['HTML', 'CSS'],
    filterTags: ['HTML / CSS'],
    primaryLanguage: 'HTML',
    category: 'Web',
    tier: 3,
    featured: false,
    githubUrl: gh('project1'),
    status: 'Duplicate of web-project-1.',
    lastActivity: '2024-12-14',
  },
  {
    repo: 'Portfolio',
    name: 'Portfolio',
    tagline: 'This website — its source code.',
    description:
      'The site you are reading: a single-page React app whose project explorer and GitHub section are fed by the public GitHub API, with a committed snapshot as the offline fallback.',
    features: [
      'Repository explorer with search, technology and category filters, and sorting',
      'Live GitHub data with caching and a graceful fallback when the API is rate-limited',
      'Case-study dialog for each project, linkable by URL',
    ],
    technologies: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Motion'],
    filterTags: ['TypeScript', 'React'],
    primaryLanguage: 'TypeScript',
    category: 'Web',
    tier: 3,
    featured: false,
    githubUrl: gh('Portfolio'),
    lastActivity: '2026-11-16',
  },
  {
    repo: 'amaterasu0001',
    name: 'Profile README',
    tagline: 'The README shown on my GitHub profile.',
    description: 'Current focus, social links and tech-stack badges for my GitHub profile page.',
    features: [],
    technologies: ['Markdown'],
    filterTags: [],
    primaryLanguage: 'Markdown',
    category: 'Profile',
    tier: 3,
    featured: false,
    githubUrl: gh('amaterasu0001'),
    lastActivity: '2024-12-06',
  },
]

export const projectByRepo = new Map(projects.map((p) => [p.repo, p]))
export const featuredProjects = projects.filter((p) => p.featured)

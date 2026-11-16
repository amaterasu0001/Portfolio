import { lazy, Suspense, useMemo } from 'react'
import { MotionConfig } from 'motion/react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { projectByRepo } from '@/data/projects'
import { GitHubProvider } from '@/hooks/GitHubProvider'
import { useGitHub } from '@/hooks/useGitHub'
import { useProjectParam } from '@/hooks/useProjectParam'
import { viewForProject } from '@/lib/repos'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { FeaturedProjects } from '@/sections/FeaturedProjects'
import { GitHubSection } from '@/sections/GitHubSection'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { RepoExplorer } from '@/sections/RepoExplorer'
import { Skills } from '@/sections/Skills'

// The case-study dialog is only needed after a click, so it ships as its own chunk.
const ProjectModal = lazy(() =>
  import('@/components/ProjectModal').then((module) => ({ default: module.ProjectModal })),
)

function Page() {
  const { data } = useGitHub()
  const { repo, open, close } = useProjectParam()

  const openView = useMemo(() => {
    const project = repo ? projectByRepo.get(repo) : undefined
    return project ? viewForProject(project, data.repos) : null
  }, [repo, data.repos])

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills onOpenProject={open} />
        <FeaturedProjects onOpenProject={open} />
        <RepoExplorer onOpenProject={open} />
        <Journey onOpenProject={open} />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ProjectModal view={openView} onClose={close} />
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    // reducedMotion="user" turns transform animations off for visitors who ask for that.
    <MotionConfig reducedMotion="user">
      <GitHubProvider>
        <Page />
      </GitHubProvider>
    </MotionConfig>
  )
}

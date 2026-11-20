import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { featuredProjects } from '@/data/projects'
import { useGitHub } from '@/hooks/useGitHub'
import { viewForProject } from '@/lib/repos'

export function FeaturedProjects({ onOpenProject }: { onOpenProject: (repo: string) => void }) {
  const { data } = useGitHub()

  return (
    <section id="projects" className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Featured work"
          title="Four projects, four different problems"
          description="Ranked by technical depth and completeness, not by date. Each one opens into a short case study: what it is, why it exists and how it works."
        />

        <div className="mt-14 space-y-6">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.repo} y={28}>
              <ProjectCard
                view={viewForProject(project, data.repos)}
                index={index}
                flip={index % 2 === 1}
                onOpen={onOpenProject}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

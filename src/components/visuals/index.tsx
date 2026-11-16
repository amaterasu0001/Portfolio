import type { VisualKey } from '@/types'
import { AviaDiagram } from './AviaDiagram'
import { BotTranscript } from './BotTranscript'
import { GameControls } from './GameControls'
import { LearnSphereFlow } from './LearnSphereFlow'

const visuals: Record<VisualKey, () => React.JSX.Element> = {
  avia: AviaDiagram,
  learnsphere: LearnSphereFlow,
  memorymate: BotTranscript,
  darksiders: GameControls,
}

/** Code-drawn stand-in for a screenshot, picked by a project's `visual` key. */
export function ProjectVisual({ visual }: { visual: VisualKey }) {
  const Component = visuals[visual]
  return <Component />
}

import { cn } from '@/lib/cn'
import type { Skill } from '@/types'

interface SkillBadgeProps {
  skill: Skill
  selected: boolean
  /** Dimmed when another skill is selected and this one shares no project with it */
  related: boolean
  onSelect: (skill: Skill) => void
}

/** A skill chip that doubles as a toggle: selecting it reveals the projects that use it. */
export function SkillBadge({ skill, selected, related, onSelect }: SkillBadgeProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(skill)}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-[border-color,background-color,color,opacity] duration-200',
        selected
          ? 'border-ember/70 bg-ember/10 text-fg'
          : 'border-line bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg',
        !selected && !related && 'opacity-45',
      )}
    >
      {skill.name}
      <span
        className={cn('font-mono text-[0.68rem]', selected ? 'text-ember-300' : 'text-faint')}
        aria-label={`used in ${skill.usedIn.length} ${skill.usedIn.length === 1 ? 'repository' : 'repositories'}`}
      >
        {skill.usedIn.length}
      </span>
    </button>
  )
}

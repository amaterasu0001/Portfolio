import type { ReactNode } from 'react'
import { motion } from 'motion/react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** seconds */
  delay?: number
  /** vertical offset to rise from, in px */
  y?: number
  as?: 'div' | 'li' | 'article' | 'section'
}

/**
 * Fades content up the first time it scrolls into view.
 * <MotionConfig reducedMotion="user"> in App disables the movement for users who ask for that.
 */
export function Reveal({ children, className, delay = 0, y = 18, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -72px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

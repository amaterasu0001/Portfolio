import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

export interface TerminalStep {
  command: string
  /** Rendered once the command has finished "typing" */
  output: ReactNode
}

interface TerminalProps {
  steps: TerminalStep[]
  title?: string
  className?: string
}

const TYPE_MS = 34
const AFTER_COMMAND_MS = 260
const BETWEEN_STEPS_MS = 620

/**
 * A terminal window that types each command once, then prints its output.
 * It runs a single time (no looping), starts when scrolled into view, and
 * renders everything immediately for visitors who prefer reduced motion.
 */
export function Terminal({ steps, title = 'zsh', className }: TerminalProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [outputShown, setOutputShown] = useState(false)

  const done = reduceMotion || stepIndex >= steps.length

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || done) return
    const command = steps[stepIndex]!.command
    let timer: number

    if (typed < command.length) {
      timer = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS)
    } else if (!outputShown) {
      timer = window.setTimeout(() => setOutputShown(true), AFTER_COMMAND_MS)
    } else {
      timer = window.setTimeout(() => {
        setStepIndex((n) => n + 1)
        setTyped(0)
        setOutputShown(false)
      }, BETWEEN_STEPS_MS)
    }
    return () => window.clearTimeout(timer)
  }, [started, done, stepIndex, typed, outputShown, steps])

  return (
    <div
      ref={ref}
      className={cn(
        'surface relative overflow-hidden shadow-[0_32px_80px_-32px_rgb(0_0_0/0.9)]',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.02] px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="size-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="size-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="ml-2 font-mono text-xs text-faint">{title}</span>
      </div>

      {/* Body: visually animated, but screen readers get the full static transcript. */}
      <div className="grid min-h-[21.5rem] p-4 font-mono text-[0.8125rem] leading-relaxed sm:p-5">
        <div className="sr-only">
          {steps.map((step) => (
            <div key={step.command}>
              <p>Command: {step.command}</p>
              <div>{step.output}</div>
            </div>
          ))}
        </div>

        {/*
          Invisible copy of the finished transcript, stacked in the same grid cell as the
          animated one. It reserves the final height from the first paint, so the page
          below never shifts while the terminal types (a shift mid-scroll makes in-page
          links land short of their section).
        */}
        <div className="invisible col-start-1 row-start-1" aria-hidden>
          {steps.map((step) => (
            <div key={step.command} className="mb-4">
              <p className="flex gap-2">
                <span>❯</span>
                <span>{step.command}</span>
              </p>
              <div className="mt-1.5 pl-4">{step.output}</div>
            </div>
          ))}
          <p>❯</p>
        </div>

        <div className="col-start-1 row-start-1" aria-hidden>
          {steps.map((step, index) => {
            const isPast = done || index < stepIndex
            const isCurrent = !done && index === stepIndex
            if (!isPast && !isCurrent) return null
            return (
              <div key={step.command} className="mb-4 last:mb-0">
                <p className="flex gap-2 text-fg">
                  <span className="select-none text-ember">❯</span>
                  <span>
                    {isPast ? step.command : step.command.slice(0, typed)}
                    {isCurrent && !outputShown && <Caret />}
                  </span>
                </p>
                {(isPast || outputShown) && <div className="mt-1.5 pl-4 text-muted">{step.output}</div>}
              </div>
            )
          })}
          {done && (
            <p className="flex gap-2 text-fg">
              <span className="select-none text-ember">❯</span>
              <Caret />
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Caret() {
  return <span className="ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-blink bg-ember-300" />
}

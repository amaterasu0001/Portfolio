import { cn } from '@/lib/cn'
import { VisualFrame } from './VisualFrame'

function Key({ label, action, wide }: { label: string; action: string; wide?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <kbd
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-lg border border-line-strong bg-ink-800 font-mono text-sm text-fg shadow-[inset_0_-2px_0_rgb(0_0_0/0.5)]',
          wide ? 'w-24' : 'w-10',
        )}
      >
        {label}
      </kbd>
      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-faint">{action}</span>
    </div>
  )
}

/** Controls as bound in iMain.cpp's iKeyboard(); three levels and a six-state life bar from variables.h. */
export function GameControls() {
  return (
    <VisualFrame caption="controls + level loop · from iMain.cpp">
      <div className="w-full max-w-[26rem] space-y-5">
        {/* HUD */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-line bg-ink-850 px-4 py-3">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-faint">Life</p>
            <div className="mt-1.5 flex gap-1" role="img" aria-label="Life bar, five of six segments">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={cn('h-2 w-5 rounded-sm', i < 5 ? 'bg-ember' : 'bg-white/10')} />
              ))}
            </div>
          </div>
          <ol className="order-last flex w-full items-center justify-center gap-1.5 font-mono text-[0.7rem] sm:order-none sm:w-auto" aria-label="Level progression">
            {[1, 2, 3].map((level) => (
              <li key={level} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'rounded-md border px-2 py-1',
                    level === 2 ? 'border-ember/60 text-fg' : 'border-line text-faint',
                  )}
                >
                  LVL {level}
                </span>
                {level < 3 && <span className="text-faint" aria-hidden>→</span>}
              </li>
            ))}
          </ol>
          <div className="text-right">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-faint">Score</p>
            <p className="font-mono text-sm text-fg">024</p>
          </div>
        </div>

        {/* Keys */}
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-4">
          <div className="grid grid-cols-3 gap-1.5">
            <span />
            <Key label="W" action="up" />
            <span />
            <Key label="A" action="left" />
            <Key label="S" action="down" />
            <Key label="D" action="right" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Key label="E" action="attack" />
            <Key label="P" action="pause" />
            <Key label="M" action="music" />
            <Key label="Space" action="jump" wide />
          </div>
        </div>
      </div>
    </VisualFrame>
  )
}

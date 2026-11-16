import { Lock, LockOpen } from 'lucide-react'
import { VisualFrame } from './VisualFrame'

/** Routes exactly as declared in LearnSphere's src/App.jsx. */
const routes = [
  { path: '/', locked: false },
  { path: '/TutionJob', locked: false },
  { path: '/Login', locked: false },
  { path: '/Profile', locked: true },
  { path: '/TutorRequest', locked: true },
  { path: '/favourites', locked: true },
  { path: '/chat/:studentId', locked: true },
]

/** The message path implemented in Backend/server.js. */
const messagePath = [
  { actor: 'client', code: "socket.emit('sendMessage')" },
  { actor: 'server', code: 'new Chat(msg).save()' },
  { actor: 'mongo', code: 'chats ← { sender, receiver, message }' },
  { actor: 'server', code: "io.to(socketId).emit('newMessage')" },
]

export function LearnSphereFlow() {
  return (
    <VisualFrame caption="routes + message path · from src/App.jsx and Backend/server.js">
      {/* Container query: the two panels sit side by side only when the frame itself is wide enough. */}
      <div className="@container w-full max-w-[30rem]">
        <div className="grid gap-3 @md:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0 rounded-xl border border-line bg-ink-850 p-3.5">
            <p className="eyebrow text-faint">Routes</p>
            <ul className="mt-3 space-y-1.5 font-mono text-[0.72rem]">
              {routes.map((route) => (
                <li key={route.path} className="flex items-center justify-between gap-2">
                  <span className={route.locked ? 'text-fg' : 'text-muted'}>{route.path}</span>
                  {route.locked ? (
                    <Lock className="size-3 shrink-0 text-ember-300" aria-label="requires login" />
                  ) : (
                    <LockOpen className="size-3 shrink-0 text-faint" aria-label="public" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 rounded-xl border border-line bg-ink-850 p-3.5">
            <p className="eyebrow text-faint">One chat message</p>
            <ol className="mt-3 space-y-2">
              {messagePath.map((step, index) => (
                <li key={step.code} className="flex items-start gap-2.5">
                  <span className="mt-px inline-flex size-[1.15rem] shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[0.6rem] text-muted">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.62rem] uppercase tracking-widest text-ember-300">
                      {step.actor}
                    </span>
                    <span className="block font-mono text-[0.72rem] leading-snug text-fg [overflow-wrap:anywhere]">
                      {step.code}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </VisualFrame>
  )
}

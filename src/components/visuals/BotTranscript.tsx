import { cn } from '@/lib/cn'
import { VisualFrame } from './VisualFrame'

/**
 * Commands and replies are the literal strings in MemoryMateBot.py —
 * the example reminder is the one from the bot's own usage message.
 */
const messages: { from: 'user' | 'bot'; text: string }[] = [
  { from: 'user', text: '/remember Buy Milk at 2025-06-20 06:00 PM' },
  { from: 'bot', text: '✅ Reminder saved!' },
  { from: 'bot', text: '🔔 Reminder: Buy Milk' },
  { from: 'user', text: '/ask' },
  { from: 'bot', text: '🤖 AI chat mode ON. Just type your question!\nSend /stop to exit.' },
]

export function BotTranscript() {
  return (
    <VisualFrame caption="command flow · strings taken from MemoryMateBot.py">
      <div className="w-full max-w-[22rem] overflow-hidden rounded-2xl border border-line bg-ink-850">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-ember/15 text-sm" aria-hidden>
            🧠
          </span>
          <div>
            <p className="text-sm font-medium leading-tight text-fg">MemoryMateBot</p>
            <p className="font-mono text-[0.65rem] text-faint">bot</p>
          </div>
        </div>
        <ul className="space-y-2 p-3.5">
          {messages.map((message, index) => (
            <li key={index} className={cn('flex', message.from === 'user' ? 'justify-end' : 'justify-start')}>
              <span
                className={cn(
                  'max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[0.78rem] leading-snug',
                  message.from === 'user'
                    ? 'rounded-br-md bg-ember/90 font-mono text-[0.72rem] text-ink-950'
                    : 'rounded-bl-md border border-line bg-white/[0.04] text-fg',
                )}
              >
                <span className="sr-only">{message.from === 'user' ? 'You: ' : 'Bot: '}</span>
                {message.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </VisualFrame>
  )
}

import { cn } from '@/lib/cn'

/** Personal mark: an "M" under a small rising sun — a nod to the handle, amaterasu. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden focusable="false">
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="#10131a" stroke="rgb(255 255 255 / 0.14)" />
      <path
        d="M9 22.5V11.2l7 8 7-8v11.3"
        fill="none"
        stroke="#efeee9"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="9" r="2.1" fill="#ff6a3d" />
    </svg>
  )
}

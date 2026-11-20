import portrait from '../../image/pic.jpg'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'

/**
 * Profile photo in a softly rounded square frame.
 *
 * The source (image/pic.jpg) is a full-length portrait, so a plain centred square
 * crop would show the jacket and cut off the head. `object-fit: cover` still keeps
 * the proportions; `object-position` plus a fixed zoom frame the head and shoulders.
 * Nothing is stretched, and the file is imported (not moved or renamed), so Vite
 * fingerprints it and it loads on every deploy target.
 */
export function ProfilePortrait({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Nested radius: 24px frame − 4px padding = 20px photo corner.
        'relative shrink-0 rounded-3xl border border-line-strong bg-ink-900 p-1',
        'shadow-[0_16px_40px_-24px_rgb(0_0_0/0.9)]',
        className,
      )}
    >
      <div className="relative size-full overflow-hidden rounded-[1.25rem] bg-ink-800">
        <img
          src={portrait}
          alt={`Portrait of ${profile.fullName}`}
          width={168}
          height={168}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className={cn(
            'absolute inset-0 size-full select-none object-cover object-[50%_22%]',
            // Zoom in on the face; the origin keeps it centred in the frame.
            'origin-[34%_12%] scale-[1.65]',
          )}
        />
        {/* Hairline inner edge so the photo sits cleanly inside the frame */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" aria-hidden />
      </div>
    </div>
  )
}

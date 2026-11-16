import { languageColor } from '@/lib/languageColors'

/** Coloured dot + language name, as on GitHub. */
export function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
        style={{ backgroundColor: languageColor(language) }}
        aria-hidden
      />
      {language}
    </span>
  )
}

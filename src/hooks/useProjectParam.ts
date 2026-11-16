import { useCallback, useEffect, useState } from 'react'

const PARAM = 'project'

const read = () => new URLSearchParams(window.location.search).get(PARAM)

/**
 * Keeps the open project in the URL (?project=LearnSphere) so a case study can
 * be linked to directly and the browser back button closes it.
 */
export function useProjectParam() {
  const [repo, setRepo] = useState<string | null>(read)

  useEffect(() => {
    const onPop = () => setRepo(read())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = useCallback((next: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, next)
    window.history.pushState({ project: next }, '', url)
    setRepo(next)
  }, [])

  const close = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete(PARAM)
    window.history.pushState({}, '', url)
    setRepo(null)
  }, [])

  return { repo, open, close }
}

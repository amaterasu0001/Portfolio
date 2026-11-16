import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchContributions, fetchGitHubData, getInitialData, snapshot } from '@/lib/github'
import type { ContributionCalendar, GitHubData } from '@/types'
import { GitHubContext, type GitHubContextValue } from './GitHubContext'

/**
 * Loads GitHub data once for the whole page.
 * The first render uses cached / snapshot data, so nothing waits on the network;
 * live data replaces it when (and if) the API answers.
 */
export function GitHubProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GitHubData>(getInitialData)
  const [refreshing, setRefreshing] = useState(true)
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(snapshot.contributions)
  const [calendarLoading, setCalendarLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchGitHubData().then((next) => {
      if (!active) return
      setData(next)
      setRefreshing(false)
    })
    fetchContributions().then((result) => {
      if (!active) return
      if (result.calendar) setCalendar(result.calendar)
      setCalendarLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  /** Manual retry: bypasses the cache and asks the API again. */
  const refresh = useCallback(() => {
    setRefreshing(true)
    void fetchGitHubData({ force: true }).then((next) => {
      setData(next)
      setRefreshing(false)
    })
  }, [])

  const value = useMemo<GitHubContextValue>(
    () => ({ data, refreshing, refresh, calendar, calendarLoading }),
    [data, refreshing, refresh, calendar, calendarLoading],
  )

  return <GitHubContext value={value}>{children}</GitHubContext>
}

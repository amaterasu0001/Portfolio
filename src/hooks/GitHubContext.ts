import { createContext } from 'react'
import type { ContributionCalendar, GitHubData } from '@/types'

export interface GitHubContextValue {
  data: GitHubData
  /** true while a network refresh is in flight (content is already on screen) */
  refreshing: boolean
  refresh: () => void
  calendar: ContributionCalendar | null
  calendarLoading: boolean
}

export const GitHubContext = createContext<GitHubContextValue | null>(null)

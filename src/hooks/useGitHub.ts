import { use } from 'react'
import { GitHubContext } from './GitHubContext'

export function useGitHub() {
  const context = use(GitHubContext)
  if (!context) throw new Error('useGitHub must be used inside <GitHubProvider>')
  return context
}

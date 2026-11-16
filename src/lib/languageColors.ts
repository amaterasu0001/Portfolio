/** GitHub Linguist colours for the languages that appear in these repositories. */
const COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  C: '#8a8a8a',
  'C++': '#f34b7d',
  'C / C++': '#f34b7d',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#663399',
  'HTML / CSS': '#e34c26',
  PLpgSQL: '#336790',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  CMake: '#DA3434',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  'Objective-C': '#438eff',
  Java: '#b07219',
  Markdown: '#7e818e',
}

export const languageColor = (language: string | null | undefined): string =>
  (language && COLORS[language]) || '#7e818e'

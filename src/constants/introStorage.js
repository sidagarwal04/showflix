/** localStorage key — keep in sync with `Intro` completion logic */
export const INTRO_STORAGE_KEY = 'sidflixIntroSeen'

export function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

/** Clear to replay the intro (dev / QA only). */
export function resetIntroForTesting() {
  try {
    localStorage.removeItem(INTRO_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

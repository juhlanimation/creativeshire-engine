/**
 * Intro dev override helpers.
 *
 * URL-based intro override for dev mode (_intro param).
 */

/** Query param name for intro override */
export const DEV_INTRO_PARAM = '_intro'

/**
 * Get current intro override from URL.
 * Returns 'none' to disable intro, or null for no override.
 */
export function getIntroOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_INTRO_PARAM)
}

/**
 * Set intro override in URL and reload.
 * Intros are one-shot sequences, so a reload is required.
 */
export function setIntroOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_INTRO_PARAM, id)
  } else {
    url.searchParams.delete(DEV_INTRO_PARAM)
  }

  window.location.href = url.toString()
}

/**
 * Resolves the active experience for a site+page.
 *
 * Handles: schema ID resolution, dev override, sync/async loading,
 * store creation, and chrome position filtering.
 */

import { useMemo, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import {
  getExperience,
  getExperienceAsync,
  simpleExperience,
} from '../../experience'
import type { Experience, ExperienceChrome, ExperienceState } from '../../experience/experiences/types'
import { getExperienceOverride } from '../dev/DevExperienceSwitcher'
import { useDevOverride } from './useDevOverride'
import type { SiteSchema, PageSchema } from '../../schema'

export interface ResolvedExperience {
  experience: Experience
  store: StoreApi<ExperienceState>
  /** Schema-level experience ID (before dev override), for DevToolsContainer display */
  schemaExperienceId: string
  beforeChrome: ExperienceChrome[]
  afterChrome: ExperienceChrome[]
  overlayChrome: ExperienceChrome[]
}

export function useResolvedExperience(site: SiteSchema, page: PageSchema): ResolvedExperience {
  // Dev override (reactive — listens for live switching)
  const devOverride = useDevOverride(getExperienceOverride, 'experienceOverrideChange')

  // Resolve experience ID: dev override > page config > site config > fallback
  const schemaExperienceId = page.experience?.id ?? site.experience?.id ?? 'simple'
  const experienceId = (process.env.NODE_ENV === 'development' && devOverride)
    ? devOverride
    : schemaExperienceId

  // Try sync lookup first (for already-loaded experiences)
  const syncExperience = getExperience(experienceId)

  // Track async-loaded experience
  const [asyncExperience, setAsyncExperience] = useState<Experience | null>(null)

  useEffect(() => {
    // If sync lookup worked, no need for async
    if (syncExperience) return

    // Load async and cache
    let cancelled = false
    getExperienceAsync(experienceId).then((exp: Experience | undefined) => {
      if (cancelled) return
      if (!exp) {
        console.warn(
          `[Creativeshire] Unknown experience "${experienceId}", falling back to "simple"`,
        )
        setAsyncExperience(simpleExperience)
      } else {
        setAsyncExperience(exp)
      }
    })

    return () => { cancelled = true }
  }, [experienceId, syncExperience])

  // Use sync experience if available, then async, then fallback to simple
  const experience = syncExperience ?? asyncExperience ?? simpleExperience

  // Create store for this render (memoized to avoid recreating on every render)
  const store = useMemo(() => experience.createStore(), [experience])

  // Filter experience chrome by position for rendering at correct locations
  const beforeChrome = useMemo(
    () => experience.experienceChrome?.filter(c => c.position === 'before') ?? [],
    [experience.experienceChrome],
  )
  const afterChrome = useMemo(
    () => experience.experienceChrome?.filter(c => c.position === 'after') ?? [],
    [experience.experienceChrome],
  )
  const overlayChrome = useMemo(
    () => experience.experienceChrome?.filter(c => c.position === 'overlay') ?? [],
    [experience.experienceChrome],
  )

  return {
    experience,
    store,
    schemaExperienceId,
    beforeChrome,
    afterChrome,
    overlayChrome,
  }
}

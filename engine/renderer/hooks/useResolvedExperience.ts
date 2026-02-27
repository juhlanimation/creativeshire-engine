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
import type { Experience, ExperienceChrome, ExperienceState, BehaviourAssignment } from '../../experience/compositions/types'
import { getExperienceOverride } from '../../experience'
import { useDevOverride } from './useDevOverride'
import { createExperienceStore } from '../../experience/compositions/createExperienceStore'
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

  // Merge preset overrides on top of experience defaults
  // Priority: page config > site config > experience definition
  // With arrays, preset REPLACES (not merges) the experience default for that section
  const mergedExperience = useMemo(() => {
    const presetBehaviours: Record<string, BehaviourAssignment[]> = {
      ...(site.experience?.sectionBehaviours ?? {}),
      ...(page.experience?.sectionBehaviours ?? {}),
    }
    const presetChromeBehaviours: Record<string, BehaviourAssignment[]> = {
      ...(site.experience?.chromeBehaviours ?? {}),
      ...(page.experience?.chromeBehaviours ?? {}),
    }
    // Merge intro: preset intro overrides experience default
    const introOverride = page.experience?.intro ?? site.experience?.intro
    const needsBehaviourMerge = Object.keys(presetBehaviours).length > 0
    const needsChromeMerge = Object.keys(presetChromeBehaviours).length > 0
    const needsIntroMerge = introOverride !== undefined

    if (!needsBehaviourMerge && !needsChromeMerge && !needsIntroMerge) return experience

    const merged = needsBehaviourMerge ? { ...experience.sectionBehaviours } : experience.sectionBehaviours
    if (needsBehaviourMerge) {
      for (const [key, assignments] of Object.entries(presetBehaviours)) {
        (merged as Record<string, BehaviourAssignment[]>)[key] = assignments
      }
    }

    const mergedChrome = needsChromeMerge
      ? { ...(experience.chromeBehaviours ?? {}), ...presetChromeBehaviours }
      : experience.chromeBehaviours

    return {
      ...experience,
      ...(needsBehaviourMerge && { sectionBehaviours: merged }),
      ...(needsChromeMerge && { chromeBehaviours: mergedChrome }),
      ...(needsIntroMerge && { intro: introOverride }),
    }
  }, [experience, site.experience?.sectionBehaviours, page.experience?.sectionBehaviours, site.experience?.chromeBehaviours, page.experience?.chromeBehaviours, site.experience?.intro, page.experience?.intro])

  // Create store for this render (memoized to avoid recreating on every render)
  const store = useMemo(
    () => createExperienceStore(mergedExperience),
    // Store shape only changes when presentation model changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mergedExperience.presentation?.model],
  )

  // Filter experience chrome by position for rendering at correct locations
  const beforeChrome = useMemo(
    () => mergedExperience.experienceChrome?.filter(c => c.position === 'before') ?? [],
    [mergedExperience.experienceChrome],
  )
  const afterChrome = useMemo(
    () => mergedExperience.experienceChrome?.filter(c => c.position === 'after') ?? [],
    [mergedExperience.experienceChrome],
  )
  const overlayChrome = useMemo(
    () => mergedExperience.experienceChrome?.filter(c => c.position === 'overlay') ?? [],
    [mergedExperience.experienceChrome],
  )

  return {
    experience: mergedExperience,
    store,
    schemaExperienceId,
    beforeChrome,
    afterChrome,
    overlayChrome,
  }
}

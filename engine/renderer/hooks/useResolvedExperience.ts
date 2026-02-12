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
import type { Experience, ExperienceChrome, ExperienceState, SectionInjection } from '../../experience/experiences/types'
import { getExperienceOverride } from '../../experience'
import { useDevOverride } from './useDevOverride'
import { useDevExperienceSettings } from '../dev/devSettingsStore'
import type { SiteSchema, PageSchema } from '../../schema'

export interface ResolvedExperience {
  experience: Experience
  store: StoreApi<ExperienceState>
  /** Schema-level experience ID (before dev override), for DevToolsContainer display */
  schemaExperienceId: string
  /** Merged experience settings (defaults + schema + dev overrides) */
  settings: Record<string, unknown>
  beforeChrome: ExperienceChrome[]
  afterChrome: ExperienceChrome[]
  overlayChrome: ExperienceChrome[]
}

export function useResolvedExperience(site: SiteSchema, page: PageSchema): ResolvedExperience {
  // Dev override (reactive — listens for live switching)
  const devOverride = useDevOverride(getExperienceOverride, 'experienceOverrideChange')
  const devExperienceSettings = useDevExperienceSettings()

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

  // Merge preset sectionInjections on top of experience defaults
  // Priority: page config > site config > experience definition
  const mergedExperience = useMemo(() => {
    const presetInjections: Record<string, SectionInjection> = {
      ...(site.experience?.sectionInjections ?? {}),
      ...(page.experience?.sectionInjections ?? {}),
    }
    if (!Object.keys(presetInjections).length) return experience
    const merged = { ...experience.sectionInjections }
    for (const [key, injection] of Object.entries(presetInjections)) {
      merged[key] = { ...(merged[key] ?? {}), ...injection }
    }
    return { ...experience, sectionInjections: merged }
  }, [experience, site.experience?.sectionInjections, page.experience?.sectionInjections])

  // Create store for this render (memoized to avoid recreating on every render)
  const store = useMemo(() => mergedExperience.createStore(), [mergedExperience])

  // Resolve experience settings: defaults from definition → schema overrides → dev overrides
  const resolvedSettings = useMemo(() => {
    // Start with defaults from experience definition
    const defaults: Record<string, unknown> = {}
    if (mergedExperience.settings) {
      for (const [key, config] of Object.entries(mergedExperience.settings) as [string, { default: unknown } | undefined][]) {
        if (config) defaults[key] = config.default
      }
    }

    // Merge schema-level settings (site → page override)
    const schemaSettings = {
      ...(site.experience?.settings ?? {}),
      ...(page.experience?.settings ?? {}),
    }

    // Merge dev overrides (only in development)
    return { ...defaults, ...schemaSettings, ...(devExperienceSettings ?? {}) }
  }, [mergedExperience.settings, site.experience?.settings, page.experience?.settings, devExperienceSettings])

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
    settings: resolvedSettings,
    beforeChrome,
    afterChrome,
    overlayChrome,
  }
}

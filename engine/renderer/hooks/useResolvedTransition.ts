/**
 * Resolves the active page transition configuration for a site+page.
 *
 * Handles: dev override, resolveTransitionConfig helper, TransitionDef lookup,
 * PageTransitionConfig assembly, and schema ID for dev tools.
 */

import {
  getPageTransition,
  getTransitionOverride,
  getRegisteredTransitionConfig,
  findTransitionConfigIdBySchemaConfig,
} from '../../experience/transitions'
import type { TransitionConfig } from '../../schema/transition'
import type { PageTransitionConfig } from '../../experience/experiences/types'
import { useDevOverride } from './useDevOverride'
import type { SiteSchema, PageSchema } from '../../schema'

export interface ResolvedTransition {
  pageTransitionConfig: PageTransitionConfig | undefined
  /** Schema-level transition ID (before dev override), for DevToolsContainer display */
  schemaTransitionId: string
}

/**
 * Resolve which transition config to use.
 * Resolution order: page default → site default → none.
 */
function resolveTransitionConfig(
  site: SiteSchema,
  page: PageSchema,
): TransitionConfig | undefined {
  const pageTransition = page.transition
  if (pageTransition === 'disabled') return undefined

  // 1. Check page default (leaving this page)
  if (pageTransition?.default) return pageTransition.default

  // 2. Site default
  return site.transition
}

export function useResolvedTransition(site: SiteSchema, page: PageSchema): ResolvedTransition {
  // Dev override (one-shot — no event)
  const transitionOverrideId = useDevOverride(getTransitionOverride)

  // Resolve transition config with dev override support
  let resolvedTransitionConfig: TransitionConfig | undefined
  if (transitionOverrideId === 'none') {
    resolvedTransitionConfig = undefined
  } else if (transitionOverrideId) {
    resolvedTransitionConfig = getRegisteredTransitionConfig(transitionOverrideId) ?? undefined
  } else {
    resolvedTransitionConfig = resolveTransitionConfig(site, page)
  }

  const transitionDef = resolvedTransitionConfig
    ? getPageTransition(resolvedTransitionConfig.id)
    : undefined

  const pageTransitionConfig = transitionDef ? {
    defaultExitDuration: (resolvedTransitionConfig!.settings?.exitDuration as number)
      ?? transitionDef.defaults.exitDuration,
    defaultEntryDuration: (resolvedTransitionConfig!.settings?.entryDuration as number)
      ?? transitionDef.defaults.entryDuration,
    timeout: transitionDef.defaults.timeout,
    respectReducedMotion: transitionDef.respectReducedMotion ?? true,
  } satisfies PageTransitionConfig : undefined

  // Compute schema ID for dev tools display
  const schemaTransition = resolveTransitionConfig(site, page)
  const schemaTransitionId = schemaTransition
    ? (findTransitionConfigIdBySchemaConfig(schemaTransition) ?? 'none')
    : 'none'

  return {
    pageTransitionConfig,
    schemaTransitionId,
  }
}

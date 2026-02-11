/**
 * Resolves the active intro configuration for a site+page.
 *
 * Handles: dev override ('none' → null, id → registry lookup, else → schema),
 * pattern lookup, overlay component resolution, and schema ID for dev tools.
 */

import type { ComponentType } from 'react'
import {
  getIntroPattern,
  getIntroOverride,
  getRegisteredIntro,
  findIntroIdByConfig,
} from '../../intro'
import type { IntroConfig } from '../../intro'
import { getChromeComponent } from '../../content/chrome/registry'
import { useDevOverride } from './useDevOverride'
import type { SiteSchema, PageSchema } from '../../schema'

export interface ResolvedIntro {
  introConfig: IntroConfig | null
  introPattern: ReturnType<typeof getIntroPattern>
  overlayComponent: ComponentType | null
  overlayProps: Record<string, unknown> | undefined
  /** Schema-level intro ID (before dev override), for DevToolsContainer display */
  schemaIntroId: string
}

export function useResolvedIntro(site: SiteSchema, page: PageSchema): ResolvedIntro {
  // Dev override (one-shot — no event)
  const introOverrideId = useDevOverride(getIntroOverride)

  // Resolve intro config
  let introConfig: IntroConfig | null
  if (introOverrideId === 'none') {
    introConfig = null
  } else if (introOverrideId) {
    // Look up compiled intro from registry
    introConfig = getRegisteredIntro(introOverrideId) ?? null
  } else {
    introConfig = page.intro === 'disabled' ? null : (page.intro ?? site.intro) ?? null
  }

  const introPattern = introConfig ? getIntroPattern(introConfig.pattern) : null

  // Resolve intro overlay component from chrome registry
  const overlayComponent = introConfig?.overlay
    ? getChromeComponent(introConfig.overlay.component) ?? null
    : null

  // Compute schema ID for dev tools display
  const schemaIntroId = page.intro === 'disabled' || !(page.intro ?? site.intro)
    ? 'none'
    : (findIntroIdByConfig((page.intro ?? site.intro)!) ?? 'none')

  return {
    introConfig,
    introPattern,
    overlayComponent,
    overlayProps: introConfig?.overlay?.props,
    schemaIntroId,
  }
}

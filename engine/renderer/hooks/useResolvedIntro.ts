/**
 * Resolves the active intro configuration for a site+page+experience.
 *
 * Resolution chain: _intro=none → page.intro → site.intro → experience.intro
 * Handles: dev override, overlay component resolution.
 */

import type { ComponentType } from 'react'
import { getIntroOverride, getIntroSequence } from '../../intro'
import type { IntroConfig } from '../../intro'
import type { Experience } from '../../experience/experiences/types'
import { getChromeComponent } from '../../content/chrome/registry'
import { useDevOverride } from './useDevOverride'
import type { SiteSchema, PageSchema } from '../../schema'

export interface ResolvedIntro {
  introConfig: IntroConfig | null
  overlayComponent: ComponentType | null
  overlayProps: Record<string, unknown> | undefined
}

export function useResolvedIntro(
  site: SiteSchema,
  page: PageSchema,
  experience: Experience,
): ResolvedIntro {
  // Dev override (one-shot — no event)
  const introOverrideId = useDevOverride(getIntroOverride)

  // Resolve intro config:
  // Priority: _intro=none → _intro=<sequence-id> → page.intro → site.intro → experience.intro
  let introConfig: IntroConfig | null
  if (introOverrideId === 'none') {
    introConfig = null
  } else if (introOverrideId) {
    introConfig = getIntroSequence(introOverrideId) ?? null
  } else {
    introConfig = page.intro === 'disabled'
      ? null
      : (page.intro ?? site.intro ?? experience.intro) ?? null
  }

  // Resolve intro overlay component from chrome registry
  const overlayComponent = introConfig?.overlay
    ? getChromeComponent(introConfig.overlay.component) ?? null
    : null

  return {
    introConfig,
    overlayComponent,
    overlayProps: introConfig?.overlay?.props,
  }
}

/**
 * Resolves the active intro configuration for a site+page+experience.
 *
 * Resolution chain: _intro=none → page.intro → site.intro → experience.intro
 * Handles: dev override, overlay component resolution.
 */

import { type ComponentType, useMemo } from 'react'
import { getIntroOverride, getIntroSequence, resolvePresetIntro } from '../../intro'
import type { IntroConfig, PresetIntroConfig } from '../../intro'
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
    const raw = page.intro === 'disabled'
      ? null
      : (page.intro ?? site.intro ?? experience.intro) ?? null
    // Resolve PresetIntroConfig (sequence ref) to IntroConfig
    introConfig = raw && 'sequence' in raw
      ? resolvePresetIntro(raw as PresetIntroConfig)
      : (raw as IntroConfig | null)
  }

  // Stabilize introConfig reference by structural content so CMS content edits
  // (which create new schema object references with identical intro values)
  // don't cause the IntroProvider store to recreate and re-lock the page.
  const stableKey = JSON.stringify(introConfig)
  const stableConfig = useMemo(() => introConfig, [stableKey])

  // Resolve intro overlay component from chrome registry
  const overlayComponent = stableConfig?.overlay
    ? getChromeComponent(stableConfig.overlay.component) ?? null
    : null

  return {
    introConfig: stableConfig,
    overlayComponent,
    overlayProps: stableConfig?.overlay?.props,
  }
}

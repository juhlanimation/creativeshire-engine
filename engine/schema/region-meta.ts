/**
 * Region schema metadata for platform UI.
 * Exposes RegionSchema fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

export const regionMeta = defineMeta<Record<string, unknown>>({
  id: 'Region',
  name: 'Region',
  description: 'Chrome region configuration: component, animation, visibility',
  category: 'region',
  icon: 'panel',
  tags: ['region', 'chrome', 'header', 'footer'],

  settings: {
    // ── Component ──────────────────────────────────────────────────────────
    component: {
      type: 'text',
      label: 'Component',
      default: '',
      description: 'Component name to render for this region',
      group: 'Component',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Behaviour',
      default: null,
      description: 'Behaviour configuration for region animation',
      component: 'BehaviourPicker',
      group: 'Animation',
    },
    behaviourOptions: {
      type: 'custom',
      label: 'Behaviour Options',
      default: null,
      description: 'Additional behaviour options',
      component: 'BehaviourOptions',
      group: 'Animation',
    },

    // ── Visibility ─────────────────────────────────────────────────────────
    disabledPages: {
      type: 'custom',
      label: 'Disabled Pages',
      default: [],
      description: 'Pages where this region should be hidden',
      component: 'PageSelector',
      group: 'Visibility',
    },
  },
})

/**
 * Returns settings config for a RegionSchema.
 * @param name - Region name (header/footer/sidebar) for platform context
 */
export function getRegionSettings(_name?: string) {
  return regionMeta.settings!
}

/** Returns group definitions for region settings. */
export function getRegionGroups(): SettingsGroup[] {
  return [
    { id: 'Component', label: 'Component', icon: 'component' },
    { id: 'Animation', label: 'Animation', icon: 'sparkle' },
    { id: 'Visibility', label: 'Visibility', icon: 'eye' },
  ]
}

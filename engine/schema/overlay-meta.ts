/**
 * Overlay schema metadata for platform UI.
 * Exposes OverlaySchema fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

export const overlayMeta = defineMeta<Record<string, unknown>>({
  id: 'Overlay',
  name: 'Overlay',
  description: 'Chrome overlay configuration: component, position, trigger, animation, visibility',
  category: 'overlay',
  icon: 'layers',
  tags: ['overlay', 'chrome', 'modal', 'cursor'],

  settings: {
    // ── Component ──────────────────────────────────────────────────────────
    component: {
      type: 'text',
      label: 'Component',
      default: '',
      description: 'Component name to render for this overlay',
      group: 'Component',
    },

    // ── Layout ─────────────────────────────────────────────────────────────
    position: {
      type: 'select',
      label: 'Position',
      default: 'bottom-right',
      description: 'Screen position for the overlay',
      choices: [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' },
      ],
      group: 'Layout',
    },

    // ── Trigger ────────────────────────────────────────────────────────────
    trigger: {
      type: 'custom',
      label: 'Trigger',
      default: null,
      description: 'Condition for showing/hiding the overlay',
      component: 'TriggerEditor',
      group: 'Trigger',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Behaviour',
      default: null,
      description: 'Behaviour configuration for overlay animation',
      component: 'BehaviourPicker',
      group: 'Animation',
    },

    // ── Visibility ─────────────────────────────────────────────────────────
    disabledPages: {
      type: 'custom',
      label: 'Disabled Pages',
      default: [],
      description: 'Pages where this overlay should be hidden',
      component: 'PageSelector',
      group: 'Visibility',
    },
  },
})

/**
 * Returns settings config for an OverlaySchema.
 * @param name - Overlay name for platform context
 */
export function getOverlaySettings(_name?: string) {
  return overlayMeta.settings!
}

/** Returns group definitions for overlay settings. */
export function getOverlayGroups(): SettingsGroup[] {
  return [
    { id: 'Component', label: 'Component', icon: 'component' },
    { id: 'Layout', label: 'Layout', icon: 'layout' },
    { id: 'Trigger', label: 'Trigger', icon: 'zap' },
    { id: 'Animation', label: 'Animation', icon: 'sparkle' },
    { id: 'Visibility', label: 'Visibility', icon: 'eye' },
  ]
}

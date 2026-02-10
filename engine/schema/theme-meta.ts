/**
 * Theme schema metadata for platform UI.
 * Exposes ThemeSchema fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

export const themeMeta = defineMeta<Record<string, unknown>>({
  id: 'Theme',
  name: 'Theme',
  description: 'Site-wide visual tokens: scrollbar, smooth scroll, typography, section transitions',
  category: 'theme',
  icon: 'palette',
  tags: ['theme', 'global', 'typography', 'scrollbar'],

  settings: {
    // ── Scrollbar ──────────────────────────────────────────────────────────
    'scrollbar.width': {
      type: 'number',
      label: 'Scrollbar Width',
      default: 6,
      description: 'Scrollbar width in pixels',
      min: 0,
      max: 20,
      step: 1,
      group: 'Scrollbar',
    },
    'scrollbar.thumb': {
      type: 'color',
      label: 'Thumb Color',
      default: '',
      description: 'Scrollbar thumb (handle) color',
      group: 'Scrollbar',
    },
    'scrollbar.track': {
      type: 'color',
      label: 'Track Color',
      default: '',
      description: 'Scrollbar track (background) color',
      group: 'Scrollbar',
    },
    'scrollbar.thumbDark': {
      type: 'color',
      label: 'Thumb Color (Dark)',
      default: '',
      description: 'Scrollbar thumb color in dark mode',
      group: 'Scrollbar',
    },
    'scrollbar.trackDark': {
      type: 'color',
      label: 'Track Color (Dark)',
      default: '',
      description: 'Scrollbar track color in dark mode',
      group: 'Scrollbar',
    },

    // ── Smooth Scroll ──────────────────────────────────────────────────────
    'smoothScroll.enabled': {
      type: 'toggle',
      label: 'Enable Smooth Scroll',
      default: true,
      description: 'Enable GSAP ScrollSmoother for butter-smooth scrolling',
      group: 'Smooth Scroll',
    },
    'smoothScroll.smooth': {
      type: 'number',
      label: 'Smoothing (Desktop)',
      default: 1.2,
      description: 'Smoothing intensity for desktop',
      min: 0,
      max: 5,
      step: 0.1,
      group: 'Smooth Scroll',
    },
    'smoothScroll.smoothMac': {
      type: 'number',
      label: 'Smoothing (Mac)',
      default: 0.5,
      description: 'Smoothing intensity for Mac trackpads',
      min: 0,
      max: 5,
      step: 0.1,
      group: 'Smooth Scroll',
    },
    'smoothScroll.effects': {
      type: 'toggle',
      label: 'ScrollTrigger Effects',
      default: true,
      description: 'Enable ScrollTrigger effects like parallax',
      group: 'Smooth Scroll',
    },

    // ── Typography ─────────────────────────────────────────────────────────
    'typography.provider': {
      type: 'select',
      label: 'Font Provider',
      default: 'google',
      description: 'CDN provider for loading web fonts',
      choices: [
        { value: 'google', label: 'Google Fonts' },
        { value: 'bunny', label: 'Bunny Fonts' },
        { value: 'fontshare', label: 'Fontshare' },
      ],
      group: 'Typography',
    },
    'typography.title': {
      type: 'custom',
      label: 'Title Font',
      default: '',
      description: 'Font for titles and headings (--font-title)',
      component: 'FontPicker',
      group: 'Typography',
    },
    'typography.paragraph': {
      type: 'custom',
      label: 'Paragraph Font',
      default: '',
      description: 'Font for body/paragraph text (--font-paragraph)',
      component: 'FontPicker',
      group: 'Typography',
    },
    'typography.ui': {
      type: 'custom',
      label: 'UI Font',
      default: '',
      description: 'Font for UI elements (--font-ui)',
      component: 'FontPicker',
      group: 'Typography',
    },

    // ── Section Transitions ────────────────────────────────────────────────
    'sectionTransition.fadeDuration': {
      type: 'text',
      label: 'Fade Duration',
      default: '0.15s',
      description: 'Section fade transition duration (e.g., "0.15s", "150ms")',
      validation: { maxLength: 50 },
      group: 'Section Transitions',
    },
    'sectionTransition.fadeEasing': {
      type: 'text',
      label: 'Fade Easing',
      default: 'ease-out',
      description: 'Section fade transition easing (e.g., "ease-out", "cubic-bezier(...)")',
      validation: { maxLength: 50 },
      group: 'Section Transitions',
    },
  },
})

/** Returns settings config for ThemeSchema fields. */
export function getThemeSettings() {
  return themeMeta.settings!
}

/** Returns group definitions for theme settings. */
export function getThemeGroups(): SettingsGroup[] {
  return [
    { id: 'Scrollbar', label: 'Scrollbar', icon: 'scroll' },
    { id: 'Smooth Scroll', label: 'Smooth Scroll', icon: 'mouse' },
    { id: 'Typography', label: 'Typography', icon: 'type' },
    { id: 'Section Transitions', label: 'Section Transitions', icon: 'transition' },
  ]
}

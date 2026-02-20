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
    // ── Colors ───────────────────────────────────────────────────────────
    colorTheme: {
      type: 'select',
      label: 'Color Theme',
      default: '',
      description: 'Named color theme (palette populated dynamically from registered themes)',
      choices: [],
      group: 'Colors',
    },
    colorMode: {
      type: 'select',
      label: 'Color Mode',
      default: '',
      description: 'Light or dark (empty = theme default)',
      choices: [
        { value: '', label: 'Theme Default' },
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
      ],
      group: 'Colors',
    },

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
      description: 'Enable smooth scrolling',
      editorHint: 'structural',
      group: 'Smooth Scroll',
    },
    'smoothScroll.provider': {
      type: 'select',
      label: 'Scroll Provider',
      default: 'gsap',
      description: 'Smooth scroll engine',
      choices: [
        { value: 'gsap', label: 'GSAP ScrollSmoother' },
        { value: 'lenis', label: 'Lenis' },
      ],
      editorHint: 'structural',
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
      editorHint: 'structural',
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
      editorHint: 'structural',
      group: 'Smooth Scroll',
    },
    'smoothScroll.effects': {
      type: 'toggle',
      label: 'ScrollTrigger Effects',
      default: true,
      description: 'Enable ScrollTrigger effects like parallax',
      editorHint: 'structural',
      group: 'Smooth Scroll',
    },
    'smoothScroll.lenis.duration': {
      type: 'number',
      label: 'Lenis Duration',
      default: 0.8,
      description: 'Scroll animation duration in seconds',
      min: 0.1,
      max: 3,
      step: 0.1,
      editorHint: 'structural',
      group: 'Smooth Scroll',
    },
    'smoothScroll.lenis.touchMultiplier': {
      type: 'number',
      label: 'Touch Multiplier',
      default: 1.5,
      description: 'Touch scroll sensitivity',
      min: 0.1,
      max: 5,
      step: 0.1,
      editorHint: 'structural',
      group: 'Smooth Scroll',
    },
    'smoothScroll.lenis.wheelMultiplier': {
      type: 'number',
      label: 'Wheel Multiplier',
      default: 1,
      description: 'Wheel scroll sensitivity',
      min: 0.1,
      max: 5,
      step: 0.1,
      editorHint: 'structural',
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
      description: 'Font for display / brand text (--font-title)',
      component: 'FontPicker',
      group: 'Typography',
    },
    'typography.heading': {
      type: 'custom',
      label: 'Heading Font',
      default: '',
      description: 'Font for section headings h1–h3 (--font-heading)',
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
      editorHint: 'structural',
      group: 'Section Transitions',
    },
    'sectionTransition.fadeEasing': {
      type: 'text',
      label: 'Fade Easing',
      default: 'ease-out',
      description: 'Section fade transition easing (e.g., "ease-out", "cubic-bezier(...)")',
      validation: { maxLength: 50 },
      editorHint: 'structural',
      group: 'Section Transitions',
    },

    // ── Container ───────────────────────────────────────────────────────────
    'container.maxWidth': {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum width of site content (e.g., "1920px")',
      validation: { maxLength: 50 },
      group: 'Container',
    },
    'container.outerBackground': {
      type: 'color',
      label: 'Outer Background',
      default: '',
      description: 'Background color outside the container',
      group: 'Container',
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
    { id: 'Colors', label: 'Colors', icon: 'palette' },
    { id: 'Scrollbar', label: 'Scrollbar', icon: 'scroll' },
    { id: 'Smooth Scroll', label: 'Smooth Scroll', icon: 'mouse' },
    { id: 'Typography', label: 'Typography', icon: 'type' },
    { id: 'Section Transitions', label: 'Section Transitions', icon: 'transition' },
    { id: 'Container', label: 'Container', icon: 'maximize' },
  ]
}

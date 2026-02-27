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
    'scrollbar.type': {
      type: 'select',
      label: 'Scrollbar Style',
      description: 'Scrollbar shape',
      group: 'Scrollbar',
      default: '',
      choices: [
        { value: '', label: 'Theme Default' },
        { value: 'thin', label: 'Thin' },
        { value: 'pill', label: 'Pill' },
        { value: 'hidden', label: 'Hidden' },
      ],
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
      type: 'number',
      label: 'Fade Duration',
      default: 0.15,
      description: 'Section fade transition duration in seconds',
      min: 0,
      max: 1,
      step: 0.05,
      editorHint: 'structural',
      group: 'Section Transitions',
    },
    'sectionTransition.fadeEasing': {
      type: 'select',
      label: 'Fade Easing',
      default: 'ease-out',
      description: 'Section fade transition easing',
      choices: [
        { value: 'ease', label: 'Ease' },
        { value: 'ease-in', label: 'Ease In' },
        { value: 'ease-out', label: 'Ease Out' },
        { value: 'ease-in-out', label: 'Ease In Out' },
        { value: 'linear', label: 'Linear' },
      ],
      editorHint: 'structural',
      group: 'Section Transitions',
    },

    // ── Motion ────────────────────────────────────────────────────────────
    'motion.timing.fast': {
      type: 'text',
      label: 'Fast Timing',
      default: '150ms',
      description: 'Duration for fast interactions (hovers, toggles)',
      validation: { maxLength: 20 },
      group: 'Motion',
    },
    'motion.timing.normal': {
      type: 'text',
      label: 'Normal Timing',
      default: '300ms',
      description: 'Duration for standard transitions (fades, slides)',
      validation: { maxLength: 20 },
      group: 'Motion',
    },
    'motion.timing.slow': {
      type: 'text',
      label: 'Slow Timing',
      default: '600ms',
      description: 'Duration for dramatic reveals (page transitions, hero animations)',
      validation: { maxLength: 20 },
      group: 'Motion',
    },
    'motion.easing.default': {
      type: 'select',
      label: 'Default Easing',
      default: 'ease-out',
      description: 'Easing for most transitions',
      choices: [
        { value: 'ease', label: 'Ease' },
        { value: 'ease-in', label: 'Ease In' },
        { value: 'ease-out', label: 'Ease Out' },
        { value: 'ease-in-out', label: 'Ease In Out' },
        { value: 'linear', label: 'Linear' },
      ],
      group: 'Motion',
    },
    'motion.easing.expressive': {
      type: 'text',
      label: 'Expressive Easing',
      default: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      description: 'Overshooting easing for playful/bouncy feel',
      validation: { maxLength: 60 },
      group: 'Motion',
    },
    'motion.easing.smooth': {
      type: 'select',
      label: 'Smooth Easing',
      default: 'ease-in-out',
      description: 'Easing for elegant, understated motion',
      choices: [
        { value: 'ease', label: 'Ease' },
        { value: 'ease-in', label: 'Ease In' },
        { value: 'ease-out', label: 'Ease Out' },
        { value: 'ease-in-out', label: 'Ease In Out' },
        { value: 'linear', label: 'Linear' },
      ],
      group: 'Motion',
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
    'container.sectionGap': {
      type: 'select',
      label: 'Section Gap',
      description: 'Gap between sections (layout preset)',
      group: 'Container',
      default: 'none',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ],
    },
    'container.sectionGapScale': {
      type: 'number',
      label: 'Section Gap Scale',
      description: 'Multiplier for the section gap value',
      group: 'Container',
      default: 1,
      min: 0.25,
      max: 10,
      step: 0.25,
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
    { id: 'Motion', label: 'Motion', icon: 'zap' },
    { id: 'Container', label: 'Container', icon: 'maximize' },
  ]
}

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
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Component',
    },

    // ── Positioning ───────────────────────────────────────────────────────
    overlay: {
      type: 'toggle',
      label: 'Overlay',
      default: true,
      description: 'Float on top of content (true) or take document flow space (false)',
      group: 'Positioning',
    },
    direction: {
      type: 'select',
      label: 'Direction',
      default: 'horizontal',
      description: 'Layout direction. Vertical = sidebar-like',
      choices: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      group: 'Positioning',
    },
    collapsible: {
      type: 'toggle',
      label: 'Collapsible',
      default: false,
      description: 'Auto-hide on scroll down, show on scroll up',
      group: 'Positioning',
    },

    // ── Layout ──────────────────────────────────────────────────────────
    'layout.justify': {
      type: 'select',
      label: 'Justify',
      default: '',
      description: 'Horizontal placement of region content',
      choices: [
        { value: '', label: 'Default' },
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'between', label: 'Space Between' },
        { value: 'around', label: 'Space Around' },
      ],
      group: 'Layout',
    },
    'layout.align': {
      type: 'select',
      label: 'Align',
      default: '',
      description: 'Vertical alignment of region content',
      choices: [
        { value: '', label: 'Default' },
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
      ],
      group: 'Layout',
    },
    'layout.padding': {
      type: 'text',
      label: 'Content Padding',
      default: '',
      description: 'Padding inside the region layout wrapper',
      validation: { maxLength: 200 },
      group: 'Layout',
    },
    'layout.maxWidth': {
      type: 'text',
      label: 'Content Max Width',
      default: '',
      description: 'Maximum width of region content (e.g. var(--site-max-width))',
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Layout',
    },
    'layout.gap': {
      type: 'text',
      label: 'Content Gap',
      default: '',
      description: 'Gap between top-level widgets in the region',
      validation: { maxLength: 200 },
      group: 'Layout',
    },

    // ── Style ─────────────────────────────────────────────────────────────
    constrained: {
      type: 'toggle',
      label: 'Constrain Width',
      default: false,
      description: 'Constrain region content to site max-width',
      group: 'Style',
    },
    colorMode: {
      type: 'select',
      label: 'Color Mode',
      default: '',
      description: 'Force a color mode on this region, overriding the site-level palette',
      choices: [
        { value: '', label: 'Inherit' },
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
      ],
      group: 'Style',
    },
    'style.backgroundColor': {
      type: 'color',
      label: 'Background Color',
      default: '',
      description: 'Region background color (edge-to-edge on wrapper)',
      group: 'Style',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Behaviour',
      default: null,
      description: 'Behaviour configuration for region animation',
      component: 'BehaviourPicker',
      editorHint: 'structural',
      group: 'Animation',
    },
    behaviourOptions: {
      type: 'custom',
      label: 'Behaviour Options',
      default: null,
      description: 'Additional behaviour options',
      component: 'BehaviourOptions',
      editorHint: 'structural',
      group: 'Animation',
    },

    // ── Visibility ─────────────────────────────────────────────────────────
    disabledPages: {
      type: 'custom',
      label: 'Disabled Pages',
      default: [],
      description: 'Pages where this region should be hidden',
      component: 'PageSelector',
      editorHint: 'structural',
      group: 'Visibility',
    },
  },
})

/**
 * Returns settings config for a RegionSchema.
 * @param name - Region name (header/footer) for platform context
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- param reserved for future per-region settings
export function getRegionSettings(_name?: string) {
  return regionMeta.settings!
}

/** Returns group definitions for region settings. */
export function getRegionGroups(): SettingsGroup[] {
  return [
    { id: 'Component', label: 'Component', icon: 'component' },
    { id: 'Positioning', label: 'Positioning', icon: 'layout' },
    { id: 'Layout', label: 'Layout', icon: 'columns' },
    { id: 'Style', label: 'Style', icon: 'paintbrush' },
    { id: 'Animation', label: 'Animation', icon: 'sparkle' },
    { id: 'Visibility', label: 'Visibility', icon: 'eye' },
  ]
}

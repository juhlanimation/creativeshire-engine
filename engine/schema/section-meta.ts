/**
 * Section schema metadata for platform UI.
 * Exposes SectionSchema + LayoutConfig fields as configurable settings.
 */

import { defineMeta } from './meta'
import type { SettingConfig, SettingsGroup } from './settings'

export const sectionMeta = defineMeta<Record<string, unknown>>({
  id: 'Section',
  name: 'Section',
  description: 'Section-level configuration: identity, layout, behaviour',
  category: 'section',
  icon: 'section',
  tags: ['section', 'layout', 'behaviour'],

  settings: {
    // ── Identity ───────────────────────────────────────────────────────────
    id: {
      type: 'text',
      label: 'Section ID',
      default: '',
      description: 'Unique identifier for anchor linking',
      validation: { required: true, maxLength: 100 },
      editorHint: 'structural',
      group: 'Identity',
    },
    label: {
      type: 'text',
      label: 'Label',
      default: '',
      description: 'Human-readable display name for the UI hierarchy',
      validation: { maxLength: 100 },
      editorHint: 'content',
      group: 'Identity',
    },
    patternId: {
      type: 'text',
      label: 'Pattern ID',
      default: '',
      description: 'Pattern that created this section (read-only context)',
      advanced: true,
      validation: { maxLength: 100 },
      editorHint: 'structural',
      group: 'Identity',
    },

    // ── Section (layout) ────────────────────────────────────────────────
    'layout.type': {
      type: 'select',
      label: 'Layout Type',
      default: 'flex',
      description: 'How widgets are arranged within the section',
      choices: [
        { value: 'flex', label: 'Flex' },
        { value: 'grid', label: 'Grid' },
        { value: 'stack', label: 'Stack' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.direction': {
      type: 'select',
      label: 'Direction',
      default: 'column',
      description: 'Flex direction (for flex/stack layouts)',
      choices: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.align': {
      type: 'select',
      label: 'Align',
      default: 'stretch',
      description: 'Cross-axis alignment',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.justify': {
      type: 'select',
      label: 'Justify',
      default: 'start',
      description: 'Main-axis distribution',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'between', label: 'Space Between' },
        { value: 'around', label: 'Space Around' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.gap': {
      type: 'select',
      label: 'Gap',
      default: 'none',
      description: 'Gap between items (layout preset or raw CSS)',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.gapScale': {
      type: 'number',
      label: 'Gap Scale',
      default: 1,
      description: 'Multiplier for the gap value',
      min: 0.25,
      max: 10,
      step: 0.25,
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.padding': {
      type: 'select',
      label: 'Padding',
      default: 'none',
      description: 'Section padding (layout preset or raw CSS)',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ],
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.paddingScale': {
      type: 'number',
      label: 'Padding Scale',
      default: 1,
      description: 'Multiplier for the padding value',
      min: 0.25,
      max: 10,
      step: 0.25,
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.columns': {
      type: 'number',
      label: 'Columns',
      default: 2,
      description: 'Number of grid columns',
      min: 1,
      max: 12,
      step: 1,
      condition: "layout.type === 'grid'",
      editorHint: 'structural',
      group: 'Section',
    },
    'layout.rows': {
      type: 'number',
      label: 'Rows',
      default: 1,
      description: 'Number of grid rows',
      min: 1,
      max: 12,
      step: 1,
      condition: "layout.type === 'grid'",
      editorHint: 'structural',
      group: 'Section',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Behaviour',
      default: null,
      description: 'Behaviour configuration for section animation',
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

    // ── Section (container) ─────────────────────────────────────────────
    paddingTop: {
      type: 'range',
      label: 'Padding Top',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingBottom: {
      type: 'range',
      label: 'Padding Bottom',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingLeft: {
      type: 'range',
      label: 'Padding Left',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingRight: {
      type: 'range',
      label: 'Padding Right',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    sectionHeight: {
      type: 'select',
      label: 'Section Height',
      default: 'auto',
      description: 'Height constraint for the section',
      choices: [
        { value: 'auto', label: 'Auto' },
        { value: 'viewport', label: 'Viewport (flexible)' },
        { value: 'viewport-fixed', label: 'Viewport (locked)' },
      ],
      group: 'Section',
    },
    constrained: {
      type: 'toggle',
      label: 'Constrained',
      default: false,
      description: 'Limit section width to --site-max-width',
      group: 'Section',
    },
    colorMode: {
      type: 'select',
      label: 'Color Mode',
      default: '',
      description: 'Force a color mode on this section, overriding the site-level palette',
      choices: [
        { value: '', label: 'Inherit' },
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
      ],
      group: 'Section',
    },
    sectionTheme: {
      type: 'select',
      label: 'Section Theme',
      default: '',
      description: 'Override the site theme for this section',
      choices: [
        { value: '', label: 'Inherit' },
        { value: 'contrast', label: 'Contrast' },
        { value: 'muted', label: 'Muted' },
        { value: 'editorial', label: 'Editorial' },
        { value: 'neon', label: 'Neon' },
        { value: 'earthy', label: 'Earthy' },
        { value: 'monochrome', label: 'Monochrome' },
        { value: 'crossroad', label: 'Crossroad' },
        { value: 'azuki', label: 'Azuki' },
      ],
      group: 'Section',
    },

    // ── Advanced ───────────────────────────────────────────────────────────
    className: {
      type: 'text',
      label: 'CSS Classes',
      default: '',
      description: 'Additional CSS class names',
      advanced: true,
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Advanced',
    },
  },
})

/** Returns settings config for SectionSchema fields. */
export function getSectionSettings() {
  return sectionMeta.settings!
}

/**
 * Returns section-level container settings for Storybook/CMS merging.
 * Includes both container-level fields (constrained, padding overrides, sectionHeight)
 * and layout fields (type, direction, align, justify, gap, padding + scales).
 */
export function getSectionContainerSettings(): Record<string, SettingConfig> {
  return {
    // ── Section container ────────────────────────────────────────────────
    constrained: {
      type: 'toggle',
      label: 'Constrained',
      default: false,
      description: 'Limit section width to --site-max-width',
      group: 'Section',
    },
    paddingTop: {
      type: 'range',
      label: 'Padding Top',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingBottom: {
      type: 'range',
      label: 'Padding Bottom',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingLeft: {
      type: 'range',
      label: 'Padding Left',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    paddingRight: {
      type: 'range',
      label: 'Padding Right',
      default: 0,
      min: 0,
      max: 500,
      step: 4,
      group: 'Section',
    },
    sectionHeight: {
      type: 'select',
      label: 'Section Height',
      default: 'auto',
      description: 'Height constraint for the section',
      choices: [
        { value: 'auto', label: 'Auto' },
        { value: 'viewport', label: 'Viewport (flexible)' },
        { value: 'viewport-fixed', label: 'Viewport (locked)' },
      ],
      group: 'Section',
    },

    colorMode: {
      type: 'select',
      label: 'Color Mode',
      default: '',
      description: 'Force a color mode on this section, overriding the site-level palette',
      choices: [
        { value: '', label: 'Inherit' },
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
      ],
      group: 'Section',
    },
    sectionTheme: {
      type: 'select',
      label: 'Section Theme',
      default: '',
      description: 'Override the site theme for this section',
      choices: [
        { value: '', label: 'Inherit' },
        { value: 'contrast', label: 'Contrast' },
        { value: 'muted', label: 'Muted' },
        { value: 'editorial', label: 'Editorial' },
        { value: 'neon', label: 'Neon' },
        { value: 'earthy', label: 'Earthy' },
        { value: 'monochrome', label: 'Monochrome' },
        { value: 'crossroad', label: 'Crossroad' },
        { value: 'azuki', label: 'Azuki' },
      ],
      group: 'Section',
    },

    // ── Section layout (inner) ─────────────────────────────────────────
    'layout.type': {
      type: 'select',
      label: 'Layout Type',
      default: 'flex',
      description: 'How widgets are arranged within the section',
      choices: [
        { value: 'flex', label: 'Flex' },
        { value: 'grid', label: 'Grid' },
        { value: 'stack', label: 'Stack' },
      ],
      advanced: true,
      group: 'Section',
    },
    'layout.direction': {
      type: 'select',
      label: 'Direction',
      default: 'column',
      description: 'Flex direction (for flex/stack layouts)',
      choices: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
      ],
      advanced: true,
      group: 'Section',
    },
    'layout.align': {
      type: 'select',
      label: 'Align',
      default: 'stretch',
      description: 'Cross-axis alignment',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
      ],
      advanced: true,
      group: 'Section',
    },
    'layout.justify': {
      type: 'select',
      label: 'Justify',
      default: 'start',
      description: 'Main-axis distribution',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'between', label: 'Space Between' },
        { value: 'around', label: 'Space Around' },
      ],
      advanced: true,
      group: 'Section',
    },
    'layout.gap': {
      type: 'select',
      label: 'Gap',
      default: 'none',
      description: 'Gap between items (layout preset)',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ],
      group: 'Section',
    },
    'layout.gapScale': {
      type: 'number',
      label: 'Gap Scale',
      default: 1,
      description: 'Multiplier for the gap value',
      min: 0.25,
      max: 10,
      step: 0.25,
      advanced: true,
      group: 'Section',
    },
    'layout.padding': {
      type: 'select',
      label: 'Padding',
      default: 'none',
      description: 'Section padding (layout preset)',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ],
      group: 'Section',
    },
    'layout.paddingScale': {
      type: 'number',
      label: 'Padding Scale',
      default: 1,
      description: 'Multiplier for the padding value',
      min: 0.25,
      max: 10,
      step: 0.25,
      advanced: true,
      group: 'Section',
    },
  }
}

/** Returns group definitions for section settings. */
export function getSectionGroups(): SettingsGroup[] {
  return [
    { id: 'Identity', label: 'Identity', icon: 'tag' },
    { id: 'Section', label: 'Section', icon: 'layout' },
    { id: 'Animation', label: 'Animation', icon: 'sparkle' },
    { id: 'Advanced', label: 'Advanced', icon: 'code' },
  ]
}

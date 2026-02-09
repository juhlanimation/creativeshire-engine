/**
 * Section schema metadata for platform UI.
 * Exposes SectionSchema + LayoutConfig fields as configurable settings.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

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
      validation: { required: true },
      group: 'Identity',
    },
    label: {
      type: 'text',
      label: 'Label',
      default: '',
      description: 'Human-readable display name for the UI hierarchy',
      group: 'Identity',
    },
    patternId: {
      type: 'text',
      label: 'Pattern ID',
      default: '',
      description: 'Pattern that created this section (read-only context)',
      advanced: true,
      group: 'Identity',
    },

    // ── Layout ─────────────────────────────────────────────────────────────
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
      group: 'Layout',
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
      group: 'Layout',
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
      group: 'Layout',
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
      group: 'Layout',
    },
    'layout.gap': {
      type: 'spacing',
      label: 'Gap',
      default: 0,
      description: 'Gap between items',
      group: 'Layout',
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
      group: 'Layout',
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
      group: 'Layout',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Behaviour',
      default: null,
      description: 'Behaviour configuration for section animation',
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

    // ── Advanced ───────────────────────────────────────────────────────────
    className: {
      type: 'text',
      label: 'CSS Classes',
      default: '',
      description: 'Additional CSS class names',
      advanced: true,
      group: 'Advanced',
    },
  },
})

/** Returns settings config for SectionSchema fields. */
export function getSectionSettings() {
  return sectionMeta.settings!
}

/** Returns group definitions for section settings. */
export function getSectionGroups(): SettingsGroup[] {
  return [
    { id: 'Identity', label: 'Identity', icon: 'tag' },
    { id: 'Layout', label: 'Layout', icon: 'layout' },
    { id: 'Animation', label: 'Animation', icon: 'sparkle' },
    { id: 'Advanced', label: 'Advanced', icon: 'code' },
  ]
}

/**
 * Section base field metadata for platform UI.
 * Exposes SectionSchema structural fields as configurable settings.
 * Section patterns layer their own settings on top of these base fields.
 */

import { defineMeta } from '../../schema/meta'

export const sectionBaseMeta = defineMeta<Record<string, unknown>>({
  id: 'SectionBase',
  name: 'Section',
  description: 'Base section fields: layout, behaviour, and style',
  category: 'section',
  icon: 'section',
  tags: ['section', 'layout', 'base'],

  settings: {
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
      description: 'Flex/stack direction',
      choices: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
      ],
      condition: "layout.type !== 'grid'",
      group: 'Layout',
    },
    'layout.align': {
      type: 'alignment',
      label: 'Align Items',
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
      type: 'alignment',
      label: 'Justify Content',
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
      validation: { min: 0, max: 500 },
      group: 'Layout',
    },
    'layout.columns': {
      type: 'number',
      label: 'Columns',
      default: 1,
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

    // ── Behaviour ──────────────────────────────────────────────────────────
    behaviour: {
      type: 'custom',
      label: 'Animation',
      default: null,
      description: 'Behaviour configuration for scroll/visibility animation',
      component: 'BehaviourPicker',
      group: 'Behaviour',
    },

    // ── Style ──────────────────────────────────────────────────────────────
    'style.backgroundColor': {
      type: 'color',
      label: 'Background Color',
      default: '',
      description: 'Section background color',
      group: 'Style',
    },
    'style.padding': {
      type: 'spacing',
      label: 'Padding',
      default: '',
      description: 'Section padding',
      validation: { min: 0, max: 500 },
      group: 'Style',
    },
    'style.minHeight': {
      type: 'text',
      label: 'Min Height',
      default: '',
      description: 'Minimum section height (e.g., "100vh", "400px")',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    'style.maxWidth': {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum section content width (e.g., "1200px", "80rem")',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: '',
      description: 'Additional CSS class names',
      validation: { maxLength: 200 },
      advanced: true,
      group: 'Style',
    },
  },
})

/**
 * Region base field metadata for platform UI.
 * Exposes RegionSchema structural fields as configurable settings.
 * Individual region components (Header, Footer) layer their own settings on top.
 */

import { defineMeta } from '../../schema/meta'

export const regionBaseMeta = defineMeta<Record<string, unknown>>({
  id: 'RegionBase',
  name: 'Region',
  description: 'Base region fields: identity, layout, and style',
  category: 'region',
  icon: 'region',
  tags: ['chrome', 'region', 'base'],

  settings: {
    // ── Common ─────────────────────────────────────────────────────────────
    id: {
      type: 'text',
      label: 'Region ID',
      default: '',
      description: 'Unique identifier for the region',
      validation: { maxLength: 100 },
      editorHint: 'structural',
      group: 'Common',
    },
    'style.backgroundColor': {
      type: 'color',
      label: 'Background Color',
      default: '',
      description: 'Region background color',
      group: 'Common',
    },
    'style.padding': {
      type: 'spacing',
      label: 'Padding',
      default: '',
      description: 'Region padding',
      validation: { min: 0, max: 500 },
      group: 'Common',
    },
    'style.maxWidth': {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum region content width',
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Common',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: '',
      description: 'Additional CSS class names',
      validation: { maxLength: 200 },
      advanced: true,
      editorHint: 'structural',
      group: 'Common',
    },

    // ── Header ─────────────────────────────────────────────────────────────
    sticky: {
      type: 'toggle',
      label: 'Sticky',
      default: true,
      description: 'Keep header fixed at top of viewport',
      editorHint: 'structural',
      group: 'Header',
    },
    transparent: {
      type: 'toggle',
      label: 'Transparent',
      default: false,
      description: 'Start with transparent background (e.g., over hero)',
      editorHint: 'structural',
      group: 'Header',
    },
    'style.height': {
      type: 'text',
      label: 'Height',
      default: '',
      description: 'Header height (e.g., "64px", "4rem")',
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Header',
    },

    // ── Footer ─────────────────────────────────────────────────────────────
    'style.minHeight': {
      type: 'text',
      label: 'Min Height',
      default: '',
      description: 'Footer minimum height',
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Footer',
    },

    // ── Sidebar ────────────────────────────────────────────────────────────
    position: {
      type: 'select',
      label: 'Position',
      default: 'left',
      description: 'Sidebar position',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      editorHint: 'structural',
      group: 'Sidebar',
    },
    'style.width': {
      type: 'text',
      label: 'Width',
      default: '',
      description: 'Sidebar width (e.g., "280px", "20rem")',
      validation: { maxLength: 200 },
      editorHint: 'structural',
      group: 'Sidebar',
    },
    collapsible: {
      type: 'toggle',
      label: 'Collapsible',
      default: false,
      description: 'Allow sidebar to collapse on smaller screens',
      editorHint: 'structural',
      group: 'Sidebar',
    },
  },
})

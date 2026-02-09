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
      group: 'Common',
    },
    'style.maxWidth': {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum region content width',
      group: 'Common',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: '',
      description: 'Additional CSS class names',
      advanced: true,
      group: 'Common',
    },

    // ── Header ─────────────────────────────────────────────────────────────
    sticky: {
      type: 'toggle',
      label: 'Sticky',
      default: true,
      description: 'Keep header fixed at top of viewport',
      group: 'Header',
    },
    transparent: {
      type: 'toggle',
      label: 'Transparent',
      default: false,
      description: 'Start with transparent background (e.g., over hero)',
      group: 'Header',
    },
    'style.height': {
      type: 'text',
      label: 'Height',
      default: '',
      description: 'Header height (e.g., "64px", "4rem")',
      group: 'Header',
    },

    // ── Footer ─────────────────────────────────────────────────────────────
    'style.minHeight': {
      type: 'text',
      label: 'Min Height',
      default: '',
      description: 'Footer minimum height',
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
      group: 'Sidebar',
    },
    'style.width': {
      type: 'text',
      label: 'Width',
      default: '',
      description: 'Sidebar width (e.g., "280px", "20rem")',
      group: 'Sidebar',
    },
    collapsible: {
      type: 'toggle',
      label: 'Collapsible',
      default: false,
      description: 'Allow sidebar to collapse on smaller screens',
      group: 'Sidebar',
    },
  },
})

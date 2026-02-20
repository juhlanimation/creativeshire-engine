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

    // ── Layout ──────────────────────────────────────────────────────────────
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
      type: 'spacing',
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

    // ── Positioning ─────────────────────────────────────────────────────────
    overlay: {
      type: 'toggle',
      label: 'Overlay',
      default: true,
      description: 'Float on top of content (true) or take document flow space (false)',
      editorHint: 'structural',
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
      editorHint: 'structural',
      group: 'Positioning',
    },
    collapsible: {
      type: 'toggle',
      label: 'Collapsible',
      default: false,
      description: 'Auto-hide on scroll down, show on scroll up',
      editorHint: 'structural',
      group: 'Positioning',
    },
  },
})

/**
 * Overlay base field metadata for platform UI.
 * Exposes OverlaySchema structural fields as configurable settings.
 * Individual overlay components (Modal, CursorLabel) layer their own settings on top.
 */

import { defineMeta } from '../../schema/meta'

export const overlayBaseMeta = defineMeta<Record<string, unknown>>({
  id: 'OverlayBase',
  name: 'Overlay',
  description: 'Base overlay fields: identity, appearance, animation, and style',
  category: 'overlay',
  icon: 'overlay',
  tags: ['chrome', 'overlay', 'base'],

  settings: {
    // ── Identity ───────────────────────────────────────────────────────────
    id: {
      type: 'text',
      label: 'Overlay ID',
      default: '',
      description: 'Unique identifier for the overlay',
      validation: { maxLength: 100 },
      group: 'Identity',
    },
    type: {
      type: 'text',
      label: 'Type',
      default: '',
      description: 'Overlay type identifier',
      validation: { maxLength: 100 },
      group: 'Identity',
    },

    // ── Appearance ─────────────────────────────────────────────────────────
    backdrop: {
      type: 'toggle',
      label: 'Backdrop',
      default: false,
      description: 'Show a backdrop behind the overlay',
      group: 'Appearance',
    },
    closeButton: {
      type: 'toggle',
      label: 'Close Button',
      default: true,
      description: 'Show a close button',
      group: 'Appearance',
    },
    closeOnBackdrop: {
      type: 'toggle',
      label: 'Close on Backdrop',
      default: true,
      description: 'Close the overlay when clicking the backdrop',
      group: 'Appearance',
    },
    closeOnEsc: {
      type: 'toggle',
      label: 'Close on Escape',
      default: true,
      description: 'Close the overlay when pressing Escape',
      group: 'Appearance',
    },

    // ── Animation ──────────────────────────────────────────────────────────
    'animation.type': {
      type: 'select',
      label: 'Animation Type',
      default: 'fade',
      description: 'Enter/exit animation style',
      choices: [
        { value: 'fade', label: 'Fade' },
        { value: 'slide', label: 'Slide' },
        { value: 'scale', label: 'Scale' },
        { value: 'wipe', label: 'Wipe' },
        { value: 'expand', label: 'Expand' },
      ],
      group: 'Animation',
    },
    'animation.duration': {
      type: 'number',
      label: 'Duration',
      default: 300,
      description: 'Animation duration in milliseconds',
      min: 0,
      max: 2000,
      step: 50,
      group: 'Animation',
    },
    'animation.easing': {
      type: 'text',
      label: 'Easing',
      default: 'ease-out',
      description: 'Animation easing function (e.g., "ease-out", "cubic-bezier(...)")',
      validation: { maxLength: 200 },
      group: 'Animation',
    },

    // ── Style ──────────────────────────────────────────────────────────────
    'style.width': {
      type: 'text',
      label: 'Width',
      default: '',
      description: 'Overlay width',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    'style.maxWidth': {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum overlay width',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    'style.maxHeight': {
      type: 'text',
      label: 'Max Height',
      default: '',
      description: 'Maximum overlay height',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    'style.padding': {
      type: 'spacing',
      label: 'Padding',
      default: '',
      description: 'Overlay padding',
      validation: { min: 0, max: 500 },
      group: 'Style',
    },
    'style.borderRadius': {
      type: 'text',
      label: 'Border Radius',
      default: '',
      description: 'Overlay border radius (e.g., "8px", "0.5rem")',
      validation: { maxLength: 200 },
      group: 'Style',
    },
    'style.backgroundColor': {
      type: 'color',
      label: 'Background Color',
      default: '',
      description: 'Overlay background color',
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

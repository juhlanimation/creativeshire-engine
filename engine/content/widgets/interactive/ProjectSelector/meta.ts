/**
 * ProjectSelector interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ProjectSelectorProps } from './types'

export const meta = defineMeta<ProjectSelectorProps>({
  id: 'ProjectSelector',
  name: 'Project Selector',
  description: 'Thumbnail strip for selecting active project in showcases',
  category: 'interactive',
  icon: 'gallery',
  tags: ['project', 'gallery', 'selector', 'thumbnail'],
  component: true,

  settings: {
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Array of project items',
      validation: { required: true },
      bindable: true,
    },
    activeIndex: {
      type: 'number',
      label: 'Active Index',
      default: 0,
      description: 'Currently selected project index',
      min: 0,
      max: 100,
    },
    orientation: {
      type: 'select',
      label: 'Orientation',
      default: 'horizontal',
      choices: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      description: 'Layout direction',
    },
    showInfo: {
      type: 'toggle',
      label: 'Show Info',
      default: true,
      description: 'Show info card on hover',
    },
    thumbnailWidth: {
      type: 'number',
      label: 'Thumbnail Width',
      default: 120,
      description: 'Inactive thumbnail width in pixels',
      min: 20,
      max: 800,
      advanced: true,
    },
    activeThumbnailWidth: {
      type: 'number',
      label: 'Active Thumbnail Width',
      default: 0,
      description: 'Active thumbnail width in pixels (0 = same as thumbnail width)',
      min: 0,
      max: 800,
      advanced: true,
    },
    accentColor: {
      type: 'text',
      label: 'Accent Color',
      default: '',
      description: 'Accent color for progress bar and indicators',
      validation: { maxLength: 50 },
      advanced: true,
      bindable: true,
    },
    showPlayingIndicator: {
      type: 'toggle',
      label: 'Show Playing Indicator',
      default: false,
      description: 'Show pulsing dot and "Playing" label on active card',
      advanced: true,
    },
    showPlayIcon: {
      type: 'toggle',
      label: 'Show Play Icon',
      default: false,
      description: 'Show play triangle on hover for inactive cards',
      advanced: true,
    },
    showOverlay: {
      type: 'toggle',
      label: 'Show Overlay',
      default: false,
      description: 'Show dark overlay on active/hovered cards',
      advanced: true,
    },
    thumbnailBorder: {
      type: 'text',
      label: 'Thumbnail Border',
      default: '',
      description: 'CSS border value (e.g., 1px solid rgba(255,255,255,0.3))',
      validation: { maxLength: 100 },
      advanced: true,
    },
    thumbnailBorderRadius: {
      type: 'text',
      label: 'Thumbnail Border Radius',
      default: '4px',
      description: 'Border radius for thumbnails',
      validation: { maxLength: 50 },
      advanced: true,
    },
  },
})

/**
 * FlexGalleryCardRepeater repeater widget metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { FlexGalleryCardRepeaterProps } from './types'

export const meta = defineMeta<FlexGalleryCardRepeaterProps>({
  id: 'FlexGalleryCardRepeater',
  name: 'Flex Gallery Card Repeater',
  description: 'Thumbnail strip for selecting active project in showcases',
  category: 'repeater',
  icon: 'gallery',
  tags: ['project', 'gallery', 'selector', 'thumbnail'],
  component: true,
  triggers: ['click'],

  settings: {
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
      default: 192,
      description: 'Inactive thumbnail width in pixels',
      min: 20,
      max: 800,
      advanced: true,
    },
    activeThumbnailWidth: {
      type: 'number',
      label: 'Active Thumbnail Width',
      default: 220,
      description: 'Active thumbnail width in pixels (0 = same as thumbnail width)',
      min: 0,
      max: 800,
      advanced: true,
    },
    accentColor: {
      type: 'select',
      label: 'Accent Color',
      default: 'accent',
      choices: [
        { value: 'accent', label: 'Accent' },
        { value: 'interaction', label: 'Interaction' },
        { value: 'primary', label: 'Primary' },
      ],
      description: 'Semantic color for progress bar and indicators',
      advanced: true,
    },
    showPlayingIndicator: {
      type: 'toggle',
      label: 'Show Playing Indicator',
      default: true,
      description: 'Show pulsing dot and "Playing" label on active card',
      advanced: true,
    },
    showPlayIcon: {
      type: 'toggle',
      label: 'Show Play Icon',
      default: true,
      description: 'Show play icon on hover for inactive cards',
      advanced: true,
    },
    showOverlay: {
      type: 'toggle',
      label: 'Show Overlay',
      default: true,
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
      type: 'select',
      label: 'Thumbnail Border Radius',
      default: 'none',
      choices: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'full', label: 'Full' },
      ],
      description: 'Border radius for thumbnails',
      advanced: true,
    },
  },
})

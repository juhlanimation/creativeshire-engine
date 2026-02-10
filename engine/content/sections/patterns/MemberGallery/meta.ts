/**
 * MemberGallery section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { MemberGalleryProps } from './types'

export const meta = defineSectionMeta<MemberGalleryProps>({
  id: 'MemberGallery',
  name: 'Member Gallery',
  description: 'Fullscreen video showcase with selectable members/portfolio items',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'users',
  tags: ['gallery', 'video', 'members', 'portfolio', 'showcase', 'fullscreen'],
  component: false, // Factory function

  settings: {
    title: {
      type: 'text',
      label: 'Section Title',
      default: '',
      description: 'Optional section title (e.g., "Our Members")',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    members: {
      type: 'custom',
      label: 'Members',
      default: [],
      description: 'Array of member items with name, video, etc.',
      validation: { required: true },
      group: 'Content',
    },
    initialIndex: {
      type: 'range',
      label: 'Initial Selection',
      default: 0,
      min: 0,
      max: 20,
      step: 1,
      description: 'Initially selected member index',
      group: 'Behavior',
    },
    namesDirection: {
      type: 'select',
      label: 'Names Layout',
      default: 'column',
      choices: [
        { value: 'column', label: 'Vertical' },
        { value: 'row', label: 'Horizontal' },
      ],
      description: 'Direction of name list',
      group: 'Layout',
    },
    namesPosition: {
      type: 'select',
      label: 'Names Position',
      default: 'overlay',
      choices: [
        { value: 'overlay', label: 'Overlay (Centered)' },
        { value: 'left', label: 'Left Side' },
        { value: 'right', label: 'Right Side' },
        { value: 'bottom', label: 'Bottom' },
      ],
      description: 'Position of names relative to video',
      group: 'Layout',
    },
    selectionMode: {
      type: 'select',
      label: 'Selection Mode',
      default: 'auto',
      choices: [
        { value: 'auto', label: 'Auto (Hover on desktop, Scroll on mobile)' },
        { value: 'hover', label: 'Hover Only' },
        { value: 'scroll', label: 'Scroll Only' },
      ],
      description: 'How members are selected',
      group: 'Behavior',
    },
    crossfadeDuration: {
      type: 'range',
      label: 'Crossfade Duration (ms)',
      default: 400,
      min: 100,
      max: 1000,
      step: 50,
      description: 'Video crossfade transition duration',
      group: 'Animation',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: '#000000',
      description: 'Section background color',
      group: 'Styling',
    },
  },
})

/**
 * Image widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ImageProps } from './types'

export const meta = defineMeta<ImageProps>({
  id: 'Image',
  name: 'Image',
  description: 'Displays an image with aspect ratio and object fit controls',
  category: 'primitive',
  icon: 'image',
  tags: ['media', 'visual', 'photo'],
  component: true,

  settings: {
    src: {
      type: 'image',
      label: 'Image Source',
      default: '',
      description: 'Image URL or asset path',
      validation: { required: true },
      bindable: true,
    },
    alt: {
      type: 'text',
      label: 'Alt Text',
      default: '',
      description: 'Accessibility description of the image',
      validation: { required: true, maxLength: 200 },
      bindable: true,
    },
    aspectRatio: {
      type: 'select',
      label: 'Aspect Ratio',
      default: '',
      description: 'Image aspect ratio constraint',
      choices: [
        { value: '', label: 'Auto' },
        { value: '1/1', label: 'Square (1:1)' },
        { value: '4/3', label: 'Standard (4:3)' },
        { value: '16/9', label: 'Widescreen (16:9)' },
        { value: '21/9', label: 'Ultrawide (21:9)' },
        { value: '9/16', label: 'Portrait (9:16)' },
        { value: '3/4', label: 'Portrait (3:4)' },
      ],
    },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      default: 'cover',
      description: 'How the image fits within its container',
      choices: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
        { value: 'none', label: 'None' },
      ],
    },
    objectPosition: {
      type: 'text',
      label: 'Object Position',
      default: 'center',
      description: 'Position of the image within container (e.g., center, top, bottom 20%)',
      validation: { maxLength: 50 },
      advanced: true,
    },
    filter: {
      type: 'text',
      label: 'CSS Filter',
      default: '',
      description: 'CSS filter function (e.g., brightness(0) invert(1), grayscale(1))',
      validation: { maxLength: 100 },
      advanced: true,
      bindable: true,
    },
    decorative: {
      type: 'toggle',
      label: 'Decorative',
      default: false,
      description: 'Mark as decorative (hides from screen readers)',
      advanced: true,
    },
  },
})

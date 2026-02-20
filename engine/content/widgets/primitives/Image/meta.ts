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
  triggers: ['mouseenter', 'mouseleave', 'click'],

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
      type: 'select',
      label: 'Object Position',
      default: 'center',
      description: 'Position of the image within its container',
      choices: [
        { value: 'center', label: 'Center' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'top left', label: 'Top Left' },
        { value: 'top right', label: 'Top Right' },
        { value: 'bottom left', label: 'Bottom Left' },
        { value: 'bottom right', label: 'Bottom Right' },
      ],
      advanced: true,
      hidden: true,
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
      hidden: true,
    },
    priority: {
      type: 'toggle',
      label: 'Above Fold',
      default: false,
      description: 'Disables lazy loading and adds high fetch priority for above-the-fold images',
      advanced: true,
    },
    sizes: {
      type: 'text',
      label: 'Sizes Hint',
      default: '',
      description: 'Responsive sizes attribute (e.g., "(max-width: 768px) 100vw, 50vw")',
      validation: { maxLength: 200 },
      advanced: true,
      hidden: true,
    },
  },
})

import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectCompareProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectCompareProps>> = {
  label: 'Project Compare',
  description: 'Before/after video comparison with draggable divider.',
  contentFields: [
    { path: 'logo.src', type: 'image', label: 'Logo Image', required: true },
    { path: 'logo.alt', type: 'text', label: 'Logo Alt Text' },
    { path: 'logo.width', type: 'number', label: 'Logo Width', default: 120 },
    { path: 'studio', type: 'text', label: 'Studio' },
    { path: 'role', type: 'text', label: 'Role' },
    { path: 'beforeVideo', type: 'text', label: 'Before Video URL', required: true },
    { path: 'afterVideo', type: 'text', label: 'After Video URL', required: true },
    { path: 'beforeLabel', type: 'text', label: 'Before Label' },
    { path: 'afterLabel', type: 'text', label: 'After Label' },
    { path: 'description', type: 'textarea', label: 'Description (HTML)' },
  ],
  sampleContent: {
    logo: {
      src: '/images/bishoy-gendi/The21_Logo_Green.webp',
      alt: 'The 21',
      width: 120,
    },
    beforeVideo: '/videos/bishoy-gendi/the21/seq1-tiedown.webm',
    afterVideo: '/videos/bishoy-gendi/the21/seq1-reel.webm',
    beforeLabel: 'Tie-down',
    afterLabel: 'Final',
    description:
      'The 21 is a short animated film shaped by neo-Coptic iconography, produced in collaboration with the global Coptic Community by a team of 70+ artists from more than 24 countries.',
  },
}

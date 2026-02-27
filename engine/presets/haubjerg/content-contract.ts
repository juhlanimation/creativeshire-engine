/**
 * Haubjerg Preset Content Contract
 *
 * Minimal contract — ReactSection components manage their own content.
 * Only site-level head fields are declared for CMS editing.
 */

import { buildContentContract } from '../content-utils'

export const haubjergContentContract = buildContentContract({
  head: {
    label: 'Head',
    description: 'Page title and meta description',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title', required: true, default: 'Studio Dokumentar' },
      { path: 'description', type: 'textarea', label: 'Meta Description', required: true, default: 'Dokumentarisk fotografering — Kerneprodukter, Ambassadører, Workshops' },
    ],
    sampleContent: {
      title: 'Studio Dokumentar',
      description: 'Dokumentarisk fotografering — Kerneprodukter, Ambassadører, Workshops',
    },
  },
})

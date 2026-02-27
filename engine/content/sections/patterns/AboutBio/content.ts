import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { AboutBioProps } from './types'

export const content: SectionContentDeclaration<Partial<AboutBioProps>> = {
  label: 'About Bio',
  description: 'Bio section with photo background and client logo marquee.',
  contentFields: [
    { path: 'bioParagraphs', type: 'textarea', label: 'Biography', required: true, placeholder: 'Full biography text (HTML allowed)' },
    { path: 'signature', type: 'text', label: 'Signature Name', default: 'Alex Morgan' },
    { path: 'photoSrc', type: 'image', label: 'Profile Photo', required: true },
    { path: 'photoAlt', type: 'text', label: 'Profile Photo Alt Text', required: true, placeholder: 'Descriptive alt text for profile photo' },
    {
      path: 'clientLogos',
      type: 'collection',
      label: 'Client Logos',
      itemFields: [
        { path: 'src', type: 'image', label: 'Logo Image', required: true },
        { path: 'alt', type: 'text', label: 'Logo Alt Text', required: true },
        { path: 'name', type: 'text', label: 'Client Name' },
        { path: 'height', type: 'number', label: 'Display Height (px)' },
      ],
    },
  ],
  sampleContent: {
    bioParagraphs: [
      "Over the past decade, I've led animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO.",
      'Today I run a remote-first studio rooted in collaboration and craft. I also take on freelance and consultancy work.',
    ].join('\n\n'),
    signature: 'Alex Morgan',
    photoSrc: '/images/profile-highres.webp',
    photoAlt: 'Alex Morgan - Creative Director & Producer',
    clientLogos: [
      { name: 'Netflix', src: '/clients/netflix-alpha.webp', alt: 'Netflix logo', height: 72 },
      { name: 'Riot Games', src: '/clients/riot-games-logo.webp', alt: 'Riot Games logo', height: 48 },
      { name: 'Supercell', src: '/clients/Supercell-logo-alpha.webp', alt: 'Supercell logo', height: 48 },
    ],
  },
}

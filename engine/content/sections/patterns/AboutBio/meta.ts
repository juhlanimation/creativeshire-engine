/**
 * About section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
import type { AboutBioProps } from './types'

export const meta = defineSectionMeta<AboutBioProps>({
  id: 'AboutBio',
  name: 'About Bio',
  description: 'Bio section with photo background and logo marquee',
  category: 'section',
  sectionCategory: 'about',
  unique: true,
  icon: 'about',
  tags: ['about', 'bio', 'profile', 'marquee'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    bioParagraphs: {
      type: 'custom',
      label: 'Bio Paragraphs',
      default: ["Over the past decade, I've led animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO - first at Sun Creature, now through my own studio, <a href=\"https://crossroad.studio\" target=\"_blank\" rel=\"noopener\">Crossroad</a>.","I was one of the original founders of Sun Creature and spent more than a decade helping shape its growth - guiding dozens of productions and working with hundreds of artists as the studio evolved from a small team to a large international company. I stepped away from the studio in early 2024 to pursue new paths.","Today, <a href=\"https://crossroad.studio\" target=\"_blank\" rel=\"noopener\">Crossroad</a> is a remote-first setup rooted in collaboration and craft. I also take on freelance and consultancy work - always excited to dive in and make strong work with good people."],
      description: 'Array of bio text paragraphs',
      group: 'Content',
    },
    signature: {
      type: 'text',
      label: 'Signature',
      default: 'Bo Juhl',
      description: 'Signature text (e.g., name)',
      validation: { required: true, maxLength: 100 },
      group: 'Content',
    },
    photoSrc: {
      type: 'image',
      label: 'Photo',
      default: '/images/profile-highres.webp',
      description: 'Background photo source',
      validation: { required: true },
      group: 'Media',
    },
    photoAlt: {
      type: 'text',
      label: 'Photo Alt',
      default: 'Bo Juhl - Executive Producer & Editor',
      description: 'Accessibility description for photo',
      validation: { required: true, maxLength: 200 },
      group: 'Media',
    },
    clientLogos: {
      type: 'custom',
      label: 'Client Logos',
      default: [{"name":"Netflix","src":"/clients/netflix-alpha.webp","alt":"Netflix logo","height":72},{"name":"Amazon Studios","src":"/clients/AMZN_STUDIOS - alpha.webp","alt":"Amazon Studios logo","height":48},{"name":"Cartoon Network","src":"/clients/cartoon-network-logo-alpha.webp","alt":"Cartoon Network logo","height":48},{"name":"Riot Games","src":"/clients/riot-games-logo.webp","alt":"Riot Games logo","height":48},{"name":"EA Games","src":"/clients/EA Games - alpha.webp","alt":"EA Games logo","height":58},{"name":"Ubisoft","src":"/clients/ubisoft-black-and-white-alpha.webp","alt":"Ubisoft logo","height":58},{"name":"2K Games","src":"/clients/2K - Games.webp","alt":"2K Games logo","height":48},{"name":"Supercell","src":"/clients/Supercell-logo-alpha.webp","alt":"Supercell logo","height":48},{"name":"Respawn Entertainment","src":"/clients/respawn-entertainment.webp","alt":"Respawn Entertainment logo","height":58},{"name":"Azuki","src":"/clients/azuki-alpha.webp","alt":"Azuki logo","height":48}],
      description: 'Array of client logos for marquee',
      group: 'Marquee',
    },
    marqueeDuration: {
      type: 'number',
      label: 'Marquee Duration',
      default: 120,
      description: 'Animation duration in seconds',
      min: 5,
      max: 120,
      step: 5,
      group: 'Marquee',
      advanced: true,
    },
    invertLogos: {
      type: 'toggle',
      label: 'Invert Logo Colors',
      default: true,
      description: 'Apply inverted color filter to logos (white on dark backgrounds)',
      group: 'Marquee',
    },
    marqueeOffset: {
      type: 'number',
      label: 'Marquee Vertical Position',
      default: 2,
      description: 'Distance from bottom edge (% of section height). 0 = flush bottom.',
      min: 0,
      max: 20,
      step: 0.5,
      group: 'Marquee',
    },

    // Bio layout
    bioMaxWidth: {
      type: 'number',
      label: 'Bio Container Width',
      default: 500,
      description: 'Max width of the bio text container (px)',
      min: 280,
      max: 800,
      step: 10,
      group: 'Layout',
    },
    bioOffset: {
      type: 'number',
      label: 'Bio Vertical Offset',
      default: 0,
      description: 'Push bio content down from top (% of section height). 0 = default position.',
      min: 0,
      max: 30,
      step: 0.5,
      group: 'Layout',
    },

    // Typography
    bioTextScale: textScaleSetting('Bio Text Scale', 'small'),
    signatureScale: textScaleSetting('Signature Scale', 'small'),
  },
})

/**
 * Bojuhl Preset Content Contract
 *
 * Declares what content structure the bojuhl preset expects.
 * Platform adapters must transform source data to match this contract.
 *
 * Binding paths used in preset map to this structure:
 * - {{ content.hero.introText }} → contract.hero.fields.introText
 * - {{ content.projects.featured }} → contract.projects.fields.featured
 */

import type { ContentContract } from '../types'

/**
 * Content contract for the Bojuhl preset.
 * Documents all binding paths and their expected types.
 */
export const bojuhlContentContract: ContentContract = {
  head: {
    type: 'object',
    description: 'Page metadata for SEO',
    required: true,
    fields: {
      title: {
        type: 'string',
        description: 'Page title for browser tab and SEO',
        required: true,
        example: 'Bo Juhl | Executive Producer & Editor',
      },
      description: {
        type: 'string',
        description: 'Meta description for SEO',
        required: true,
        example: 'Award-winning executive producer and editor based in Los Angeles.',
      },
    },
  },

  hero: {
    type: 'object',
    description: 'Hero section with video background and role titles',
    required: true,
    fields: {
      introText: {
        type: 'string',
        description: 'Opening text displayed above roles',
        required: true,
        example: "I'm Bo Juhl",
      },
      roles: {
        type: 'string[]',
        description: 'Role titles displayed as large animated text',
        required: true,
        example: ['EXECUTIVE PRODUCER', 'EDITOR'],
      },
      videoSrc: {
        type: 'string',
        description: 'Background video URL for hero section',
        required: true,
        example: '/videos/hero-reel.mp4',
      },
      scrollIndicatorText: {
        type: 'string',
        description: 'Text shown in scroll indicator',
        required: false,
        example: 'SCROLL',
      },
    },
  },

  about: {
    type: 'object',
    description: 'About section with bio and client logos',
    required: true,
    fields: {
      bioParagraphs: {
        type: 'string',
        description: 'Biography text (can include newlines for paragraphs)',
        required: true,
        example: 'With over 15 years of experience...',
      },
      signature: {
        type: 'string',
        description: 'Signature text at end of bio',
        required: false,
        example: '- Bo',
      },
      photoSrc: {
        type: 'string',
        description: 'Profile photo URL',
        required: true,
        example: '/images/profile.jpg',
      },
      photoAlt: {
        type: 'string',
        description: 'Alt text for profile photo',
        required: true,
        example: 'Bo Juhl profile photo',
      },
      clientLogos: {
        type: 'object[]',
        description: 'Client logos for marquee display',
        required: false,
        itemShape: {
          src: { type: 'string', description: 'Logo image URL', required: true },
          alt: { type: 'string', description: 'Logo alt text', required: true },
          name: { type: 'string', description: 'Client name', required: false },
          height: { type: 'number', description: 'Logo height in pixels', required: false },
        },
      },
    },
  },

  projects: {
    type: 'object',
    description: 'Projects section with featured grid and other projects gallery',
    required: true,
    fields: {
      featured: {
        type: 'object[]',
        description: 'Featured projects shown in large card grid',
        required: true,
        itemShape: {
          id: { type: 'string', description: 'Unique project ID', required: true },
          title: { type: 'string', description: 'Project title', required: true },
          description: { type: 'string', description: 'Project description', required: true },
          role: { type: 'string', description: 'Role on project', required: true },
          year: { type: 'string', description: 'Year completed', required: true },
          client: { type: 'string', description: 'Client name', required: false },
          studio: { type: 'string', description: 'Studio name', required: false },
          thumbnailSrc: { type: 'string', description: 'Thumbnail image URL', required: true },
          thumbnailAlt: { type: 'string', description: 'Thumbnail alt text', required: false },
          videoSrc: { type: 'string', description: 'Preview video URL', required: false },
          videoUrl: { type: 'string', description: 'Full video URL for modal', required: false },
        },
      },
      other: {
        type: 'object[]',
        description: 'Other projects shown in expandable gallery',
        required: false,
        itemShape: {
          id: { type: 'string', description: 'Unique project ID', required: true },
          title: { type: 'string', description: 'Project title', required: true },
          role: { type: 'string', description: 'Role on project', required: true },
          year: { type: 'string', description: 'Year completed', required: true },
          client: { type: 'string', description: 'Client name', required: false },
          studio: { type: 'string', description: 'Studio name', required: false },
          thumbnailSrc: { type: 'string', description: 'Thumbnail image URL', required: true },
          thumbnailAlt: { type: 'string', description: 'Thumbnail alt text', required: false },
          videoSrc: { type: 'string', description: 'Preview video URL', required: false },
          videoUrl: { type: 'string', description: 'Full video URL for modal', required: false },
        },
      },
      otherHeading: {
        type: 'string',
        description: 'Heading for other projects section',
        required: false,
        example: 'OTHER SELECTED PROJECTS',
      },
      yearRange: {
        type: 'string',
        description: 'Year range display string',
        required: false,
        example: '2019 - 2024',
      },
    },
  },

  footer: {
    type: 'object',
    description: 'Footer section with contact and studio info',
    required: true,
    fields: {
      navLinks: {
        type: 'object[]',
        description: 'Navigation links in footer',
        required: false,
        itemShape: {
          label: { type: 'string', description: 'Link text', required: true },
          href: { type: 'string', description: 'Link URL', required: true },
        },
      },
      contactHeading: {
        type: 'string',
        description: 'Contact section heading',
        required: false,
        example: 'Contact',
      },
      email: {
        type: 'string',
        description: 'Contact email address',
        required: true,
        example: '<email>',
      },
      linkedinUrl: {
        type: 'string',
        description: 'LinkedIn profile URL',
        required: false,
        example: 'https://linkedin.com/in/bojuhl',
      },
      studioHeading: {
        type: 'string',
        description: 'Studio section heading',
        required: false,
        example: 'Studio',
      },
      studioUrl: {
        type: 'string',
        description: 'Studio website URL',
        required: false,
        example: 'https://studio.com',
      },
      studioUrlLabel: {
        type: 'string',
        description: 'Display text for studio URL',
        required: false,
        example: 'studio.com',
      },
      studioEmail: {
        type: 'string',
        description: 'Studio contact email',
        required: false,
        example: '<email>',
      },
      studioSocials: {
        type: 'object[]',
        description: 'Studio social media links',
        required: false,
        itemShape: {
          platform: { type: 'string', description: 'Platform name', required: true },
          url: { type: 'string', description: 'Profile URL', required: true },
        },
      },
      copyright: {
        type: 'string',
        description: 'Copyright text',
        required: false,
        example: '© 2024 Bo Juhl',
      },
    },
  },

  contact: {
    type: 'object',
    description: 'Floating contact prompt content',
    required: true,
    fields: {
      promptText: {
        type: 'string',
        description: 'Call-to-action text',
        required: true,
        example: "Have an exciting project?\nLet's work together.",
      },
      email: {
        type: 'string',
        description: 'Email for copy-to-clipboard',
        required: true,
        example: '<email>',
      },
    },
  },
}

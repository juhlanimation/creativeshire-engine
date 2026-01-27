/**
 * Home page schema.
 * Bo Juhl portfolio landing page.
 */

import type { PageSchema } from '../../creativeshire/schema'
import {
  createHeroSection,
  createAboutSection,
  createFeaturedProjectsSection,
  createOtherProjectsSection,
} from '../../creativeshire/content/sections/composites'

/**
 * Home page configuration.
 * Uses section composites with Bo Juhl content.
 */
export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: 'Bo Juhl | Executive Producer & Editor',
    description: 'Executive Producer & Editor based in Copenhagen. Commercial, documentary, and branded content.',
  },
  sections: [
    createHeroSection({
      introText: "I'm Bo Juhl",
      roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
      videoSrc: '/videos/hero-reel.mp4',
      videoPoster: '/images/hero-poster.jpg',
      scrollIndicatorText: '(SCROLL)',
    }),
    createAboutSection({
      bioParagraphs: [
        "Executive Producer & Editor with over 15 years of experience in commercial, documentary, and branded content.",
        "Currently working with Crossroad Studio on award-winning projects for global brands.",
      ],
      links: [
        { text: 'Crossroad Studio', href: 'https://crossroadstudio.com' },
      ],
      signature: 'Bo Juhl',
      photoSrc: '/images/bo-portrait.jpg',
      photoAlt: 'Bo Juhl portrait',
      clientLogos: [
        { name: 'Nike', src: '/logos/nike.svg', alt: 'Nike logo' },
        { name: 'Apple', src: '/logos/apple.svg', alt: 'Apple logo' },
        { name: 'Google', src: '/logos/google.svg', alt: 'Google logo' },
        { name: 'Spotify', src: '/logos/spotify.svg', alt: 'Spotify logo' },
      ],
    }),
    createFeaturedProjectsSection({
      projects: [
        {
          thumbnailSrc: '/images/projects/project-1.jpg',
          thumbnailAlt: 'Project 1 thumbnail',
          videoSrc: '/videos/project-1.mp4',
          client: 'Client Name',
          studio: 'Crossroad Studio',
          title: 'Featured Project One',
          description: 'A compelling story about brand transformation and creative excellence.',
          year: '2024',
          role: 'Executive Producer',
        },
        {
          thumbnailSrc: '/images/projects/project-2.jpg',
          thumbnailAlt: 'Project 2 thumbnail',
          videoSrc: '/videos/project-2.mp4',
          client: 'Another Client',
          studio: 'Crossroad Studio',
          title: 'Featured Project Two',
          description: 'Award-winning documentary exploring human connection.',
          year: '2023',
          role: 'Producer & Editor',
        },
      ],
    }),
    createOtherProjectsSection({
      heading: 'OTHER PROJECTS',
      yearRange: '2020 - 2024',
      projects: [
        {
          thumbnailSrc: '/images/projects/other-1.jpg',
          thumbnailAlt: 'Other project 1',
          title: 'Short Project',
          client: 'Brand',
          studio: 'Studio',
          year: '2024',
          role: 'Editor',
        },
      ],
    }),
  ],
}

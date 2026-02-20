/**
 * FeaturedProjects section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectFeaturedProps } from './types'

export const meta = defineSectionMeta<ProjectFeaturedProps>({
  id: 'ProjectFeatured',
  name: 'Project Featured',
  description: 'Featured projects grid with alternating layout ProjectCards',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  requiredOverlays: ['VideoModal'],
  icon: 'projects',
  tags: ['portfolio', 'projects', 'grid', 'featured'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    projects: {
      type: 'custom',
      label: 'Featured Projects',
      default: [{"thumbnailSrc":"/images/01-elements-of-time/thumbnail.webp","thumbnailAlt":"Elements of Time thumbnail","videoSrc":"/videos/01-elements-of-time/hover.webm","videoUrl":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4","client":"AZUKI","studio":"CROSSROAD STUDIO","title":"ELEMENTS OF TIME","description":"The film brings to life the Elementals' four domains, blending anime-inspired storytelling with the timeless craft of Swiss watchmaking.","year":"2025","role":"Executive Producer, Producer"},{"thumbnailSrc":"/images/02-tower-reveal/thumbnail.webp","thumbnailAlt":"Tower Reveal thumbnail","videoSrc":"/videos/02-tower-reveal/hover.webm","videoUrl":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4","client":"SUPERCELL","studio":"SUN CREATURE","title":"TOWER REVEAL","description":"A two-film campaign announcing Tower Troops, a new card type that introduces a fresh defensive strategy to Clash Royale. The spots positioned Tower Troops as a significant evolution of the Clash Royale meta.","year":"2024","role":"Executive Producer"},{"thumbnailSrc":"/images/01-elements-of-time/thumbnail.webp","thumbnailAlt":"Arcane Season 2 thumbnail","videoSrc":"/videos/01-elements-of-time/hover.webm","videoUrl":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4","client":"RIOT GAMES","studio":"FORTICHE","title":"ARCANE SEASON 2","description":"The highly anticipated continuation of the groundbreaking animated series. A visually stunning exploration of the conflict between Piltover and Zaun, pushing the boundaries of animation storytelling.","year":"2024","role":"Executive Producer"}],
      description: 'Array of featured project data',
    },
    startReversed: {
      type: 'toggle',
      label: 'Start Reversed',
      default: false,
      description: 'First project has thumbnail on the right',
    },
  },
})

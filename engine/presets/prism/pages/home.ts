/**
 * Prism preset home page template.
 * Uses factory functions for pattern sections, passing content bindings + style overrides.
 *
 * 8 sections in infinite-carousel layout:
 * 1. Showreel - Fullscreen video (custom, stays inline)
 * 2. About - Transparent scroll anchor (custom, stays inline)
 * 3. Azuki Elementals - ProjectGallery
 * 4. Boy Mole Fox Horse - ProjectShowcase with FlexButtonRepeater
 * 5. THE 21 - ProjectCompare (before/after)
 * 6. Clash Royale - ProjectVideoGrid
 * 7. Riot Games - ProjectExpand
 * 8. Projects I Like - ProjectTabs
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 */

import type { PageSchema, SectionSchema } from '../../../schema'
import {
  createProjectGallerySection,
  createProjectShowcaseSection,
  createProjectCompareSection,
  createProjectVideoGridSection,
  createProjectExpandSection,
  createProjectTabsSection,
} from '../../../content/sections/patterns'

// =============================================================================
// Section 1: Showreel - Fullscreen video hero (custom, no pattern)
// =============================================================================

const showreelSection: SectionSchema = {
  id: 'showreel',
  label: 'Showreel',
  layout: {
    type: 'stack',
    direction: 'column',
  },
  style: {
    height: '100dvh',
  },
  className: 'section-showreel',
  widgets: [
    {
      id: 'showreel-video',
      type: 'Video',
      props: {
        src: '{{ content.showreel.videoSrc }}',
        poster: '{{ content.showreel.videoPoster }}',
        posterTime: '{{ content.showreel.posterTime }}',
        preload: 'auto',
        background: true,
      },
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        objectFit: 'cover',
        width: '100%',
        height: '100dvh',
      },
    },
  ],
}

// =============================================================================
// Section 2: About - Transparent scroll anchor (custom, no pattern)
// =============================================================================

const aboutSection: SectionSchema = {
  id: 'about',
  label: 'About',
  layout: {
    type: 'flex',
    direction: 'column',
    align: 'center',
    justify: 'center',
  },
  style: {
    height: '100dvh',
    background: 'transparent',
  },
  className: 'section-about section-about--transparent',
  widgets: [],
}

// =============================================================================
// Section 3: Azuki Elementals - ProjectGallery
// =============================================================================

const azukiElementalsSection = createProjectGallerySection({
  id: 'azuki-elementals',
  label: 'Azuki Elementals',
  sectionTheme: 'azuki',
  logo: {
    src: '{{ content.azukiElementals.logo.src }}',
    alt: '{{ content.azukiElementals.logo.alt }}',
  },
  logoFilter: '{{ content.azukiElementals.logo.filter }}',
  projects: '{{ content.azukiElementals.projects }}',
  backgroundColor: '{{ content.azukiElementals.backgroundColor }}',
  thumbnailWidth: 192,
  activeThumbnailWidth: 220,
  accentColor: '{{ content.azukiElementals.accentColor }}',
  thumbnailBorder: '2px solid #ffffff',
  thumbnailBorderRadius: 'none',
  contentBorder: '2px solid #ffffff',
  socialLinks: '{{ content.azukiElementals.socialLinks }}',
  textColor: 'light',
})

// =============================================================================
// Section 4: Boy Mole Fox Horse - ProjectShowcase
// =============================================================================

const boyMoleFoxHorseSection = createProjectShowcaseSection({
  id: 'boy-mole-fox-horse',
  label: 'Boy Mole Fox Horse',
  sectionTheme: 'boy-mole',
  logo: {
    src: '{{ content.boyMoleFoxHorse.logo.src }}',
    alt: '{{ content.boyMoleFoxHorse.logo.alt }}',
    width: '{{ content.boyMoleFoxHorse.logo.width }}' as unknown as number,
  },
  studio: '{{ content.boyMoleFoxHorse.studio }}',
  role: '{{ content.boyMoleFoxHorse.role }}',
  videoSrc: '{{ content.boyMoleFoxHorse.videoSrc }}',
  videoPoster: '{{ content.boyMoleFoxHorse.videoPoster }}',
  posterTime: '{{ content.boyMoleFoxHorse.posterTime }}',
  shots: '{{ content.boyMoleFoxHorse.shots }}',
  colorMode: 'light',
  socialLinks: '{{ content.boyMoleFoxHorse.socialLinks }}',
  textColor: 'dark',
})

// =============================================================================
// Section 5: THE 21 - ProjectCompare
// =============================================================================

const the21Section = createProjectCompareSection({
  id: 'the21-seq1',
  label: 'THE 21',
  sectionTheme: 'the21',
  logo: {
    src: '{{ content.the21.logo.src }}',
    alt: '{{ content.the21.logo.alt }}',
    width: '{{ content.the21.logo.width }}' as unknown as number,
  },
  studio: '{{ content.the21.studio }}',
  role: '{{ content.the21.role }}',
  beforeVideo: '{{ content.the21.beforeVideo }}',
  afterVideo: '{{ content.the21.afterVideo }}',
  beforeLabel: '{{ content.the21.beforeLabel }}',
  afterLabel: '{{ content.the21.afterLabel }}',
  videoBackground: '{{ content.the21.videoBackground }}',
  description: '{{ content.the21.description }}',
  colorMode: 'light',
  contentBackground: '{{ content.the21.contentBackground }}',
  descriptionColor: '{{ content.the21.descriptionColor }}',
  socialLinks: '{{ content.the21.socialLinks }}',
  textColor: 'dark',
})

// =============================================================================
// Section 6: Clash Royale - ProjectVideoGrid
// =============================================================================

const clashRoyaleSection = createProjectVideoGridSection({
  id: 'clash-royale',
  label: 'Clash Royale',
  sectionTheme: 'supercell',
  colorMode: 'dark',
  logo: {
    src: '{{ content.clashRoyale.logo.src }}',
    alt: '{{ content.clashRoyale.logo.alt }}',
    width: '{{ content.clashRoyale.logo.width }}' as unknown as number,
  },
  videos: '{{ content.clashRoyale.videos }}',
  socialLinks: '{{ content.clashRoyale.socialLinks }}',
  textColor: 'light',
})

// =============================================================================
// Section 7: Riot Games - ProjectExpand
// =============================================================================

const riotGamesSection = createProjectExpandSection({
  id: 'riot-games',
  label: 'Riot Games',
  sectionTheme: 'riot-games',
  logo: {
    src: '{{ content.riotGames.logo.src }}',
    alt: '{{ content.riotGames.logo.alt }}',
    width: '{{ content.riotGames.logo.width }}' as unknown as number,
  },
  videos: '{{ content.riotGames.videos }}',
  galleryHeight: '24rem',
  cursorLabel: 'PLAY',
  galleryOn: { click: 'modal.open' },
  socialLinks: '{{ content.riotGames.socialLinks }}',
  textColor: 'light',
})

// =============================================================================
// Section 8: Projects I Like - ProjectTabs
// =============================================================================

const projectsILikeSection = createProjectTabsSection({
  id: 'projects-i-like',
  label: 'Projects I Like',
  tabs: '{{ content.projectsILike.tabs }}',
  defaultTab: '{{ content.projectsILike.defaultTab }}',
  externalLink: {
    url: '{{ content.projectsILike.externalLink.url }}',
    label: '{{ content.projectsILike.externalLink.label }}',
  },
  style: {
    backgroundColor: '{{ content.projectsILike.backgroundColor }}' as unknown as string,
  },
})

// =============================================================================
// Page Template
// =============================================================================

/**
 * Home page template with binding expressions.
 * Platform resolves bindings before rendering.
 */
export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}',
  },
  sections: [
    showreelSection,
    aboutSection,
    azukiElementalsSection,
    boyMoleFoxHorseSection,
    the21Section,
    clashRoyaleSection,
    riotGamesSection,
    projectsILikeSection,
  ],
}

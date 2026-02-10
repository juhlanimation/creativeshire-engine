/**
 * Bishoy Gendi preset home page template.
 * Defines section schemas with binding expressions.
 *
 * 8 sections in infinite-carousel layout:
 * 1. Showreel - Fullscreen video (pinned)
 * 2. About - Transparent scroll anchor (FixedCard overlay)
 * 3. Azuki Elementals - ProjectGallery
 * 4. Boy Mole Fox Horse - ProjectShowcase with ShotIndicator
 * 5. THE 21 - ProjectCompare (before/after)
 * 6. Clash Royale - ProjectVideoGrid
 * 7. Riot Games - ProjectExpand
 * 8. Projects I Like - ProjectTabs
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 */

import type { PageSchema, SectionSchema } from '../../../schema'

// =============================================================================
// Section 1: Showreel - Fullscreen video hero
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
  pinned: true,
  widgets: [
    {
      id: 'showreel-video',
      type: 'Video',
      props: {
        src: '{{ content.showreel.videoSrc }}',
        poster: '{{ content.showreel.videoPoster }}',
        posterTime: '{{ content.showreel.posterTime }}',
        autoplay: true,
        loop: true,
        muted: true,
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
// Section 2: About - Transparent scroll anchor (card rendered by FixedCard overlay)
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
// Section 3: Azuki Elementals - ProjectGallery style
// =============================================================================

const azukiElementalsSection: SectionSchema = {
  id: 'azuki-elementals',
  label: 'Azuki Elementals',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.azukiElementals.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-gallery',
  widgets: [
    // Header with logo
    {
      id: 'azuki-header',
      type: 'Flex',
      props: { direction: 'row', align: 'center' },
      className: 'project-gallery__header',
      widgets: [
        {
          id: 'azuki-logo',
          type: 'Image',
          props: {
            src: '{{ content.azukiElementals.logo.src }}',
            alt: '{{ content.azukiElementals.logo.alt }}',
            decorative: false,
            filter: '{{ content.azukiElementals.logo.filter }}',
          },
          style: {
            width: '{{ content.azukiElementals.logo.width }}',
          },
        },
      ],
    },
    // Video area with selector overlay
    {
      id: 'azuki-video-area',
      type: 'Box',
      className: 'project-gallery__video-area',
      widgets: [
        // Main video
        {
          id: 'azuki-main-video',
          type: 'Video',
          props: {
            src: '{{ content.azukiElementals.mainVideo.src }}',
            poster: '{{ content.azukiElementals.mainVideo.poster }}',
            posterTime: '{{ content.azukiElementals.mainVideo.posterTime }}',
            autoplay: true,
            loop: true,
            muted: true,
            preload: 'auto',
            aspectRatio: '16/9',
          },
          className: 'project-gallery__video',
        },
        // Project selector thumbnails - overlays bottom of video
        {
          id: 'azuki-selector',
          type: 'ProjectSelector',
          props: {
            activeIndex: 0,
            orientation: 'horizontal',
            showInfo: true,
            thumbnailWidth: 192,
            activeThumbnailWidth: 220,
            accentColor: '{{ content.azukiElementals.accentColor }}',
            showPlayingIndicator: true,
            showPlayIcon: true,
            showOverlay: true,
            thumbnailBorder: '1px solid rgba(255,255,255,0.3)',
            thumbnailBorderRadius: '0px',
          },
          className: 'project-gallery__selector',
          widgets: [
            {
              __repeat: '{{ content.azukiElementals.projects }}',
              id: 'project-item',
              type: 'GalleryThumbnail',
              props: {
                thumbnailSrc: '{{ item.thumbnail }}',
                thumbnailAlt: '{{ item.title }}',
                videoSrc: '{{ item.video }}',
                title: '{{ item.title }}',
                year: '{{ item.year }}',
                studio: '{{ item.studio }}',
                role: '{{ item.role }}',
                posterTime: '{{ item.posterTime }}',
              },
            },
          ],
        },
      ],
    },
    // Section footer
    {
      id: 'azuki-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'light',
      },
    },
  ],
}

// =============================================================================
// Section 4: Boy Mole Fox Horse - ProjectShowcase with ShotIndicator
// =============================================================================

const boyMoleFoxHorseSection: SectionSchema = {
  id: 'boy-mole-fox-horse',
  label: 'Boy Mole Fox Horse',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.boyMoleFoxHorse.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-showcase',
  widgets: [
    // Header with logo and info
    {
      id: 'bmfh-header',
      type: 'Flex',
      props: { direction: 'row', align: 'center', justify: 'between' },
      className: 'project-showcase__header',
      widgets: [
        {
          id: 'bmfh-logo',
          type: 'Image',
          props: {
            src: '{{ content.boyMoleFoxHorse.logo.src }}',
            alt: '{{ content.boyMoleFoxHorse.logo.alt }}',
            decorative: false,
          },
          style: { width: '{{ content.boyMoleFoxHorse.logo.width }}' },
        },
        {
          id: 'bmfh-info',
          type: 'Flex',
          props: { direction: 'column', align: 'end', gap: '0.25rem' },
          widgets: [
            {
              type: 'Text',
              props: { content: '{{ content.boyMoleFoxHorse.studio }}', as: 'span' },
              className: 'project-showcase__studio',
            },
            {
              type: 'Text',
              props: { content: '{{ content.boyMoleFoxHorse.role }}', as: 'span' },
              className: 'project-showcase__role',
            },
          ],
        },
      ],
    },
    // Video container with shot indicator
    {
      id: 'bmfh-video-container',
      type: 'Box',
      className: 'project-showcase__video-container',
      widgets: [
        {
          id: 'bmfh-video',
          type: 'Video',
          props: {
            src: '{{ content.boyMoleFoxHorse.videoSrc }}',
            poster: '{{ content.boyMoleFoxHorse.videoPoster }}',
            posterTime: '{{ content.boyMoleFoxHorse.posterTime }}',
            autoplay: true,
            loop: true,
            muted: true,
            preload: 'auto',
            aspectRatio: '16/9',
          },
          className: 'project-showcase__video',
        },
        // Shot indicator - uses __repeat for hierarchy visibility
        {
          id: 'bmfh-shots',
          type: 'ShotIndicator',
          props: {
            position: 'top-right',
          },
          widgets: [
            {
              __repeat: '{{ content.boyMoleFoxHorse.shots }}',
              id: 'shot-marker',
              type: 'Button',
              props: {
                label: '{{ item.frame }}',
                'data-video-src': '{{ item.videoSrc }}',
              },
              className: 'shot-indicator__marker',
            },
          ],
        },
      ],
    },
    // Section footer
    {
      id: 'bmfh-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'dark',
      },
    },
  ],
}

// =============================================================================
// Section 5: THE 21 - ProjectCompare (before/after wipe)
// =============================================================================

const the21Section: SectionSchema = {
  id: 'the21-seq1',
  label: 'THE 21',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.the21.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-compare',
  widgets: [
    // Header with logo
    {
      id: 'the21-header',
      type: 'Flex',
      props: { direction: 'row', align: 'center' },
      className: 'project-compare__header',
      widgets: [
        {
          id: 'the21-logo',
          type: 'Image',
          props: {
            src: '{{ content.the21.logo.src }}',
            alt: '{{ content.the21.logo.alt }}',
            decorative: false,
          },
          style: { width: '{{ content.the21.logo.width }}' },
        },
      ],
    },
    // VideoCompare widget
    {
      id: 'the21-compare',
      type: 'VideoCompare',
      props: {
        beforeSrc: '{{ content.the21.beforeVideo }}',
        afterSrc: '{{ content.the21.afterVideo }}',
        beforeLabel: '{{ content.the21.beforeLabel }}',
        afterLabel: '{{ content.the21.afterLabel }}',
        aspectRatio: '16/9',
        initialPosition: 50,
      },
      className: 'project-compare__video',
    },
    // Description
    {
      id: 'the21-description',
      type: 'Text',
      props: {
        content: '{{ content.the21.description }}',
        as: 'p',
        html: true,
      },
      className: 'project-compare__description',
    },
    // Section footer
    {
      id: 'the21-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'dark',
      },
    },
  ],
}

// =============================================================================
// Section 6: Clash Royale - ProjectVideoGrid (2x2 mixed aspect)
// =============================================================================

const clashRoyaleSection: SectionSchema = {
  id: 'clash-royale',
  label: 'Clash Royale',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.clashRoyale.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-video-grid',
  widgets: [
    // Header with logo
    {
      id: 'clash-header',
      type: 'Flex',
      props: { direction: 'row', align: 'center' },
      className: 'project-video-grid__header',
      widgets: [
        {
          id: 'clash-logo',
          type: 'Image',
          props: {
            src: '{{ content.clashRoyale.logo.src }}',
            alt: '{{ content.clashRoyale.logo.alt }}',
            decorative: false,
          },
          style: { width: '{{ content.clashRoyale.logo.width }}' },
        },
      ],
    },
    // Video grid (2 columns with __repeat)
    {
      id: 'clash-grid',
      type: 'Grid',
      props: { columns: 2, gap: '0.5rem' },
      className: 'project-video-grid__grid',
      widgets: [
        // Left column
        {
          id: 'clash-left-col',
          type: 'Flex',
          props: { direction: 'column', gap: '0.5rem' },
          className: 'project-video-grid__column project-video-grid__column--left',
          widgets: [
            {
              __repeat: '{{ content.clashRoyale.videos }}',
              condition: "{{ item.column === 'left' }}",
              id: 'clash-left-video',
              type: 'Video',
              props: {
                src: '{{ item.src }}',
                hoverPlay: true,
                aspectRatio: '{{ item.aspectRatio }}',
                alt: '{{ item.title }}',
              },
              className: 'project-video-grid__video',
            },
          ],
        },
        // Right column
        {
          id: 'clash-right-col',
          type: 'Flex',
          props: { direction: 'column', gap: '0.5rem' },
          className: 'project-video-grid__column project-video-grid__column--right',
          widgets: [
            {
              __repeat: '{{ content.clashRoyale.videos }}',
              condition: "{{ item.column === 'right' }}",
              id: 'clash-right-video',
              type: 'Video',
              props: {
                src: '{{ item.src }}',
                hoverPlay: true,
                aspectRatio: '{{ item.aspectRatio }}',
                alt: '{{ item.title }}',
              },
              className: 'project-video-grid__video',
            },
          ],
        },
      ],
    },
    // Section footer
    {
      id: 'clash-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'light',
      },
    },
  ],
}

// =============================================================================
// Section 7: Riot Games - ProjectExpand (expandable gallery)
// =============================================================================

const riotGamesSection: SectionSchema = {
  id: 'riot-games',
  label: 'Riot Games',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.riotGames.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-expand',
  widgets: [
    // Header with logo
    {
      id: 'riot-header',
      type: 'Flex',
      props: { direction: 'row', align: 'center' },
      className: 'project-expand__header',
      widgets: [
        {
          id: 'riot-logo',
          type: 'Image',
          props: {
            src: '{{ content.riotGames.logo.src }}',
            alt: '{{ content.riotGames.logo.alt }}',
            decorative: false,
          },
          style: { width: '{{ content.riotGames.logo.width }}' },
        },
      ],
    },
    // Expandable gallery row
    {
      id: 'riot-gallery',
      type: 'ExpandableGalleryRow',
      props: {
        height: '24rem',
        gap: '4px',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: 'PLAY',
      },
      className: 'project-expand__gallery',
      widgets: [
        {
          __repeat: '{{ content.riotGames.videos }}',
          id: 'riot-thumbnail',
          type: 'GalleryThumbnail',
          props: {
            thumbnailSrc: '{{ item.thumbnailSrc }}',
            thumbnailAlt: '{{ item.thumbnailAlt }}',
            videoSrc: '{{ item.videoSrc }}',
            title: '{{ item.title }}',
          },
        },
      ],
    },
    // Section footer
    {
      id: 'riot-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'light',
      },
    },
  ],
}

// =============================================================================
// Section 8: Projects I Like - ProjectTabs (tabbed collection)
// =============================================================================

const projectsILikeSection: SectionSchema = {
  id: 'projects-i-like',
  label: 'Projects I Like',
  layout: {
    type: 'flex',
    direction: 'column',
    justify: 'between',
  },
  style: {
    backgroundColor: '{{ content.projectsILike.backgroundColor }}',
    minHeight: '100dvh',
    padding: '2rem',
  },
  className: 'section-project-tabs',
  widgets: [
    // Tabbed content - uses __repeat for hierarchy visibility
    {
      id: 'pil-tabs',
      type: 'TabbedContent',
      props: {
        defaultTab: '{{ content.projectsILike.defaultTab }}',
        position: 'top',
        align: 'center',
      },
      className: 'project-tabs__container',
      widgets: [
        {
          __repeat: '{{ content.projectsILike.tabs }}',
          id: 'tab-panel',
          type: 'Box',
          props: {
            'data-tab-id': '{{ item.id }}',
            'data-tab-label': '{{ item.label }}',
          },
          className: 'tabbed-content__panel',
          widgets: [
            {
              __repeat: '{{ item.videos }}',
              id: 'tab-video',
              type: 'Video',
              props: {
                src: '{{ item.src }}',
                alt: '{{ item.title }}',
                hoverPlay: true,
              },
            },
          ],
        },
      ],
    },
    // Optional external link (e.g. Instagram)
    {
      id: 'pil-external',
      type: 'Link',
      props: {
        href: '{{ content.projectsILike.externalLink.url }}',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      className: 'project-tabs__external-link',
      widgets: [
        {
          type: 'Text',
          props: { content: '{{ content.projectsILike.externalLink.label }}' },
        },
      ],
    },
    // Section footer
    {
      id: 'pil-footer',
      type: 'SectionFooter',
      props: {
        email: '{{ content.contact.email }}',
        instagram: '{{ content.contact.instagram }}',
        linkedin: '{{ content.contact.linkedin }}',
        displayName: '{{ content.contact.displayName }}',
        textColor: 'light',
      },
    },
  ],
}

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

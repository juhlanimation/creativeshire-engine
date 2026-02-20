/**
 * Preview defaults for Storybook stories.
 * Sample props so every widget renders visibly in isolation.
 *
 * Mirrors app/dev/components/registry/preview-defaults.tsx
 * but without React/JSX (pure data for Storybook args).
 */

import type { WidgetSchema } from '../../engine/schema'

// =============================================================================
// Colored box helpers for layout widget previews
// =============================================================================

const BOX_COLORS = [
  'rgba(99, 102, 241, 0.35)',
  'rgba(236, 72, 153, 0.35)',
  'rgba(34, 197, 94, 0.35)',
  'rgba(251, 191, 36, 0.35)',
  'rgba(14, 165, 233, 0.35)',
  'rgba(168, 85, 247, 0.35)',
]

function coloredBox(index: number, extraStyle?: Record<string, unknown>): WidgetSchema {
  return {
    type: 'Box',
    id: `preview-box-${index}`,
    style: {
      background: BOX_COLORS[index % BOX_COLORS.length],
      borderRadius: '4px',
      border: '1px solid rgba(255,255,255,0.1)',
      minHeight: '48px',
      minWidth: '40px',
      ...extraStyle,
    },
  } as WidgetSchema
}

// =============================================================================
// Preview Props Map
// =============================================================================

/**
 * Sample props keyed by widget type.
 * Used by autoStory() to populate Storybook args.
 */
export const PREVIEW_DEFAULTS: Record<string, Record<string, unknown>> = {
  // Primitives
  Text: { content: 'The quick brown fox jumps over the lazy dog.', as: 'p' },
  Image: {
    src: 'https://picsum.photos/seed/engine-preview/800/500',
    alt: 'Sample image',
  },
  Icon: {
    name: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    size: 32,
  },
  Button: { label: 'Button' },
  Link: { href: '#', children: 'Navigation Link' },

  // Layout
  Flex: {
    direction: 'row',
    gap: 12,
    widgets: [
      coloredBox(0, { width: '80px' }),
      coloredBox(1, { width: '80px' }),
      coloredBox(2, { width: '80px' }),
    ],
  },
  Stack: {
    gap: 12,
    widgets: [coloredBox(0), coloredBox(1), coloredBox(2)],
  },
  Grid: {
    columns: 3,
    gap: 12,
    widgets: [
      coloredBox(0), coloredBox(1), coloredBox(2),
      coloredBox(3), coloredBox(4), coloredBox(5),
    ],
  },
  Split: {
    ratio: '2:1',
    gap: 12,
    widgets: [
      coloredBox(0, { minHeight: '80px' }),
      coloredBox(1, { minHeight: '80px' }),
    ],
  },
  Box: {
    widgets: [coloredBox(0, { minHeight: '60px' })],
  },
  Container: {
    maxWidth: '600px',
    widgets: [coloredBox(3, { minHeight: '60px' })],
  },

  // Interactive
  Video: {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-preview/800/450',
    autoplay: true,
    muted: true,
  },
  VideoPlayer: {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/videoplayer/800/450',
  },
  EmailCopy: { email: 'hello@example.com', variant: 'flip', label: 'How can I help you?' },
  Marquee: {
    duration: 30,
    gap: 24,
    widgets: [
      coloredBox(0, { width: '120px' }),
      coloredBox(1, { width: '120px' }),
      coloredBox(2, { width: '120px' }),
      coloredBox(3, { width: '120px' }),
    ],
  },

  ExpandRowImageRepeater: {
    projects: [
      { id: 'p1', thumbnailSrc: 'https://picsum.photos/seed/egr1/400/300', thumbnailAlt: 'Project 1', title: 'Project A', client: 'Client X', studio: 'Studio A', year: '2024', role: 'Director' },
      { id: 'p2', thumbnailSrc: 'https://picsum.photos/seed/egr2/400/300', thumbnailAlt: 'Project 2', title: 'Project B', client: 'Client Y', studio: 'Studio B', year: '2023', role: 'Editor' },
      { id: 'p3', thumbnailSrc: 'https://picsum.photos/seed/egr3/400/300', thumbnailAlt: 'Project 3', title: 'Project C', client: 'Client Z', studio: 'Studio C', year: '2024', role: 'Producer' },
    ],
  },

  // Section-scoped widgets (keyed by scoped name)
  'AboutBio__MarqueeImageRepeater': {
    logos: [
      { src: 'https://picsum.photos/seed/logo1/120/40', alt: 'Logo 1' },
      { src: 'https://picsum.photos/seed/logo2/120/40', alt: 'Logo 2' },
      { src: 'https://picsum.photos/seed/logo3/120/40', alt: 'Logo 3' },
      { src: 'https://picsum.photos/seed/logo4/120/40', alt: 'Logo 4' },
    ],
  },
  'ProjectCompare__VideoCompare': {
    beforePoster: 'https://picsum.photos/seed/vc-before/800/450',
    afterPoster: 'https://picsum.photos/seed/vc-after/800/450',
  },
  'ProjectGallery__FlexGalleryCardRepeater': {
    projects: [
      { id: 'p1', title: 'Project Alpha', thumbnail: 'https://picsum.photos/seed/proj1/200/120' },
      { id: 'p2', title: 'Project Beta', thumbnail: 'https://picsum.photos/seed/proj2/200/120' },
      { id: 'p3', title: 'Project Gamma', thumbnail: 'https://picsum.photos/seed/proj3/200/120' },
    ],
  },
  'ProjectShowcase__FlexButtonRepeater': {
    activeIndex: 0,
    prefix: 'sh',
  },
  'ProjectTabs__TabbedContent': {
    tabs: [
      { id: 'tab1', label: 'Overview' },
      { id: 'tab2', label: 'Details' },
      { id: 'tab3', label: 'Gallery' },
    ],
    defaultTab: 'tab1',
  },
  'TeamShowcase__StackVideoShowcase': {
    labelText: 'We are',
    widgets: [
      {
        type: 'Box',
        id: 'preview-member-1',
        props: {
          name: 'Alex Rivera',
          videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          videoPoster: 'https://picsum.photos/seed/member1/1280/720',
        },
      },
      {
        type: 'Box',
        id: 'preview-member-2',
        props: {
          name: 'Jordan Chen',
          videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          videoPoster: 'https://picsum.photos/seed/member2/1280/720',
        },
      },
      {
        type: 'Box',
        id: 'preview-member-3',
        props: {
          name: 'Sam Taylor',
          videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          videoPoster: 'https://picsum.photos/seed/member3/1280/720',
        },
      },
      {
        type: 'Box',
        id: 'preview-member-4',
        props: {
          name: 'Morgan Blake',
          videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          videoPoster: 'https://picsum.photos/seed/member4/1280/720',
        },
      },
    ],
  },

  // Pattern widgets (factory functions)
  ProjectCard: {
    thumbnailSrc: 'https://picsum.photos/seed/pc-thumb/800/500',
    thumbnailAlt: 'Project thumbnail',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    client: 'ACME STUDIOS',
    studio: 'CROSSROAD STUDIO',
    title: 'PROJECT TITLE',
    description: 'A visually stunning exploration pushing the boundaries of animation storytelling and creative direction.',
    year: '2024',
    role: 'Executive Producer',
  },

  // Chrome regions
  Header: {
    siteTitle: 'STUDIO',
    navLinks: [
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    background: 'transparent',
    color: '#ffffff',
  },
  Footer: {
    navLinks: [
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    contactHeading: 'GET IN TOUCH',
    contactEmail: 'hello@studio.com',
    contactLinkedin: 'https://linkedin.com/in/example',
    studioHeading: 'FIND MY STUDIO',
    studioUrl: 'https://studio.com',
    studioEmail: 'info@studio.com',
    copyrightText: '\u00a9 2024 Studio. All rights reserved.',
  },
}

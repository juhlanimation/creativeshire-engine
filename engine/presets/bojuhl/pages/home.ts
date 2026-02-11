/**
 * Bojuhl preset home page template.
 * Defines section schemas with binding expressions.
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 *
 * Note: We don't use factory functions here because they would execute
 * at module import time before bindings can be resolved.
 */

import type { PageSchema, SectionSchema } from '../../../schema'
import type { HeroTextStyles } from '../../../content/sections/patterns/Hero/types'

/**
 * Bojuhl-specific hero text styles.
 * Large display typography with blend mode for video overlay effect.
 */
export const bojuhlHeroStyles: HeroTextStyles = {
  intro: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: 'clamp(0.875rem, 0.125rem + 1cqw, 1rem)',
    fontWeight: 500,
    letterSpacing: '0.05em',
    color: 'white',
    mixBlendMode: 'difference'
  },
  roleTitle: {
    fontFamily: 'var(--font-title, Inter, system-ui, sans-serif)',
    fontSize: 'clamp(2rem, 6cqw, 6rem)',
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'white',
    mixBlendMode: 'difference'
  }
}

/**
 * Hero section schema with binding expressions.
 */
const heroSection: SectionSchema = {
  id: 'hero',
  label: 'Hero',
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'start'
  },
  style: {
    maxWidth: 'none',
  },
  widgets: [
    {
      id: 'hero-video',
      type: 'Video',
      props: {
        src: '{{ content.hero.videoSrc }}',
        autoplay: true,
        loop: true,
        muted: true,
        background: true
      }
    },
    {
      id: 'hero-content',
      type: 'Flex',
      props: {
        direction: 'column',
        align: 'start',
        justify: 'end'
      },
      widgets: [
        {
          id: 'hero-intro',
          type: 'Text',
          props: {
            content: '{{ content.hero.introText }}',
            as: 'p'
          },
          style: bojuhlHeroStyles.intro
        },
        {
          id: 'hero-roles',
          type: 'HeroRoles',
          props: {
            firstAs: 'h1',
            restAs: 'h2'
          },
          // Style applied to each role text
          style: bojuhlHeroStyles.roleTitle,
          // Uses __repeat for hierarchy visibility
          widgets: [
            {
              __repeat: '{{ content.hero.roles }}',
              id: 'role',
              type: 'Text',
              props: {
                content: '{{ item }}'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'hero-scroll',
      type: 'Text',
      props: {
        content: '{{ content.hero.scrollIndicatorText }}',
        as: 'span'
      },
      style: bojuhlHeroStyles.scrollIndicator
    }
  ]
}

/**
 * About section schema with binding expressions.
 */
const aboutSection: SectionSchema = {
  id: 'about',
  label: 'About',
  constrained: true,
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'stretch'
  },
  style: {
    backgroundColor: 'rgb(0, 0, 0)'
  },
  behaviour: 'scroll/fade',
  widgets: [
    // Mobile background
    {
      id: 'about-mobile-bg',
      type: 'Box',
      props: {},
      widgets: [
        {
          id: 'about-mobile-bg-image',
          type: 'Image',
          props: {
            src: '{{ content.about.photoSrc }}',
            alt: '',
            decorative: true
          }
        }
      ]
    },
    // Main content
    {
      id: 'about-content',
      type: 'Flex',
      props: { direction: 'row' },
      widgets: [
        // Bio column
        {
          id: 'about-bio-column',
          type: 'Box',
          props: {},
          widgets: [
            {
              id: 'about-bio-inner',
              type: 'Box',
              props: {},
              widgets: [
                {
                  id: 'about-bio-text',
                  type: 'Text',
                  props: {
                    content: '{{ content.about.bioParagraphs }}',
                    as: 'p',
                    html: true
                  }
                },
                {
                  id: 'about-signature',
                  type: 'Text',
                  props: {
                    content: '{{ content.about.signature }}',
                    as: 'p',
                    variant: 'signature'
                  }
                }
              ]
            }
          ]
        },
        // Image column
        {
          id: 'about-image-column',
          type: 'Box',
          props: {},
          widgets: [
            {
              id: 'about-image',
              type: 'Image',
              props: {
                src: '{{ content.about.photoSrc }}',
                alt: '{{ content.about.photoAlt }}'
              }
            }
          ]
        }
      ]
    },
    // Gradient overlay
    {
      id: 'about-gradient',
      type: 'Box',
      props: {}
    },
    // Logo marquee - uses __repeat for hierarchy visibility
    {
      id: 'about-logos',
      type: 'LogoMarquee',
      props: {
        duration: 43,
        logoWidth: 120,
        logoGap: 96
      },
      widgets: [
        {
          __repeat: '{{ content.about.clientLogos }}',
          id: 'logo-box',
          type: 'Box',
          props: {},
          style: {
            width: '120px',
            height: '72px',
            marginRight: '96px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          widgets: [
            {
              id: 'logo-img',
              type: 'Image',
              props: {
                src: '{{ item.src }}',
                alt: '{{ item.alt }}',
                decorative: true,
                objectFit: 'contain'
              },
              style: {
                width: 'auto',
                height: '{{ item.height }}px',
                maxWidth: '120px',
                filter: 'brightness(0) invert(1)',
                opacity: 0.5
              }
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Featured projects section schema with binding expressions.
 * Uses __repeat for platform expansion - enables hierarchy panel editing.
 */
const featuredProjectsSection: SectionSchema = {
  id: 'projects',
  label: 'Featured Projects',
  constrained: true,
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'stretch'
  },
  style: {
    backgroundColor: '#fff'
  },
  widgets: [
    {
      id: 'featured-projects-content',
      type: 'Flex',
      className: 'featured-projects__content',
      props: {
        direction: 'column',
        align: 'stretch'
      },
      widgets: [
        {
          // Template widget - platform expands via __repeat
          __repeat: '{{ content.projects.featured }}',
          id: 'project-card',
          type: 'Flex',
          className: 'project-card',
          'data-index': '{{ item.$index }}', // Index for computing reversed state
          props: {
            align: 'start'
          },
          widgets: [
            // Thumbnail column
            {
              id: 'project-card-thumbnail-col',
              type: 'Box',
              className: 'project-card__thumbnail-column',
              widgets: [
                {
                  id: 'project-card-thumbnail',
                  type: 'Video',
                  props: {
                    src: '{{ item.videoSrc }}',
                    poster: '{{ item.thumbnailSrc }}',
                    alt: '{{ item.thumbnailAlt }}',
                    hoverPlay: true,
                    aspectRatio: '16/9',
                    videoUrl: '{{ item.videoUrl }}'
                    // modalAnimationType computed by Video from --card-reversed CSS variable
                  },
                  on: { click: 'open-video-modal' }
                },
                {
                  id: 'project-card-meta',
                  type: 'Flex',
                  className: 'project-card__meta',
                  props: { direction: 'row' },
                  widgets: [
                    {
                      type: 'Text',
                      props: { content: 'Client {{ item.client }}', as: 'span' },
                      className: 'project-card__meta-item'
                    },
                    {
                      type: 'Text',
                      props: { content: 'Studio {{ item.studio }}', as: 'span' },
                      className: 'project-card__meta-item'
                    }
                  ]
                }
              ]
            },
            // Content column
            {
              id: 'project-card-content',
              type: 'Box',
              className: 'project-card__content',
              widgets: [
                {
                  type: 'Text',
                  props: { content: '{{ item.title }}', as: 'h3' },
                  className: 'project-card__title'
                },
                {
                  type: 'Text',
                  props: { content: '{{ item.description }}', as: 'p' },
                  className: 'project-card__description'
                },
                {
                  type: 'Text',
                  props: { content: '{{ item.year }}', as: 'p' },
                  className: 'project-card__year'
                },
                {
                  type: 'Text',
                  props: { content: '{{ item.role }}', as: 'p' },
                  className: 'project-card__role'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Other projects section schema with binding expressions.
 */
const otherProjectsSection: SectionSchema = {
  id: 'other-projects',
  label: 'Other Projects',
  constrained: true,
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'stretch',
    gap: 0
  },
  style: {
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  className: 'other-projects-section',
  widgets: [
    // Header
    {
      id: 'other-projects-header',
      type: 'Flex',
      className: 'other-projects-header',
      props: {
        direction: 'column',
        align: 'stretch',
        gap: 0
      },
      widgets: [
        {
          id: 'other-projects-heading',
          type: 'Text',
          props: {
            content: '{{ content.projects.otherHeading }}',
            as: 'h2'
          },
          className: 'other-projects-heading'
        },
        {
          id: 'other-projects-year-range',
          type: 'Text',
          props: {
            content: '{{ content.projects.yearRange }}',
            as: 'span'
          },
          className: 'other-projects-year-range'
        }
      ]
    },
    // Gallery - uses __repeat for hierarchy visibility
    {
      id: 'other-projects-gallery',
      type: 'ExpandableGalleryRow',
      props: {
        height: '32rem',
        gap: '4px',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: 'WATCH'
      },
      on: { click: 'open-video-modal' },
      widgets: [
        {
          __repeat: '{{ content.projects.other }}',
          id: 'gallery-item',
          type: 'GalleryThumbnail',
          props: {
            thumbnailSrc: '{{ item.thumbnailSrc }}',
            thumbnailAlt: '{{ item.thumbnailAlt }}',
            videoSrc: '{{ item.videoSrc }}',
            videoUrl: '{{ item.videoUrl }}',
            title: '{{ item.title }}',
            client: '{{ item.client }}',
            studio: '{{ item.studio }}',
            year: '{{ item.year }}',
            role: '{{ item.role }}'
          }
        }
      ]
    }
  ]
}

/**
 * Home page template with binding expressions.
 * Platform resolves bindings before rendering.
 */
export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}'
  },
  sections: [
    heroSection,
    aboutSection,
    featuredProjectsSection,
    otherProjectsSection
  ]
}

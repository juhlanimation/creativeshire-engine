/**
 * Port-12 preset home page template.
 * Defines section schemas with binding expressions.
 *
 * 4 sections in smooth-scroll layout:
 * 1. Hero - Fullscreen video with title overlay (HeroVideo widget)
 * 2. Om - About section with scattered photo collage
 * 3. Medlemmer - Team member video showcase (TeamShowcase widget)
 * 4. Medlemskab - Pricing plans + contact sub-section
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 */

import type { PageSchema, SectionSchema } from '../../../schema'

// =============================================================================
// Section 1: Hero - Fullscreen video with title
// =============================================================================

const heroSection: SectionSchema = {
  id: 'hero',
  label: 'Hero',
  layout: { type: 'stack', direction: 'column' },
  style: { height: '100dvh', position: 'relative', overflow: 'hidden' },
  widgets: [
    {
      id: 'hero-video',
      type: 'HeroVideo',
      props: {
        src: '{{ content.hero.videoSrc }}',
        loopStartTime: '{{ content.hero.loopStartTime }}',
        title: '{{ content.hero.title }}',
        tagline: '{{ content.hero.tagline }}',
        scrollIndicatorText: '{{ content.hero.scrollIndicatorText }}',
        externalReveal: true,
      },
    },
  ],
}

// =============================================================================
// Section 2: Om (About) - Text with scattered photo collage
// =============================================================================

const omSection: SectionSchema = {
  id: 'om',
  label: 'Om PORT12',
  layout: { type: 'stack', direction: 'column' },
  className: 'section-om',
  widgets: [
    // Text block with corner-border
    {
      id: 'om-text',
      type: 'Text',
      props: { content: '{{ content.about.text }}', as: 'p' },
      className: 'om-text corner-border',
    },
    // 4 images (use __repeat on about.images)
    {
      __repeat: '{{ content.about.images }}',
      id: 'om-image',
      type: 'Image',
      props: {
        src: '{{ item.src }}',
        alt: '{{ item.alt }}',
        decorative: false,
      },
      className: 'om-image',
    },
  ],
}

// =============================================================================
// Section 3: Medlemmer (Team) - Video showcase
// =============================================================================

const medlemmerSection: SectionSchema = {
  id: 'medlemmer',
  label: 'Medlemmer',
  layout: { type: 'stack', direction: 'column' },
  className: 'section-medlemmer',
  widgets: [
    {
      id: 'team-showcase',
      type: 'TeamShowcase',
      props: {
        members: '{{ content.team.members }}',
        labelText: '{{ content.team.labelText }}',
        inactiveOpacity: 0.2,
      },
    },
  ],
}

// =============================================================================
// Section 4: Medlemskab (Pricing) - Plans + contact
// =============================================================================

// Helper: creates a plan card schema for a given plan key (e.g., 'flex', 'allIn')
function createPlanCardWidgets(planKey: string) {
  const p = `content.pricing.${planKey}`
  return {
    id: `plan-${planKey}`,
    type: 'Flex' as const,
    props: { direction: 'column' as const, align: 'center' as const, gap: '0' },
    className: 'plan-card',
    widgets: [
      { id: `${planKey}-illustration`, type: 'Image' as const, props: { src: `{{ ${p}.illustration }}`, alt: `{{ ${p}.name }} illustration`, decorative: true }, className: 'plan-card__illustration' },
      { id: `${planKey}-name`, type: 'Text' as const, props: { content: `{{ ${p}.name }}`, as: 'h3' }, className: 'plan-card__name' },
      { id: `${planKey}-price`, type: 'Text' as const, props: { content: `{{ ${p}.price }}`, as: 'span' }, className: 'plan-card__price' },
      { id: `${planKey}-subtitle`, type: 'Text' as const, props: { content: '{{ content.pricing.priceSubtitle }}', as: 'span' }, className: 'plan-card__subtitle' },
      { id: `${planKey}-description`, type: 'Text' as const, props: { content: `{{ ${p}.description }}`, as: 'p' }, className: 'plan-card__description' },
      { id: `${planKey}-divider`, type: 'Box' as const, className: 'plan-card__divider', widgets: [] },
      {
        id: `${planKey}-features`,
        type: 'Flex' as const,
        props: { direction: 'column' as const, gap: '0.5rem' },
        className: 'plan-card__features',
        widgets: [
          {
            __repeat: `{{ ${p}.features }}`,
            id: `${planKey}-feature`,
            type: 'Flex' as const,
            props: { direction: 'row' as const, align: 'center' as const, gap: '0.5rem' },
            className: 'plan-card__feature',
            widgets: [
              { id: `${planKey}-feature-icon`, type: 'Icon' as const, props: { name: '{{ item.icon }}', size: 14 }, className: 'plan-card__feature-icon' },
              { id: `${planKey}-feature-name`, type: 'Text' as const, props: { content: '{{ item.name }}', as: 'span' }, className: 'plan-card__feature-name' },
            ],
          },
        ],
      },
    ],
  }
}

const medlemskabSection: SectionSchema = {
  id: 'medlemskab',
  label: 'Medlemskab',
  layout: { type: 'stack', direction: 'column', align: 'center' },
  className: 'section-medlemskab',
  widgets: [
    // Plans grid (2 explicit plan cards)
    {
      id: 'pricing-grid',
      type: 'Grid',
      props: { columns: 1, gap: '2.5rem' },
      className: 'pricing-grid',
      widgets: [
        createPlanCardWidgets('flex'),
        createPlanCardWidgets('allIn'),
      ],
    },
    // Contact sub-section
    {
      id: 'pricing-contact',
      type: 'Flex',
      props: { direction: 'column', align: 'center', gap: '0' },
      className: 'pricing-contact',
      widgets: [
        { id: 'contact-illustration', type: 'Image', props: { src: '{{ content.contact.illustration }}', alt: 'Kontakt', decorative: true }, className: 'pricing-contact__illustration' },
        { id: 'contact-title', type: 'Text', props: { content: '{{ content.contact.title }}', as: 'h3' }, className: 'pricing-contact__title' },
        { __repeat: '{{ content.contact.lines }}', id: 'contact-line', type: 'Text', props: { content: '{{ item }}', as: 'p' }, className: 'pricing-contact__line' },
        {
          id: 'contact-email',
          type: 'Link',
          props: { href: 'mailto:{{ content.contact.email }}' },
          className: 'nav-link pricing-contact__email',
          widgets: [
            { type: 'Text', props: { content: '{{ content.contact.email }}', as: 'span' } },
          ],
        },
      ],
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
  sections: [heroSection, omSection, medlemmerSection, medlemskabSection],
}

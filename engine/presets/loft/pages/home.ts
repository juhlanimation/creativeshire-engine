/**
 * Loft preset home page template.
 * Uses factory functions for pattern sections, passing content bindings + style overrides.
 *
 * 4 sections in smooth-scroll layout:
 * 1. Hero - Fullscreen video with centered title (HeroVideo pattern, title layout)
 * 2. Om - About section with scattered photo collage (AboutCollage pattern)
 * 3. Medlemmer - Team member video showcase (TeamShowcase + StackVideoShowcase)
 * 4. Medlemskab - Pricing plans + contact sub-section (ContentPricing)
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 */

import type { PageSchema, WidgetSchema } from '../../../schema'
import {
  createHeroTitleSection,
  createTeamShowcaseSection,
  createAboutCollageSection,
  createContentPricingSection,
} from '../../../content/sections/patterns'

// =============================================================================
// Section 1: Hero - Fullscreen video with centered title (HeroTitle pattern)
// =============================================================================

const heroSection = createHeroTitleSection({
  colorMode: 'light',
  title: '{{ content.hero.title }}',
  tagline: '{{ content.hero.tagline }}',
  videoSrc: '{{ content.hero.videoSrc }}',
  loopStartTime: '{{ content.hero.loopStartTime }}',
  scrollIndicatorText: '{{ content.hero.scrollIndicatorText }}',
  introVideo: true,
})

// =============================================================================
// Section 2: Om (About) - Text with scattered photo collage (AboutCollage pattern)
// =============================================================================

const omSection = createAboutCollageSection({
  colorMode: 'light',
  id: 'om',
  label: 'Om PORT12',
  className: 'section-om',
  text: '{{ content.about.text }}',
  textClassName: 'om-text corner-border',
  images: '{{ content.about.images }}',
  imageClassName: 'om-image',
})

// =============================================================================
// Section 3: Medlemmer (Team) - TeamShowcase with StackVideoShowcase
// =============================================================================

const medlemmerSection = createTeamShowcaseSection({
  colorMode: 'light',
  id: 'medlemmer',
  label: 'Medlemmer',
  className: 'team-showcase',
  members: '{{ content.team.members }}',
  labelText: '{{ content.team.labelText }}',
  inactiveOpacity: 0.2,
})

// =============================================================================
// Section 4: Medlemskab (Pricing) - Custom plan cards + contact
// =============================================================================

/**
 * Creates a plan card widget for a given plan content key.
 * Loft uses a custom card structure with illustrations.
 */
function createPlanCard(planKey: string): WidgetSchema {
  const p = `content.pricing.${planKey}`
  return {
    id: `plan-${planKey}`,
    type: 'Flex',
    props: { direction: 'column', align: 'center', gap: '0' },
    className: 'plan-card',
    widgets: [
      { id: `${planKey}-illustration`, type: 'Image', props: { src: `{{ ${p}.illustration }}`, alt: `{{ ${p}.name }} illustration`, decorative: true }, className: 'plan-card__illustration' },
      { id: `${planKey}-name`, type: 'Text', props: { content: `{{ ${p}.name }}`, as: 'h3' }, className: 'plan-card__name' },
      { id: `${planKey}-price`, type: 'Text', props: { content: `{{ ${p}.price }}`, as: 'span' }, className: 'plan-card__price' },
      { id: `${planKey}-subtitle`, type: 'Text', props: { content: '{{ content.pricing.priceSubtitle }}', as: 'span' }, className: 'plan-card__subtitle' },
      { id: `${planKey}-description`, type: 'Text', props: { content: `{{ ${p}.description }}` }, className: 'plan-card__description' },
      { id: `${planKey}-divider`, type: 'Box', className: 'plan-card__divider', widgets: [] },
      {
        id: `${planKey}-features`,
        type: 'Flex',
        props: { direction: 'column', gap: '0.5rem' },
        className: 'plan-card__features',
        widgets: [
          {
            __repeat: `{{ ${p}.features }}`,
            id: `${planKey}-feature`,
            type: 'Flex',
            props: { direction: 'row', align: 'center', gap: '0.5rem' },
            className: 'plan-card__feature',
            widgets: [
              { id: `${planKey}-feature-icon`, type: 'Icon', props: { name: '{{ item.icon }}', size: 14 }, className: 'plan-card__feature-icon' },
              { id: `${planKey}-feature-name`, type: 'Text', props: { content: '{{ item.name }}', as: 'span' }, className: 'plan-card__feature-name' },
            ],
          },
        ],
      },
    ],
  }
}

const medlemskabSection = createContentPricingSection({
  colorMode: 'light',
  id: 'medlemskab',
  label: 'Medlemskab',
  className: 'section-medlemskab',
  plans: [], // Custom plan widgets below replace the generated grid
  planWidgets: [
    {
      id: 'pricing-grid',
      type: 'Grid',
      props: { columns: 2, gap: '4rem' },
      className: 'pricing-grid',
      widgets: [
        createPlanCard('flex'),
        createPlanCard('allIn'),
      ],
    },
  ],
  extraWidgets: [
    {
      id: 'pricing-contact',
      type: 'Flex',
      props: { direction: 'column', align: 'center', gap: '0' },
      className: 'pricing-contact',
      widgets: [
        { id: 'contact-illustration', type: 'Image', props: { src: '{{ content.contact.illustration }}', alt: 'Kontakt', decorative: true }, className: 'pricing-contact__illustration' },
        { id: 'contact-title', type: 'Text', props: { content: '{{ content.contact.title }}', as: 'h3' }, className: 'pricing-contact__title' },
        { __repeat: '{{ content.contact.lines }}', id: 'contact-line', type: 'Text', props: { content: '{{ item }}' }, className: 'pricing-contact__line' },
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
  sections: [heroSection, omSection, medlemmerSection, medlemskabSection],
}

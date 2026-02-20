import type { WidgetSchema } from '../../../../schema'
import type { ContentPricingProps } from './types'

// =====================================================================
// SVG icon strings for pricing feature indicators
// =====================================================================
const CHECK_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L6.5 12L13 4"/></svg>'
const CROSS_SVG = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4" r="1.5"/><rect x="3" y="7" width="10" height="2" rx="1"/><circle cx="8" cy="12" r="1.5"/></svg>'
const PLUS_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3V13M3 8H13"/></svg>'

export const previewProps: Partial<ContentPricingProps> = {
  title: 'Pricing',
  subtitle: 'Choose the plan that fits your project scope.',
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      price: '$500',
      period: '/project',
      description: 'Ideal for quick edits and short-form content.',
      features: [
        { label: 'Up to 2 revisions', included: true },
        { label: 'Basic color correction', included: true },
        { label: 'Custom motion graphics', included: false },
        { label: 'Dedicated project manager', included: false },
      ],
      ctaText: 'Get Started',
      ctaHref: '#contact',
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$1,500',
      period: '/project',
      description: 'Full production support for commercial work.',
      features: [
        { label: 'Unlimited revisions', included: true },
        { label: 'Advanced color grading', included: true },
        { label: 'Custom motion graphics', included: true },
        { label: 'Dedicated project manager', included: false },
      ],
      ctaText: 'Choose Pro',
      ctaHref: '#contact',
      highlighted: true,
      badge: 'Popular',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for studios and agencies.',
      features: [
        { label: 'Unlimited revisions', included: true },
        { label: 'Advanced color grading', included: true },
        { label: 'Custom motion graphics', included: true },
        { label: 'Dedicated project manager', included: true },
      ],
      ctaText: 'Contact Us',
      ctaHref: '#contact',
    },
  ],
}

// =====================================================================
// Membership — Illustration-based plan cards + contact section
// =====================================================================

const IMAGE_BASE = '/images/port-12'

interface PlanFeature {
  name: string
  icon: string
}

/**
 * Build a static plan card widget (no binding expressions).
 */
function buildPlanCardPreview(
  planKey: string,
  plan: { name: string; price: string; description: string; illustration: string; features: PlanFeature[] },
  priceSubtitle: string,
): WidgetSchema {
  return {
    id: `plan-${planKey}`,
    type: 'Flex',
    props: { direction: 'column', align: 'center', gap: '0' },
    className: 'plan-card',
    widgets: [
      { id: `${planKey}-illustration`, type: 'Image', props: { src: plan.illustration, alt: `${plan.name} illustration`, decorative: true }, className: 'plan-card__illustration' },
      { id: `${planKey}-name`, type: 'Text', props: { content: plan.name, as: 'h3' }, className: 'plan-card__name' },
      { id: `${planKey}-price`, type: 'Text', props: { content: plan.price, as: 'span' }, className: 'plan-card__price' },
      { id: `${planKey}-subtitle`, type: 'Text', props: { content: priceSubtitle, as: 'span' }, className: 'plan-card__subtitle' },
      { id: `${planKey}-description`, type: 'Text', props: { content: plan.description }, className: 'plan-card__description' },
      { id: `${planKey}-divider`, type: 'Box', className: 'plan-card__divider', widgets: [] },
      {
        id: `${planKey}-features`,
        type: 'Flex',
        props: { direction: 'column', gap: '0.5rem' },
        className: 'plan-card__features',
        widgets: plan.features.map((f, i) => ({
          id: `${planKey}-feature-${i}`,
          type: 'Flex',
          props: { direction: 'row', align: 'center', gap: '0.5rem' },
          className: 'plan-card__feature',
          widgets: [
            { id: `${planKey}-feature-${i}-icon`, type: 'Icon', props: { name: f.icon, size: 14 }, className: 'plan-card__feature-icon' },
            { id: `${planKey}-feature-${i}-name`, type: 'Text', props: { content: f.name, as: 'span' }, className: 'plan-card__feature-name' },
          ],
        })),
      },
    ],
  }
}

const flexPlan = {
  name: 'FLEX',
  price: '1.300 DKK',
  description: 'Frihed og fleksibilitet.\nBetal kun for adgang, ikke for plads.',
  illustration: `${IMAGE_BASE}/FLEX_Illustration_2.webp`,
  features: [
    { name: 'Fri adgang 24/7', icon: CHECK_SVG },
    { name: 'Egen nøgle', icon: CHECK_SVG },
    { name: 'Wi-Fi (1000 Mbit)', icon: CHECK_SVG },
    { name: 'Printer & scanner', icon: CHECK_SVG },
    { name: 'Bord & stol', icon: CHECK_SVG },
    { name: 'Mødelokale', icon: CHECK_SVG },
    { name: 'Egen fast plads', icon: CROSS_SVG },
    { name: 'Reol plads', icon: CROSS_SVG },
    { name: 'Tilkøb kaffe', icon: PLUS_SVG },
  ],
}

const allInPlan = {
  name: 'ALL-IN',
  price: '2.000 DKK',
  description: 'Dit second home.\nFast plads uden krav om at rydde op.',
  illustration: `${IMAGE_BASE}/ALL-IN_Illustration_3.webp`,
  features: [
    { name: 'Fri adgang 24/7', icon: CHECK_SVG },
    { name: 'Egen nøgle', icon: CHECK_SVG },
    { name: 'Wi-Fi (1000 Mbit)', icon: CHECK_SVG },
    { name: 'Printer & scanner', icon: CHECK_SVG },
    { name: 'Bord & stol', icon: CHECK_SVG },
    { name: 'Mødelokale', icon: CHECK_SVG },
    { name: 'Egen fast plads', icon: CHECK_SVG },
    { name: 'Reol plads', icon: CHECK_SVG },
    { name: 'Tilkøb kaffe', icon: PLUS_SVG },
  ],
}

const PRICE_SUBTITLE = 'ex moms / måned'

export const medlemskabPreviewProps: Partial<ContentPricingProps> = {
  id: 'medlemskab',
  label: 'Medlemskab',
  title: '',
  subtitle: '',
  className: 'section-medlemskab',
  plans: [],
  planWidgets: [
    {
      id: 'pricing-grid',
      type: 'Grid',
      props: { columns: 2, gap: '4rem' },
      className: 'pricing-grid',
      widgets: [
        buildPlanCardPreview('flex', flexPlan, PRICE_SUBTITLE),
        buildPlanCardPreview('allIn', allInPlan, PRICE_SUBTITLE),
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
        { id: 'contact-illustration', type: 'Image', props: { src: `${IMAGE_BASE}/kontakt-illustration.webp`, alt: 'Kontakt', decorative: true }, className: 'pricing-contact__illustration' },
        { id: 'contact-title', type: 'Text', props: { content: 'KONTAKT OS', as: 'h3' }, className: 'pricing-contact__title' },
        { id: 'contact-line-0', type: 'Text', props: { content: 'Hiv fat hvis du har spørgsmål.' }, className: 'pricing-contact__line' },
        { id: 'contact-line-1', type: 'Text', props: { content: 'Eller kom og mød os.' }, className: 'pricing-contact__line' },
        { id: 'contact-line-2', type: 'Text', props: { content: 'Vi bider ikke. Tværtimod.' }, className: 'pricing-contact__line' },
        {
          id: 'contact-email',
          type: 'Link',
          props: { href: 'mailto:info@port12.dk' },
          className: 'nav-link pricing-contact__email',
          widgets: [
            { id: 'contact-email-text', type: 'Text', props: { content: 'info@port12.dk', as: 'span' } },
          ],
        },
      ],
    },
  ],
}

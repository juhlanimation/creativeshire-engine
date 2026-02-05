/**
 * Test multipage preset home page template.
 * Simple page with hero and feature sections.
 *
 * Note: Uses hardcoded values for standalone testing.
 * In production, these would use binding expressions.
 */

import type { PageSchema, SectionSchema } from '../../../schema'

/**
 * Hero section with title and subtitle.
 */
const heroSection: SectionSchema = {
  id: 'hero',
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'center',
  },
  style: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: '6rem', // Account for fixed header
  },
  widgets: [
    {
      id: 'hero-title',
      type: 'Text',
      props: {
        content: 'Welcome Home',
        as: 'h1',
      },
      style: {
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        fontWeight: 700,
        marginBottom: '1rem',
        textAlign: 'center',
      },
    },
    {
      id: 'hero-subtitle',
      type: 'Text',
      props: {
        content: 'This is the home page of the test multipage preset',
        as: 'p',
      },
      style: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        opacity: 0.7,
        textAlign: 'center',
      },
    },
  ],
}

/**
 * Feature section with title and text.
 */
const featureSection: SectionSchema = {
  id: 'features',
  layout: {
    type: 'stack',
    direction: 'column',
    align: 'center',
  },
  style: {
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '4rem 2rem',
  },
  widgets: [
    {
      id: 'feature-title',
      type: 'Text',
      props: {
        content: 'Features',
        as: 'h2',
      },
      style: {
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 600,
        marginBottom: '1rem',
        textAlign: 'center',
      },
    },
    {
      id: 'feature-text',
      type: 'Text',
      props: {
        content: 'Click "About" in the header to test page transitions.',
        as: 'p',
      },
      style: {
        fontSize: '1rem',
        maxWidth: '600px',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  ],
}

/**
 * Home page template.
 */
export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: 'Test Site - Home',
    description: 'Welcome to the test multipage site',
  },
  sections: [heroSection, featureSection],
}

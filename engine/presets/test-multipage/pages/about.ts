/**
 * Test multipage preset about page template.
 * Simple page with about and team sections.
 *
 * Note: Uses hardcoded values for standalone testing.
 * In production, these would use binding expressions.
 */

import type { PageSchema, SectionSchema } from '../../../schema'

/**
 * About section with title and text.
 */
const aboutSection: SectionSchema = {
  id: 'about',
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
      id: 'about-title',
      type: 'Text',
      props: {
        content: 'About Us',
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
      id: 'about-text',
      type: 'Text',
      props: {
        content: 'This is the about page of the test multipage preset',
        as: 'p',
      },
      style: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        maxWidth: '600px',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  ],
}

/**
 * Team section with title and text.
 */
const teamSection: SectionSchema = {
  id: 'team',
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
      id: 'team-title',
      type: 'Text',
      props: {
        content: 'Our Team',
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
      id: 'team-text',
      type: 'Text',
      props: {
        content: 'Click "Home" in the header to test page transitions back.',
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
 * About page template.
 */
export const aboutPageTemplate: PageSchema = {
  id: 'about',
  slug: '/about',
  head: {
    title: 'Test Site - About',
    description: 'About the test multipage site',
  },
  sections: [aboutSection, teamSection],
}

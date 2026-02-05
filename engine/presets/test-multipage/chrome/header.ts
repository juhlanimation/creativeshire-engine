/**
 * Test multipage preset header configuration.
 * Header with navigation links for testing page transitions.
 *
 * Note: Uses hardcoded values for standalone testing.
 * In production, these would use binding expressions.
 */

import type { PresetRegionConfig } from '../../types'

/**
 * Header chrome configuration.
 * Uses Header component with hardcoded nav links for testing.
 */
export const headerConfig: PresetRegionConfig = {
  component: 'Header',
  props: {
    siteTitle: 'Test Site',
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
    fixed: true,
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#000000',
  },
}

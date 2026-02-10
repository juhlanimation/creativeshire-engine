/**
 * Port-12 preset chrome configuration.
 *
 * Widget-based header with navbar and logo.
 * Widget-based footer with 3 columns reordered via CSS order.
 * Navbar is hidden on mobile and touch devices via CSS.
 */

import type { PresetChromeConfig } from '../../types'
import type { WidgetSchema } from '../../../schema'

// =============================================================================
// Header: Navbar
// =============================================================================

const navbarWidget: WidgetSchema = {
  id: 'port12-nav',
  type: 'Flex',
  props: { direction: 'row', align: 'center', gap: '1.5rem' },
  className: 'port12-navbar',
  widgets: [
    // Nav links via __repeat
    {
      __repeat: '{{ content.nav.links }}',
      id: 'nav-link',
      type: 'Link',
      props: { href: '{{ item.href }}' },
      className: 'nav-link',
      widgets: [
        { type: 'Text', props: { content: '{{ item.label }}', as: 'span' } },
      ],
    },
    // Divider line
    {
      id: 'nav-divider',
      type: 'Box',
      className: 'port12-navbar__divider',
      widgets: [],
    },
    // Email link (smaller, lighter)
    {
      id: 'nav-email',
      type: 'Link',
      props: { href: 'mailto:{{ content.footer.email }}' },
      className: 'port12-navbar__email',
      widgets: [
        { type: 'Text', props: { content: '{{ content.footer.email }}', as: 'span' } },
      ],
    },
  ],
}

// =============================================================================
// Header: Logo
// =============================================================================

const logoWidget: WidgetSchema = {
  id: 'port12-logo',
  type: 'Text',
  props: { content: '{{ content.footer.brandName }}', as: 'div' },
  className: 'port12-logo',
}

// =============================================================================
// Footer
// =============================================================================

const footerWidget: WidgetSchema = {
  id: 'port12-footer',
  type: 'Flex',
  props: { direction: 'column', align: 'center', gap: '2rem' },
  className: 'port12-footer',
  widgets: [
    // Column 1: Nav links (order: 2 on mobile, 1 on desktop)
    {
      id: 'footer-nav',
      type: 'Flex',
      props: { direction: 'column', align: 'center', gap: '0.125rem' },
      className: 'port12-footer__nav',
      widgets: [
        {
          __repeat: '{{ content.footer.navLinks }}',
          id: 'footer-link',
          type: 'Link',
          props: { href: '{{ item.href }}' },
          className: 'footer-link',
          widgets: [
            { type: 'Text', props: { content: '{{ item.label }}', as: 'span' } },
          ],
        },
      ],
    },
    // Column 2: Logo + copyright (order: 1 on mobile, 2 on desktop)
    {
      id: 'footer-brand',
      type: 'Flex',
      props: { direction: 'column', align: 'center', gap: '0.5rem' },
      className: 'port12-footer__brand',
      widgets: [
        {
          id: 'footer-logo',
          type: 'Text',
          props: { content: '{{ content.footer.brandName }}', as: 'div' },
          className: 'port12-footer__logo',
        },
        {
          id: 'footer-copyright',
          type: 'Text',
          props: { content: '{{ content.footer.copyright }}', as: 'span' },
          className: 'port12-footer__copyright',
        },
      ],
    },
    // Column 3: Contact info (order: 3 on both)
    {
      id: 'footer-contact',
      type: 'Flex',
      props: { direction: 'column', align: 'center', gap: '0.125rem' },
      className: 'port12-footer__contact',
      widgets: [
        {
          id: 'footer-email',
          type: 'Link',
          props: { href: 'mailto:{{ content.footer.email }}' },
          className: 'footer-link',
          widgets: [
            { type: 'Text', props: { content: '{{ content.footer.email }}', as: 'span' } },
          ],
        },
        {
          id: 'footer-phone',
          type: 'Link',
          props: { href: 'tel:{{ content.footer.phone }}' },
          className: 'footer-link',
          widgets: [
            { type: 'Text', props: { content: '{{ content.footer.phoneDisplay }}', as: 'span' } },
          ],
        },
        {
          id: 'footer-address',
          type: 'Text',
          props: { content: '{{ content.footer.address }}', as: 'span' },
          className: 'footer-link',
        },
      ],
    },
  ],
}

// =============================================================================
// Chrome Export
// =============================================================================

export const chromeConfig: PresetChromeConfig = {
  regions: {
    header: {
      widgets: [navbarWidget, logoWidget],
    },
    footer: {
      widgets: [footerWidget],
    },
  },
}

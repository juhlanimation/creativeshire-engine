/**
 * CenteredNav chrome pattern — factory function for header region.
 * Builds a centered header with brand name above and navigation links below.
 *
 * Structure:
 * - Flex (column, align: center)
 *   - Text (brand name, large)
 *   - Flex (row, nav links)
 *     - Link x N (nav items via __repeat)
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import type { CenteredNavProps } from './types'

/**
 * Creates a CenteredNav header region configuration.
 *
 * @param props - Navigation configuration with brand name and links
 * @returns PresetRegionConfig for the header region
 */
export function createCenteredNavRegion(props: CenteredNavProps): PresetRegionConfig {
  const brandWidget: WidgetSchema = {
    id: 'nav-brand',
    type: 'Text',
    props: {
      content: props.brandName,
      as: 'span',
    },
    style: {
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      fontSize: '1.5rem',
    },
  }

  const navRow: WidgetSchema | null = props.navLinks
    ? {
        id: 'nav-links',
        type: 'Flex',
        props: {
          direction: 'row',
          align: 'center',
          justify: 'center',
          gap: '1.5rem',
        },
        widgets: [
          {
            id: 'nav-link',
            type: 'Link',
            __repeat: props.navLinks,
            __key: 'label',
            props: {
              href: '{{ item.href }}',
              children: '{{ item.label }}',
            },
          },
        ],
      }
    : null

  return {
    overlay: true,
    layout: {
      justify: 'center',
      align: 'center',
      padding: '1.5rem 2rem',
      maxWidth: 'var(--site-max-width)',
    },
    widgets: [
      {
        id: 'centered-nav',
        type: 'Flex',
        props: {
          direction: 'column',
          align: 'center',
          gap: '0.75rem',
        },
        widgets: [brandWidget, ...(navRow ? [navRow] : [])],
      },
    ],
  }
}

/**
 * ColumnFooter chrome pattern — factory function for footer region.
 * Multi-column footer with animated divider line and staggered column reveal.
 *
 * Structure:
 * - Flex (.column-footer)
 *   - Box (.column-footer__divider, data-effect="line-reveal")
 *   - Flex (.column-footer__columns)
 *     - Stack x N (.column-footer__column)
 *       - Text (heading, 12px muted)
 *       - Link|Text x N (items, 14px)
 *   - Text (.column-footer__copyright)
 */

import type { CSSProperties } from 'react'
import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { ColumnFooterProps, FooterColumn } from './types'
import { meta } from './meta'

function buildColumnWidgets(columns: FooterColumn[] | string, lastColumnAlign: string): WidgetSchema[] {
  if (typeof columns === 'string') {
    // Binding expression mode
    return [{
      __repeat: columns,
      id: 'footer-col',
      type: 'Stack',
      props: { gap: 8 },
      className: 'column-footer__column',
      widgets: [
        {
          id: 'col-heading',
          type: 'Text',
          props: { content: '{{ item.heading }}', as: 'small' },
          className: 'column-footer__heading',
        },
        {
          __repeat: '{{ item.items }}',
          id: 'col-item',
          type: 'Link',
          props: {
            children: '{{ item.label }}',
            href: '{{ item.href }}',
          },
          className: 'column-footer__item',
        },
      ],
    }]
  }

  // Concrete data mode
  return columns.map((col, colIdx) => {
    const isLast = colIdx === columns.length - 1
    const colStyle: CSSProperties | undefined = (isLast && lastColumnAlign === 'end')
      ? { marginInlineStart: 'auto' } as CSSProperties
      : undefined

    const itemWidgets: WidgetSchema[] = col.items.map((item, itemIdx) => {
      if (item.href) {
        return {
          id: `footer-col-${colIdx}-item-${itemIdx}`,
          type: 'Link' as const,
          props: { children: item.label, href: item.href },
          className: 'column-footer__item',
        }
      }
      return {
        id: `footer-col-${colIdx}-item-${itemIdx}`,
        type: 'Text' as const,
        props: { content: item.label, as: 'small' },
        className: 'column-footer__item',
      }
    })

    return {
      id: `footer-col-${colIdx}`,
      type: 'Stack' as const,
      props: { gap: 8 },
      className: 'column-footer__column',
      ...(colStyle && { style: colStyle }),
      widgets: [
        {
          id: `footer-col-${colIdx}-heading`,
          type: 'Text' as const,
          props: { content: col.heading, as: 'small' },
          className: 'column-footer__heading',
        },
        ...itemWidgets,
      ],
    }
  })
}

export function createColumnFooterRegion(rawProps?: ColumnFooterProps): PresetRegionConfig {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  const columns = rawProps?.columns ?? '{{ content.chrome.columns }}'
  const copyright = rawProps?.copyright ?? '{{ content.chrome.copyright }}'
  const showDivider = p.showDivider as boolean
  const lastColumnAlign = p.lastColumnAlign as string

  const footerWidgets: WidgetSchema[] = []

  // Divider line with line-reveal effect
  if (showDivider) {
    footerWidgets.push({
      id: 'footer-divider',
      type: 'Box',
      props: {},
      className: 'column-footer__divider',
      'data-effect': 'line-reveal',
      widgets: [],
    })
  }

  // Columns grid
  footerWidgets.push({
    id: 'footer-columns',
    type: 'Flex',
    props: {},
    className: 'column-footer__columns',
    widgets: buildColumnWidgets(columns as FooterColumn[] | string, lastColumnAlign),
  })

  // Copyright
  footerWidgets.push({
    id: 'footer-copyright',
    type: 'Text',
    props: { content: copyright, as: 'small' },
    className: 'column-footer__copyright',
  })

  return {
    widgets: [
      {
        id: 'column-footer',
        type: 'Flex',
        props: {},
        className: 'column-footer',
        widgets: footerWidgets,
      },
    ],
    ...(rawProps?.style && { style: rawProps.style }),
  }
}

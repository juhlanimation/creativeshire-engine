/**
 * WidgetPreview — renders a single widget in isolation for the registry browser.
 * Uses getWidget() directly to render with merged props from settings + preview defaults.
 */

'use client'

import type { ReactNode } from 'react'
import { getWidget } from '../../../../engine/content/widgets/registry'
import { PreviewShell } from './PreviewShell'

interface WidgetPreviewProps {
  widgetType: string
  props: Record<string, unknown>
  /** Optional children passed to the rendered component (e.g. Link) */
  previewChildren?: ReactNode
  /** Extra styles on the wrapper div around the widget (e.g. explicit height for TextMask) */
  wrapperStyle?: React.CSSProperties
}

export function WidgetPreview({ widgetType, props, previewChildren, wrapperStyle }: WidgetPreviewProps) {
  const Component = getWidget(widgetType)

  if (!Component) {
    return (
      <PreviewShell>
        <div className="cd-detail__error">No component registered for: {widgetType}</div>
      </PreviewShell>
    )
  }

  const content = previewChildren
    ? (
      // eslint-disable-next-line react-hooks/static-components -- getWidget returns stable refs from registry Map
      <Component {...props}>{previewChildren}</Component>
    )
    : (
      // eslint-disable-next-line react-hooks/static-components
      <Component {...props} />
    )

  return (
    <PreviewShell>
      {wrapperStyle
        ? <div style={wrapperStyle}>{content}</div>
        : content}
    </PreviewShell>
  )
}

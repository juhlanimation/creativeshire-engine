/**
 * SectionPreview — renders a section pattern in isolation for the registry browser.
 * Executes the section factory with current settings, then renders each widget directly.
 */

'use client'

import { useState, useEffect } from 'react'
import { getSectionPattern } from '../../../../engine/content/sections/registry'
import { getWidget } from '../../../../engine/content/widgets/registry'
import type { WidgetSchema } from '../../../../engine/schema/widget'
import { PreviewShell } from './PreviewShell'

interface SectionPreviewProps {
  sectionId: string
  props: Record<string, unknown>
}

/** Recursively render a widget schema tree using direct component lookup. */
function RenderWidget({ widget, index }: { widget: WidgetSchema; index: number }) {
  const Component = getWidget(widget.type)
  if (!Component) {
    return (
      <div className="cd-detail__error" style={{ fontSize: 11, padding: '4px 0' }}>
        Unknown widget: {widget.type}
      </div>
    )
  }

  const children = widget.widgets?.map((child, i) => (
    <RenderWidget key={child.id ?? i} widget={child} index={i} />
  ))

  const componentProps = {
    ...widget.props,
    ...(widget.style && { style: widget.style }),
    ...(widget.className && { className: widget.className }),
    ...(widget.widgets && { widgets: widget.widgets }),
  }

  return children
    ? /* eslint-disable react-hooks/static-components -- getWidget returns stable refs */
      <Component {...componentProps}>{children}</Component>
      /* eslint-enable react-hooks/static-components */
    : /* eslint-disable react-hooks/static-components */
      <Component {...componentProps} />
      /* eslint-enable react-hooks/static-components */
}

export function SectionPreview({ sectionId, props }: SectionPreviewProps) {
  const [widgets, setWidgets] = useState<WidgetSchema[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const entry = getSectionPattern(sectionId)
    if (!entry) {
      setError(`Unknown section: ${sectionId}`)
      return
    }

    async function load() {
      try {
        const factory = await entry!.getFactory()
        const section = factory(props)
        if (!cancelled) {
          setWidgets(section.widgets ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Factory error')
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [sectionId, props])

  return (
    <PreviewShell>
      {error && <div className="cd-detail__error">{error}</div>}
      {widgets === null && !error && (
        <div className="cd-detail__loading">Loading preview...</div>
      )}
      {widgets && widgets.length === 0 && (
        <div className="cd-detail__note">Section produces no widgets with current settings</div>
      )}
      {widgets && widgets.map((w, i) => (
        <RenderWidget key={w.id ?? i} widget={w} index={i} />
      ))}
    </PreviewShell>
  )
}

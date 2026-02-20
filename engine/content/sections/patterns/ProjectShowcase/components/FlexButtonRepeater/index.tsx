'use client'

import React, { memo, forwardRef, useMemo } from 'react'
import type { FlexButtonRepeaterProps } from './types'
import type { IndexNavItem } from './IndexNav/types'
import type { WidgetSchema } from '../../../../../../schema'
import IndexNav from './IndexNav'

/**
 * Extract IndexNavItem[] from widget children.
 * Children should be Button widgets with label, value, or data-frame props.
 */
function extractItemsFromWidgets(widgets: WidgetSchema[]): IndexNavItem[] {
  return widgets.map((widget) => {
    const props = widget.props ?? {}
    const label = (props.label ?? props['data-frame'] ?? props.frame ?? '') as string
    const value = props.value ?? props['data-frame'] ?? props.frame
    return {
      label: String(label),
      ...(value != null ? { value: value as string | number } : {}),
    }
  })
}

const FlexButtonRepeater = memo(forwardRef<HTMLDivElement, FlexButtonRepeaterProps>(function FlexButtonRepeater(
  {
    widgets,
    activeIndex,
    onSelect,
    prefix,
    direction,
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const items = useMemo(() => {
    if (widgets && widgets.length > 0) {
      return extractItemsFromWidgets(widgets)
    }
    return []
  }, [widgets])

  return (
    <IndexNav
      ref={ref}
      items={items}
      activeIndex={activeIndex}
      onSelect={onSelect}
      prefix={prefix}
      direction={direction}
      className={className}
      style={style}
      data-behaviour={dataBehaviour}
    />
  )
}))

export default FlexButtonRepeater

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('ProjectShowcase__FlexButtonRepeater', FlexButtonRepeater)

/**
 * Marquee layout widget - infinite horizontal scroll container.
 * Content Layer (L1) - renders children in two groups for seamless looping.
 *
 * Automatically repeats items within each group so even a single widget
 * produces a full, gapless ribbon. The -50% translateX in the keyframes
 * scrolls exactly one group width, then resets invisibly.
 *
 * Works with any child widgets. The marquee-scroll effect handles
 * the @keyframes animation; the animation/marquee behaviour controls
 * --marquee-play-state and --marquee-duration via CSS variables.
 */

'use client'

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import { toCssGap, toCssValue } from '../utils'
import type { MarqueeProps } from './types'

/** Minimum items per group to guarantee viewport fill at typical item sizes */
const MIN_ITEMS_PER_GROUP = 20

const Marquee = memo(forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  {
    id,
    duration = 30,
    gap,
    gapScale,
    direction = 'left',
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    widgets,
  },
  ref,
) {
  if (!widgets || widgets.length === 0) return null

  // Repeat widget set so each group fills the viewport even with few items
  const repeatCount = Math.max(1, Math.ceil(MIN_ITEMS_PER_GROUP / widgets.length))
  const groupWidgets = repeatCount > 1
    ? Array.from({ length: repeatCount }, (_, r) =>
        widgets.map((w, i) => ({
          ...w,
          id: r > 0 ? `${w.id ?? i}-r${r}` : (w.id ?? `${i}`),
        })),
      ).flat()
    : widgets

  const trackStyle: CSSProperties = {
    '--marquee-duration': `${duration}s`,
  } as CSSProperties

  // Gap goes on each group (inter-item + trailing padding) so both groups
  // have identical total widths. This makes the -50% translateX seamless.
  const groupStyle: CSSProperties | undefined = gap !== undefined
    ? { gap: toCssGap(gap, gapScale), paddingInlineEnd: toCssGap(gap, gapScale) }
    : undefined

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `marquee-widget ${className}` : 'marquee-widget'}
      style={style}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
      data-direction={direction !== 'left' ? direction : undefined}
    >
      <div className="marquee-widget__track" style={trackStyle}>
        <div className="marquee-widget__group" style={groupStyle}>
          {groupWidgets.map((widget, index) => (
            <WidgetRenderer key={widget.id ?? index} widget={widget} index={index} />
          ))}
        </div>
        <div className="marquee-widget__group" aria-hidden="true" style={groupStyle}>
          {groupWidgets.map((widget, index) => (
            <WidgetRenderer key={`dup-${widget.id ?? index}`} widget={widget} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}))

export default Marquee

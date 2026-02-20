/**
 * MarqueeImageRepeater widget - converts image data into Image widgets in a Marquee.
 *
 * Handles binding expression resolution for image data:
 * - When binding string: returns null (platform resolves and re-renders)
 * - When array: converts each item to an Image widget, renders via Marquee
 *
 * CSS variables on the wrapper cascade to Image children:
 * - --logo-filter: applied via filter on each image
 * - --logo-opacity: applied via opacity on each image
 */

'use client'

import type { MarqueeImageRepeaterProps } from './types'
import Marquee from '../../../../../widgets/layout/Marquee'
import type { WidgetSchema } from '../../../../../../schema'

export default function MarqueeImageRepeater({
  id,
  logos,
  duration = 30,
  logoWidth = 120,
  logoGap = 48,
  className,
  style,
}: MarqueeImageRepeaterProps) {
  // If logos is a binding expression, return null (platform resolves)
  if (typeof logos === 'string') {
    return null
  }

  // Empty state
  if (!Array.isArray(logos) || logos.length === 0) {
    return null
  }

  // Convert logos to Image widget schemas for Marquee children
  // When a logo has an explicit height, use auto width so aspect ratio is preserved
  const imageWidgets: WidgetSchema[] = logos.map((logo, index) => ({
    id: `logo-${index}`,
    type: 'Image',
    props: {
      src: logo.src,
      alt: logo.alt,
      decorative: true,
      objectFit: 'contain',
    },
    className: 'marquee-image-repeater__img',
    style: logo.height
      ? { width: 'auto', maxWidth: `${logoWidth}px`, height: `${logo.height}px`, flexShrink: 0 }
      : { width: `${logoWidth}px`, height: 'auto', flexShrink: 0 },
  }))

  return (
    <div
      id={id}
      className={className ? `marquee-image-repeater ${className}` : 'marquee-image-repeater'}
      style={style}
    >
      <Marquee
        duration={duration}
        gap={logoGap}
        widgets={imageWidgets}
      />
    </div>
  )
}

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('AboutBio__MarqueeImageRepeater', MarqueeImageRepeater)

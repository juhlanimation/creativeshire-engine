/**
 * LogoMarquee widget - horizontal marquee of client logos.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy logos prop: Receives logos array directly (hidden in hierarchy)
 *
 * The widget duplicates content for seamless infinite scrolling.
 */

'use client'

import type { LogoMarqueeProps, LogoItem } from './types'
import { WidgetRenderer } from '../../../../renderer'
import './styles.css'

/**
 * Renders a single logo, optionally wrapped in a link.
 * Used only for legacy logos prop pattern.
 */
function LogoImage({
  logo,
  width,
  gap,
}: {
  logo: LogoItem
  width: number
  gap: number
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="logo-marquee__logo"
      src={logo.src}
      alt={logo.alt}
      style={{ width, marginRight: gap }}
    />
  )

  if (logo.href) {
    return (
      <a
        className="logo-marquee__link"
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: gap }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="logo-marquee__logo"
          src={logo.src}
          alt={logo.alt}
          style={{ width }}
        />
      </a>
    )
  }

  return img
}

export default function LogoMarquee({
  id,
  logos,
  widgets,
  duration = 30,
  logoWidth = 120,
  logoGap = 48,
  className,
  style,
}: LogoMarqueeProps) {
  // Prefer widgets (children via __repeat) over logos prop
  const hasChildren = widgets && widgets.length > 0

  // If using legacy logos prop, check if it's a binding expression
  if (!hasChildren && typeof logos === 'string') {
    return null // Platform will resolve binding
  }

  // Empty state
  if (!hasChildren && (!Array.isArray(logos) || logos.length === 0)) {
    return null
  }

  return (
    <div
      id={id}
      className={className ? `logo-marquee ${className}` : 'logo-marquee'}
      style={style}
    >
      <div
        className="logo-marquee__track"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {hasChildren ? (
          <>
            {/* Render children twice for seamless loop */}
            <div className="logo-marquee__group">
              {widgets.map((widget, index) => (
                <WidgetRenderer key={widget.id || index} widget={widget} index={index} />
              ))}
            </div>
            <div className="logo-marquee__group" aria-hidden="true">
              {widgets.map((widget, index) => (
                <WidgetRenderer key={`dup-${widget.id || index}`} widget={widget} index={index} />
              ))}
            </div>
          </>
        ) : (
          // Legacy: render logos prop twice
          <>
            {(logos as LogoItem[]).map((logo, index) => (
              <LogoImage
                key={`a-${logo.src}-${index}`}
                logo={logo}
                width={logoWidth}
                gap={logoGap}
              />
            ))}
            {(logos as LogoItem[]).map((logo, index) => (
              <LogoImage
                key={`b-${logo.src}-${index}`}
                logo={logo}
                width={logoWidth}
                gap={logoGap}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

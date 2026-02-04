/**
 * LogoMarquee widget - horizontal marquee of client logos.
 *
 * Accepts either:
 * - An array of LogoItem objects (renders immediately)
 * - A binding expression string (returns null, platform resolves and re-renders)
 *
 * This widget exists to support binding expressions in presets where
 * the logo array isn't known at definition time.
 */

'use client'

import type { LogoMarqueeProps, LogoItem } from './types'
import './styles.css'

/**
 * Check if a value is a binding expression (starts with {{ content.)
 */
function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{ content.')
}

/**
 * Renders a single logo, optionally wrapped in a link.
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
  logos,
  duration = 30,
  logoWidth = 120,
  logoGap = 48,
  className,
  style,
}: LogoMarqueeProps) {
  // If logos is a binding expression, render nothing
  // Platform will resolve the binding and re-render with actual array
  if (isBindingExpression(logos)) {
    return null
  }

  // If not an array (shouldn't happen but defensive), render nothing
  if (!Array.isArray(logos)) {
    return null
  }

  // Empty array - render nothing
  if (logos.length === 0) {
    return null
  }

  // Duplicate logos for seamless loop (animation goes from 0 to -50%)
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div
      className={className ? `logo-marquee ${className}` : 'logo-marquee'}
      style={style}
    >
      <div
        className="logo-marquee__track"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {duplicatedLogos.map((logo, index) => (
          <LogoImage
            key={`${logo.src}-${index}`}
            logo={logo}
            width={logoWidth}
            gap={logoGap}
          />
        ))}
      </div>
    </div>
  )
}

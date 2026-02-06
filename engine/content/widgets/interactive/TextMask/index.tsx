'use client'

/**
 * TextMask - SVG text cutout mask widget.
 *
 * Creates an SVG mask where the text is cut out, revealing whatever
 * is behind it (background images, video, etc.). The mask fill is
 * solid (maskColor) everywhere except the text shapes.
 *
 * Pure L1 content widget - behaviours control visibility via CSS variables.
 * Responsive via ResizeObserver on container.
 */

import { memo, forwardRef, useRef, useState, useEffect, useCallback } from 'react'
import type { TextMaskProps } from './types'

const TextMask = memo(forwardRef<HTMLDivElement, TextMaskProps>(function TextMask(
  {
    text,
    fontSize = '25vw',
    fontWeight = 900,
    fontFamily = 'var(--font-title), system-ui, sans-serif',
    maskColor = 'black',
    maxWidth = 2400,
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Measure container on resize
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width: Math.min(width, maxWidth), height })
    }
  }, [maxWidth])

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    updateDimensions()

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [updateDimensions])

  // Generate unique mask ID
  const maskId = `text-mask-${text.replace(/\s+/g, '-').toLowerCase()}`

  const classNames = ['text-mask', className].filter(Boolean).join(' ')

  return (
    <div
      ref={(el) => {
        // Support both refs
        ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      className={classNames}
      data-behaviour={dataBehaviour}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {dimensions.width > 0 && (
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <defs>
            <mask id={maskId}>
              {/* White rect = visible, black text = cutout */}
              <rect width="100%" height="100%" fill="white" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                style={{
                  fontSize,
                  fontWeight,
                  fontFamily,
                }}
              >
                {text}
              </text>
            </mask>
          </defs>
          {/* Mask fill - solid color everywhere except text cutout */}
          <rect
            width="100%"
            height="100%"
            fill={maskColor}
            mask={`url(#${maskId})`}
          />
        </svg>
      )}
    </div>
  )
}))

export default TextMask

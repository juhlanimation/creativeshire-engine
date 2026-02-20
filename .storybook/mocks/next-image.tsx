/**
 * Mock next/image for Storybook.
 * Renders a plain <img> tag instead of Next.js Image.
 */

import React, { forwardRef } from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  function Image({ priority, quality, fill, sizes, ...props }, ref) {
    return <img ref={ref} {...props} />
  }
)

export default Image

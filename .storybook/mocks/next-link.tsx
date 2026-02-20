/**
 * Mock next/link for Storybook.
 * Renders a plain <a> tag instead of Next.js Link.
 */

import React, { forwardRef } from 'react'

const Link = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  function Link({ href, children, ...props }, ref) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    )
  }
)

export default Link

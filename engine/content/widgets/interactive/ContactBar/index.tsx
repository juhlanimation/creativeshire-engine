'use client'

/**
 * ContactBar widget — social links bar with click-to-copy email.
 *
 * Renders a horizontal row of social platform icons.
 * Link platforms (Instagram, LinkedIn, etc.) open in new tabs.
 * Email platform copies address to clipboard with checkmark feedback.
 */

import React, { memo, forwardRef, useState, useCallback, type CSSProperties } from 'react'
import type { ContactBarProps, SocialPlatform } from './types'
import './styles.css'

// =============================================================================
// Platform Icons
// =============================================================================

function InstagramIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedInIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
    </svg>
  )
}

function CheckIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function TwitterIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function VimeoIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
    </svg>
  )
}

function YouTubeIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function BehanceIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.609.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.62.16-1.26.25-1.92.25H0v-14.74h6.938zm-.36 6.05c.6 0 1.09-.16 1.475-.478.39-.32.58-.79.58-1.39 0-.32-.06-.59-.17-.81-.12-.23-.27-.4-.48-.52-.2-.12-.44-.21-.71-.26-.27-.06-.56-.08-.86-.08H3.41v3.55h3.17zm.17 6.38c.33 0 .64-.04.94-.1.3-.07.56-.18.79-.35.23-.16.41-.38.55-.65.13-.28.2-.62.2-1.04 0-.81-.24-1.4-.71-1.74-.48-.35-1.09-.53-1.85-.53H3.41v4.41h3.33zm10.39-2.13c.36.46.86.7 1.52.7.47 0 .88-.12 1.23-.35.35-.23.58-.46.68-.68h2.29c-.36 1.08-.9 1.85-1.62 2.31-.72.46-1.6.69-2.63.69-.72 0-1.37-.12-1.95-.37-.59-.24-1.09-.58-1.5-1.03-.42-.44-.74-.97-.97-1.59-.23-.62-.35-1.29-.35-2.02 0-.72.12-1.38.35-1.99.23-.61.56-1.14.98-1.58.43-.44.93-.78 1.52-1.02.59-.24 1.24-.36 1.95-.36.79 0 1.48.15 2.07.46.59.31 1.08.73 1.47 1.27.39.54.67 1.16.85 1.87.18.71.24 1.47.17 2.29h-6.87c.03.88.33 1.59.7 2.04zm2.67-4.88c-.3-.4-.76-.6-1.4-.6-.42 0-.77.08-1.05.24-.28.16-.5.36-.66.58-.16.22-.27.46-.33.71-.06.25-.1.46-.1.63h4.37c-.1-.76-.43-1.16-.83-1.56zm-2.06-4.9h4.73v1.22h-4.73V5.01z" />
    </svg>
  )
}

function DribbbleIcon(): React.ReactElement {
  return (
    <svg className="contact-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
  )
}

// =============================================================================
// Icon Resolver
// =============================================================================

const PLATFORM_ICONS: Record<SocialPlatform, () => React.ReactElement> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
  twitter: TwitterIcon,
  vimeo: VimeoIcon,
  youtube: YouTubeIcon,
  behance: BehanceIcon,
  dribbble: DribbbleIcon,
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  email: 'Email',
  twitter: 'Twitter',
  vimeo: 'Vimeo',
  youtube: 'YouTube',
  behance: 'Behance',
  dribbble: 'Dribbble',
}

// =============================================================================
// Component
// =============================================================================

const ContactBar = memo(forwardRef<HTMLElement, ContactBarProps>(function ContactBar(
  {
    links,
    iconSize = 20,
    gap = 16,
    textColor = 'light',
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleEmailClick = useCallback(async (email: string) => {
    if (copiedEmail) return
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch {
      // Clipboard may not be available
    }
  }, [copiedEmail])

  if (!links || links.length === 0) return null

  const barStyle: CSSProperties = {
    '--contact-bar-icon-size': `${iconSize}px`,
    '--contact-bar-gap': `${gap}px`,
    ...style,
  } as CSSProperties

  return (
    <nav
      ref={ref}
      className={['contact-bar', className].filter(Boolean).join(' ')}
      style={barStyle}
      data-text-color={textColor}
      data-behaviour={dataBehaviour}
      aria-label="Social links"
    >
      {links.map((link) => {
        const IconComponent = PLATFORM_ICONS[link.platform]
        const label = link.label || PLATFORM_LABELS[link.platform]

        if (link.platform === 'email') {
          const isCopied = copiedEmail === link.url
          return (
            <button
              key={link.url}
              type="button"
              className="contact-bar__link contact-bar__link--email"
              onClick={() => handleEmailClick(link.url)}
              title={isCopied ? 'Copied!' : `Copy ${link.url}`}
              aria-label={isCopied ? 'Email copied' : `Copy email: ${label}`}
            >
              <span className={`contact-bar__icon-swap${isCopied ? ' contact-bar__icon-swap--copied' : ''}`}>
                {IconComponent && <IconComponent />}
                <CheckIcon />
              </span>
            </button>
          )
        }

        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-bar__link"
            aria-label={label}
          >
            {IconComponent && <IconComponent />}
          </a>
        )
      })}
    </nav>
  )
}))

export default ContactBar

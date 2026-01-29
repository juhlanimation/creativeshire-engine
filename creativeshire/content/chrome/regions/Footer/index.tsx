'use client'

/**
 * Footer chrome component - global site footer.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import ContactPrompt from '@/creativeshire/content/widgets/primitives/ContactPrompt'
import type { FooterProps } from './types'
import './styles.css'

/**
 * Footer component renders the site footer with navigation, contact, and studio info.
 * Responsive: single column on mobile, three columns on tablet+.
 */
const Footer = memo(forwardRef<HTMLElement, FooterProps>(function Footer(
  {
    navLinks,
    contactHeading = 'GET IN TOUCH',
    contactEmail,
    contactLinkedin,
    studioHeading = 'FIND MY STUDIO',
    studioUrl,
    studioEmail,
    studioSocials = [],
    copyrightText,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const classNames = ['footer-chrome', className].filter(Boolean).join(' ')

  return (
    <footer
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      role="contentinfo"
    >
      <div className="footer-chrome__content">
        {/* Left: Navigation (centered over copyright) */}
        <div className="footer-chrome__left">
          <nav className="footer-chrome__nav" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="footer-chrome__nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Contact + Studio side-by-side */}
        <div className="footer-chrome__right">
          {/* Contact Section */}
          <div className="footer-chrome__section">
            <h2 className="footer-chrome__heading">{contactHeading}</h2>
            <ContactPrompt
              email={contactEmail}
              showPrompt={false}
              className="footer-chrome__link"
            />
            {contactLinkedin ? (
              <a
                href={contactLinkedin}
                className="footer-chrome__social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin
              </a>
            ) : null}
          </div>

          {/* Studio Section */}
          {(studioUrl || studioEmail || studioSocials.length > 0) ? (
            <div className="footer-chrome__section">
              <h2 className="footer-chrome__heading">{studioHeading}</h2>
              {studioUrl ? (
                <a
                  href={studioUrl}
                  className="footer-chrome__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {studioUrl.replace(/^https?:\/\//, '')}
                </a>
              ) : null}
              {studioEmail ? (
                <ContactPrompt
                  email={studioEmail}
                  showPrompt={false}
                  className="footer-chrome__link"
                />
              ) : null}
              {studioSocials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="footer-chrome__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Copyright - positioned at bottom-left */}
      <p className="footer-chrome__copyright">{copyrightText}</p>
    </footer>
  )
}))

export default Footer

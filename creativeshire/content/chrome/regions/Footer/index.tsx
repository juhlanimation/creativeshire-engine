'use client'

/**
 * Footer chrome component - global site footer.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
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
        {/* Navigation Column */}
        <nav className="footer-chrome__section" aria-label="Footer navigation">
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

        {/* Contact Column */}
        <div className="footer-chrome__section">
          <h2 className="footer-chrome__heading">{contactHeading}</h2>
          <a href={`mailto:${contactEmail}`} className="footer-chrome__link">
            {contactEmail}
          </a>
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

        {/* Studio Column */}
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
              <a href={`mailto:${studioEmail}`} className="footer-chrome__link">
                {studioEmail}
              </a>
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

      {/* Copyright */}
      <p className="footer-chrome__copyright">{copyrightText}</p>
    </footer>
  )
}))

export default Footer

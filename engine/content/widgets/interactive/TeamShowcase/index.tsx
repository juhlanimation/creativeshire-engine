'use client'

/**
 * TeamShowcase interactive widget.
 * Content Layer (L1) - renders team member names with fullscreen video backgrounds.
 *
 * Desktop: Hover on a name to crossfade to that member's video.
 * Mobile: Scroll-based viewport-center detection auto-selects the closest name.
 *
 * Fullscreen strategy:
 * With section containment removed, position:fixed works directly inside sections
 * for standard scroll and Lenis providers. Video layer uses position:fixed to cover
 * the viewport; names sit above with mix-blend-mode:difference.
 *
 * GSAP ScrollSmoother fallback: When inside #smooth-content (which has a transform
 * that traps position:fixed), video + names portal to the viewport foreground layer.
 *
 * Contained mode fallback (iframe/SSR): position:absolute covers the section only.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useViewportPortal } from '../../../../renderer/ViewportPortalContext'
import type { TeamShowcaseProps, TeamMember } from './types'
import './styles.css'

/**
 * Detect if this component is inside GSAP ScrollSmoother's #smooth-content.
 * That element applies a CSS transform that traps position:fixed.
 */
function useInsideSmoothContent(ref: React.RefObject<HTMLElement | null>): boolean {
  const [inside, setInside] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const smoothContent = ref.current.closest('#smooth-content')
    setInside(!!smoothContent)
  }, [ref])

  return inside
}

/**
 * TeamShowcase widget component.
 * Renders team member names with associated fullscreen background videos.
 */
export default function TeamShowcase({
  members,
  labelText = 'Vi er',
  inactiveOpacity = 0.2,
  videoTransitionMs = 500,
  nameTransitionMs = 300,
  className,
  'data-behaviour': dataBehaviour,
}: TeamShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const nameRefs = useRef<(HTMLElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Viewport foreground layer — portal target outside CSS containment
  const { foregroundLayer } = useViewportPortal()

  // Detect GSAP ScrollSmoother containment
  const insideSmoothContent = useInsideSmoothContent(containerRef)

  // Use portal only when inside GSAP's #smooth-content (transform traps fixed)
  const usePortal = insideSmoothContent && !!foregroundLayer

  // Normalize members: binding expressions come as strings before platform resolution
  const memberList: TeamMember[] = Array.isArray(members) ? members : []

  // Detect mobile breakpoint
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Play/pause videos on active index change
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === activeIndex) {
        video.play().catch(() => {
          // Autoplay may be blocked - silent fail
        })
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  // Mobile: scroll-based selection using scroll event + single rAF
  useEffect(() => {
    if (!isMobile) return

    let rafId: number | null = null

    const updateActiveFromScroll = () => {
      rafId = null
      const viewportCenter = window.innerHeight / 2

      // Hit-test: is the viewport center line touching any name?
      for (let i = 0; i < nameRefs.current.length; i++) {
        const el = nameRefs.current[i]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          setActiveIndex(i)
          return
        }
      }

      // Center line not on any name → no selection
      setActiveIndex(null)
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateActiveFromScroll)
      }
    }

    // Initial check
    updateActiveFromScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isMobile])

  // Desktop hover handlers
  const handleMouseEnter = useCallback((index: number) => {
    if (!isMobile) {
      setActiveIndex(index)
    }
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setActiveIndex(null)
    }
  }, [isMobile])

  // Click handler for members with portfolioUrl
  const handleClick = useCallback((index: number) => {
    if (index === activeIndex) {
      const member = memberList[index]
      if (member?.portfolioUrl) {
        window.open(member.portfolioUrl, '_blank', 'noopener,noreferrer')
      }
    }
  }, [activeIndex, memberList])

  // Nothing to render if members haven't resolved yet
  if (memberList.length === 0) return null

  const classes = [
    'team-showcase',
    className,
  ].filter(Boolean).join(' ')

  const isActive = activeIndex !== null

  // ── Video elements ─────────────────────────────────────────────
  const videoElements = memberList.map((member, i) => (
    member.videoSrc ? (
      <video
        key={i}
        ref={(el) => { videoRefs.current[i] = el }}
        src={member.videoSrc}
        className={`team-showcase__video ${i === activeIndex ? 'team-showcase__video--active' : ''}`}
        style={{ transitionDuration: `${videoTransitionMs}ms` }}
        muted
        loop
        playsInline
        preload="auto"
      />
    ) : null
  ))

  // ── Name elements (interactive) ────────────────────────────────
  const nameElements = (
    <div className="team-showcase__names">
      {labelText && (
        <span className="team-showcase__label">{labelText}</span>
      )}

      {memberList.map((member, i) => {
        const memberActive = i === activeIndex
        const hasLink = memberActive && !!member.portfolioUrl

        return (
          <h2
            key={i}
            ref={(el) => { nameRefs.current[i] = el }}
            className={`team-showcase__name ${hasLink ? 'team-showcase__name--clickable' : ''}`}
            style={{
              opacity: isActive ? (memberActive ? 1 : inactiveOpacity) : 1,
              transitionDuration: `${nameTransitionMs}ms`,
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
          >
            {member.name}
          </h2>
        )
      })}
    </div>
  )

  // ── GSAP portal mode ───────────────────────────────────────────
  // Inside #smooth-content, position:fixed is trapped. Portal everything
  // to the viewport foreground layer where fixed positioning works.
  if (usePortal) {
    return (
      <>
        {createPortal(
          <div
            className={`team-showcase__viewport-overlay${isActive ? ' team-showcase__viewport-overlay--active' : ''}`}
          >
            <div className="team-showcase__viewport-videos">
              {videoElements}
            </div>
            {/* Display-only names — mirrors interactive names for visual continuity */}
            <div className="team-showcase__overlay-names">
              {labelText && (
                <span className="team-showcase__label">{labelText}</span>
              )}
              {memberList.map((member, i) => (
                <h2
                  key={i}
                  className="team-showcase__name"
                  style={{
                    opacity: isActive ? (i === activeIndex ? 1 : inactiveOpacity) : 1,
                    transitionDuration: `${nameTransitionMs}ms`,
                  }}
                >
                  {member.name}
                </h2>
              ))}
            </div>
          </div>,
          foregroundLayer
        )}

        {/* In-section interactive names — hidden visually, handles hover/scroll */}
        <div className={classes} data-behaviour={dataBehaviour} ref={containerRef}>
          <div style={{ visibility: 'hidden' }}>
            {nameElements}
          </div>
        </div>
      </>
    )
  }

  // ── Standard mode (no GSAP) ────────────────────────────────────
  // position:fixed works directly inside sections.
  // Video layer covers viewport, names sit above with mix-blend-mode:difference.
  return (
    <div className={classes} data-behaviour={dataBehaviour} ref={containerRef}>
      <div className={`team-showcase__video-layer${isActive ? ' team-showcase__video-layer--active' : ''}`}>
        {videoElements}
      </div>
      {nameElements}
    </div>
  )
}

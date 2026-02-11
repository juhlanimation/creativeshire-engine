'use client'

/**
 * TeamShowcase interactive widget.
 * Content Layer (L1) - renders team member names with fullscreen video backgrounds.
 *
 * Desktop: Hover on a name to crossfade to that member's video.
 * Mobile: Scroll-based viewport-center detection auto-selects the closest name.
 *
 * Fullscreen strategy:
 * CSS containment (container-type, contain, transform) on site ancestors traps
 * position:fixed. Videos and display-names portal to the viewport foreground layer
 * where position:fixed works. Interactive names stay in-section for hover/scroll.
 * The foreground layer has pointer-events:none so hovers pass through to the
 * in-section names beneath.
 *
 * Fallback (contained mode / SSR): videos render inline with position:absolute,
 * covering the section only.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useViewportPortal } from '../../../../renderer/ViewportPortalContext'
import type { TeamShowcaseProps, TeamMember } from './types'
import './styles.css'

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
  const rafRef = useRef<number | null>(null)

  // Viewport foreground layer — portal target outside CSS containment
  const { foregroundLayer } = useViewportPortal()

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

  // Mobile: scroll-based selection using requestAnimationFrame
  useEffect(() => {
    if (!isMobile) return

    const updateActiveFromScroll = () => {
      const viewportCenter = window.innerHeight / 2
      let closestIndex: number | null = null
      let closestDistance = Infinity

      nameRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height / 2
        const distance = Math.abs(elCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setActiveIndex(closestIndex)
      rafRef.current = requestAnimationFrame(updateActiveFromScroll)
    }

    rafRef.current = requestAnimationFrame(updateActiveFromScroll)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
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

  // ── Video elements (shared between portal and inline) ──────────────
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

  // ── Display-only names for the viewport overlay ────────────────────
  // Mirrors the in-section names but without hover handlers.
  // Visible above the video with mix-blend-mode: difference.
  const overlayNames = (
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
  )

  return (
    <>
      {/* ── Viewport overlay (fullpage mode) ─────────────────────────
          Portaled to foreground layer outside CSS containment.
          position:fixed works here. Contains videos + display names.
          pointer-events:none inherited from viewport layer — hovers
          pass through to the in-section interactive names below. */}
      {foregroundLayer && createPortal(
        <div
          className={`team-showcase__viewport-overlay${isActive ? ' team-showcase__viewport-overlay--active' : ''}`}
        >
          <div className="team-showcase__viewport-videos">
            {videoElements}
          </div>
          {overlayNames}
        </div>,
        foregroundLayer
      )}

      {/* ── In-section content ───────────────────────────────────────
          Interactive names handle hover/scroll/click.
          Video layer is inline fallback (contained mode only). */}
      <div className={classes} data-behaviour={dataBehaviour}>
        {/* Inline video fallback — only when viewport portal is unavailable */}
        {!foregroundLayer && (
          <div className={`team-showcase__video-layer${isActive ? ' team-showcase__video-layer--active' : ''}`}>
            {videoElements}
          </div>
        )}

        {/* Interactive names — always in section for hover/scroll detection */}
        <div
          className="team-showcase__names"
          style={foregroundLayer && isActive ? { visibility: 'hidden' } : undefined}
        >
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
      </div>
    </>
  )
}

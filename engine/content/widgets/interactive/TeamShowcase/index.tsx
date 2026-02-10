'use client'

/**
 * TeamShowcase interactive widget.
 * Content Layer (L1) - renders team member names with fullscreen video backgrounds.
 *
 * Desktop: Hover on a name to crossfade to that member's video.
 * Mobile: Scroll-based viewport-center detection auto-selects the closest name.
 *
 * Videos are preloaded in a fixed overlay layer. Names use mix-blend-mode: difference
 * for contrast against any video content.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
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

  return (
    <div className={classes} data-behaviour={dataBehaviour}>
      {/* Video layer - fixed fullscreen, preloaded */}
      <div className="team-showcase__video-layer">
        {memberList.map((member, i) => (
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
        ))}
      </div>

      {/* Names layer */}
      <div className="team-showcase__names">
        {labelText && (
          <span className="team-showcase__label">{labelText}</span>
        )}

        {memberList.map((member, i) => {
          const isActive = i === activeIndex
          const hasLink = isActive && !!member.portfolioUrl

          return (
            <h2
              key={i}
              ref={(el) => { nameRefs.current[i] = el }}
              className={`team-showcase__name ${hasLink ? 'team-showcase__name--clickable' : ''}`}
              style={{
                opacity: activeIndex === null ? 1 : isActive ? 1 : inactiveOpacity,
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
  )
}

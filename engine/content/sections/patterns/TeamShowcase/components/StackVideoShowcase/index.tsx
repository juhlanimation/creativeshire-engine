'use client'

/**
 * StackVideoShowcase interactive widget.
 * Content Layer (L1) - renders stacked names with fullscreen video backgrounds.
 *
 * Desktop: Hover on a name to crossfade to that member's video.
 * Mobile: Scroll-based viewport-center detection auto-selects the closest name.
 *
 * Members are read from child widgets (CMS hierarchy). Each child provides
 * name, videoSrc, videoPoster, href via its props — the widget extracts these
 * and renders its own JSX (video layer + names overlay).
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
import { useViewportPortal } from '../../../../../../renderer/ViewportPortalContext'
import { executeAction } from '../../../../../actions'
import type { StackVideoShowcaseProps, ShowcaseMember } from './types'
import type { WidgetSchema } from '../../../../../../schema'

/**
 * Extract member data from a child widget's props.
 * Same pattern as StackTextRepeater / ExpandRowImageRepeater.
 */
function extractMember(widget: WidgetSchema): ShowcaseMember {
  const p = widget.props || {}
  return {
    name: String(p.name || p.content || ''),
    videoSrc: p.videoSrc ? String(p.videoSrc) : undefined,
    videoPoster: p.videoPoster ? String(p.videoPoster) : undefined,
    href: p.href ? String(p.href) : undefined,
  }
}

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
 * StackVideoShowcase widget component.
 * Renders stacked names with associated fullscreen background videos.
 */
export default function StackVideoShowcase({
  widgets,
  labelText = 'Vi er',
  inactiveOpacity = 0.2,
  videoTransitionMs = 500,
  nameTransitionMs = 300,
  actionPrefix,
  className,
  'data-behaviour': dataBehaviour,
}: StackVideoShowcaseProps) {
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

  // Extract member data from child widgets
  const memberList: ShowcaseMember[] = (widgets ?? []).map(extractMember)

  // Detect mobile breakpoint
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Play/pause videos on active index change + dispatch actions
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

    // Dispatch action on selection change
    if (actionPrefix) {
      if (activeIndex !== null) {
        const member = memberList[activeIndex]
        executeAction(`${actionPrefix}.select`, {
          index: activeIndex,
          name: member?.name,
          videoSrc: member?.videoSrc,
        })
      } else {
        executeAction(`${actionPrefix}.deselect`, {})
      }
    }
  // memberList is derived from widgets which is stable per render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, actionPrefix])

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

  // Click handler for members with href
  const handleClick = useCallback((index: number) => {
    if (index === activeIndex) {
      const member = memberList[index]
      if (member?.href) {
        window.open(member.href, '_blank', 'noopener,noreferrer')
      }
    }
  // memberList is derived from widgets which is stable per render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  // Nothing to render if members haven't resolved yet
  if (memberList.length === 0) return null

  const classes = [
    'stack-video-showcase',
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
        poster={member.videoPoster}
        className={`stack-video-showcase__video ${i === activeIndex ? 'stack-video-showcase__video--active' : ''}`}
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
    <div className="stack-video-showcase__names">
      {labelText && (
        <span className="stack-video-showcase__label">{labelText}</span>
      )}

      {memberList.map((member, i) => {
        const memberActive = i === activeIndex
        const hasLink = memberActive && !!member.href

        return (
          <h2
            key={i}
            ref={(el) => { nameRefs.current[i] = el }}
            className={`stack-video-showcase__name ${hasLink ? 'stack-video-showcase__name--clickable' : ''}`}
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
            className={`stack-video-showcase__viewport-overlay${isActive ? ' stack-video-showcase__viewport-overlay--active' : ''}`}
          >
            <div className="stack-video-showcase__viewport-videos">
              {videoElements}
            </div>
            {/* Display-only names — mirrors interactive names for visual continuity */}
            <div className="stack-video-showcase__overlay-names">
              {labelText && (
                <span className="stack-video-showcase__label">{labelText}</span>
              )}
              {memberList.map((member, i) => (
                <h2
                  key={i}
                  className="stack-video-showcase__name"
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
      <div className={`stack-video-showcase__video-layer${isActive ? ' stack-video-showcase__video-layer--active' : ''}`}>
        {videoElements}
      </div>
      {nameElements}
    </div>
  )
}

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('TeamShowcase__StackVideoShowcase', StackVideoShowcase)

'use client'

/**
 * HeroVideo widget (interactive).
 * Content Layer (L1) - full-screen video hero with text reveal.
 *
 * Features:
 * - Fixed full-viewport video with custom loop point (loopStartTime)
 * - Timed text overlay reveal (textRevealTime) via video timeupdate
 * - Auto-pause when hero is not visible (IntersectionObserver)
 * - Responsive scroll indicator (text on desktop, arrow on touch)
 *
 * Cover progress tracking is handled externally by the scroll/cover-progress behaviour.
 *
 * Why interactive (not pattern):
 * - Local state (showText)
 * - Video element refs and event handlers
 * - IntersectionObserver for visibility-based pause
 * - Multiple effects (timeupdate, ended, visibility)
 */

import { useState, useRef, useEffect } from 'react'
import type { HeroVideoProps } from './types'
import './styles.css'

/**
 * HeroVideo widget component.
 * Renders a full-screen video hero with intro timing.
 */
export default function HeroVideo({
  src,
  loopStartTime = 0,
  textRevealTime = 0,
  title,
  tagline,
  scrollIndicatorText = '(SCROLL)',
  className,
  'data-behaviour': dataBehaviour,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showText, setShowText] = useState(textRevealTime === 0)

  // Text reveal: watch video currentTime against textRevealTime
  useEffect(() => {
    if (textRevealTime === 0) {
      setShowText(true)
      return
    }

    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.currentTime >= textRevealTime) {
        setShowText(true)
        video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [textRevealTime])

  // Custom loop point: restart from loopStartTime when video ends
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      video.currentTime = loopStartTime
      video.play().catch(() => {
        // Autoplay may be blocked - silent fail
      })
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [loopStartTime])

  // Auto-pause when hero is not visible (scrolled past)
  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked - silent fail
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const containerClasses = [
    'hero-video',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      data-behaviour={dataBehaviour}
    >
      {/* Fixed full-viewport video background */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        className="hero-video__video"
        data-intro-video
      />

      {/* Text overlay with timed reveal */}
      <div className={`hero-video__overlay ${showText ? 'hero-video__overlay--visible' : ''}`}>
        <h1 className="hero-video__title">{title}</h1>
        {tagline && <p className="hero-video__tagline">{tagline}</p>}
      </div>

      {/* Scroll indicator with responsive display */}
      <div className={`hero-video__scroll-indicator ${showText ? 'hero-video__scroll-indicator--visible' : ''}`}>
        {scrollIndicatorText && (
          <span className="hero-video__scroll-text">{scrollIndicatorText}</span>
        )}
        <svg
          className="hero-video__scroll-arrow"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

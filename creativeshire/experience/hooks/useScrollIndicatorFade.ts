'use client'

/**
 * useScrollIndicatorFade - GSAP-based fade for scroll indicator.
 * Fades out the scroll indicator as the user scrolls down.
 * Uses ScrollTrigger for cross-browser compatibility.
 */

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Hook to fade out a scroll indicator element as user scrolls.
 * @param selector - CSS selector for the scroll indicator element (default: '#hero-scroll')
 */
export function useScrollIndicatorFade(selector: string = '#hero-scroll'): void {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const el = document.querySelector(selector)
      if (!el) return

      // Create ScrollTrigger to fade out the indicator
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: '30vh top',
        scrub: 0.3,
        onUpdate: (self) => {
          // Fade from 1 to 0 based on scroll progress
          gsap.set(el, { opacity: 1 - self.progress })
        },
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      // Kill any ScrollTriggers targeting the element
      ScrollTrigger.getAll()
        .filter(t => t.vars.trigger === document.documentElement)
        .forEach(t => t.kill())
    }
  }, [selector])
}

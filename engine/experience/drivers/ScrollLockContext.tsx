'use client'

/**
 * ScrollLockContext - generic key-based scroll lock service.
 *
 * Any system (intro, modal, transition) can participate in scroll locking
 * by calling lock('key') / unlock('key'). isLocked is true when any key
 * is active.
 *
 * Capture-phase event blocking (wheel, touchmove, keyboard) lives here,
 * making it the single source of truth for scroll prevention.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { useContainer } from '../../interface/ContainerContext'
import { useSiteContainer } from '../../renderer/SiteContainerContext'

interface ScrollLockAPI {
  /** Add a named scroll lock */
  lock: (key: string) => void
  /** Remove a named scroll lock */
  unlock: (key: string) => void
  /** Subscribe to lock state changes (for useSyncExternalStore) */
  subscribe: (callback: () => void) => () => void
  /** Get current lock state snapshot (for useSyncExternalStore) */
  getSnapshot: () => boolean
}

const ScrollLockContext = createContext<ScrollLockAPI | null>(null)

/**
 * Hook to access scroll lock controls.
 * Returns { isLocked, lock, unlock } or null if no provider.
 */
export function useScrollLock(): { isLocked: boolean; lock: (key: string) => void; unlock: (key: string) => void } | null {
  const api = useContext(ScrollLockContext)

  const isLocked = useSyncExternalStore(
    api?.subscribe ?? subscribeNoop,
    api?.getSnapshot ?? snapshotFalse,
    snapshotFalse,
  )

  if (!api) return null

  return { isLocked, lock: api.lock, unlock: api.unlock }
}

// SSR-safe fallbacks
const subscribeNoop = () => () => {}
const snapshotFalse = () => false

interface ScrollLockProviderProps {
  children: ReactNode
}

// Keys that cause scrolling
const SCROLL_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'PageUp', 'PageDown', 'Home', 'End',
  ' ', 'Space',
])

/**
 * ScrollLockProvider - provides generic scroll lock service.
 * Applies capture-phase event blocking when any lock is active.
 */
export function ScrollLockProvider({ children }: ScrollLockProviderProps): ReactNode {
  // Container-aware scroll locking
  const { mode, containerRef } = useContainer()
  const { siteContainer } = useSiteContainer()

  // Store everything in refs to avoid re-renders of the provider itself
  const locksRef = useRef(new Set<string>())
  const isLockedRef = useRef(false)
  const listenersAttachedRef = useRef(false)
  const subscribersRef = useRef(new Set<() => void>())

  // Stable refs for container resolution
  const modeRef = useRef(mode)
  const containerRefRef = useRef(containerRef)
  const siteContainerRef = useRef(siteContainer)
  modeRef.current = mode
  containerRefRef.current = containerRef
  siteContainerRef.current = siteContainer

  // Stable event handlers
  const preventEvent = useCallback((e: Event) => {
    e.preventDefault()
    e.stopImmediatePropagation()
  }, [])

  const preventKeyScroll = useCallback((e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }, [])

  // Apply or remove event listeners + overflow
  const applyLock = useCallback((locked: boolean) => {
    // Resolve scroll target
    const target = modeRef.current === 'contained' && containerRefRef.current?.current
      ? containerRefRef.current.current
      : siteContainerRef.current

    if (target) {
      target.style.overflow = locked ? 'hidden' : ''
    }

    if (locked && !listenersAttachedRef.current) {
      window.addEventListener('wheel', preventEvent, { passive: false, capture: true })
      window.addEventListener('touchmove', preventEvent, { passive: false, capture: true })
      window.addEventListener('keydown', preventKeyScroll as EventListener, { capture: true })
      listenersAttachedRef.current = true
    } else if (!locked && listenersAttachedRef.current) {
      window.removeEventListener('wheel', preventEvent, { capture: true })
      window.removeEventListener('touchmove', preventEvent, { capture: true })
      window.removeEventListener('keydown', preventKeyScroll as EventListener, { capture: true })
      listenersAttachedRef.current = false
    }
  }, [preventEvent, preventKeyScroll])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      applyLock(false)
    }
  }, [applyLock])

  // Stable API object (never changes)
  const api = useMemo<ScrollLockAPI>(() => ({
    lock: (key: string) => {
      const wasEmpty = locksRef.current.size === 0
      locksRef.current.add(key)
      if (wasEmpty && locksRef.current.size > 0) {
        isLockedRef.current = true
        applyLock(true)
        subscribersRef.current.forEach(fn => fn())
      }
    },
    unlock: (key: string) => {
      const hadKeys = locksRef.current.size > 0
      locksRef.current.delete(key)
      if (hadKeys && locksRef.current.size === 0) {
        isLockedRef.current = false
        applyLock(false)
        subscribersRef.current.forEach(fn => fn())
      }
    },
    subscribe: (callback: () => void) => {
      subscribersRef.current.add(callback)
      return () => { subscribersRef.current.delete(callback) }
    },
    getSnapshot: () => isLockedRef.current,
  }), [applyLock])

  return (
    <ScrollLockContext.Provider value={api}>
      {children}
    </ScrollLockContext.Provider>
  )
}

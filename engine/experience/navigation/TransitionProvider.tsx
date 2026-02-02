'use client'

/**
 * TransitionProvider - context for page transition stacks.
 *
 * Provides exit and entry stacks that components can register tasks to.
 * EngineLink uses this to execute exit tasks before navigation.
 * Entry tasks are executed after the new page mounts.
 */

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { TransitionStack, createTask } from './TransitionStack'
import type { TransitionTask, PageTransitionConfig } from '../experiences/types'

// =============================================================================
// Types
// =============================================================================

export type TransitionPhase = 'idle' | 'exiting' | 'entering'

export interface TransitionContextValue {
  /** Current transition phase */
  phase: TransitionPhase

  /** Register an exit task (returns unregister function) */
  registerExitTask: (task: TransitionTask) => () => void

  /** Register an entry task (returns unregister function) */
  registerEntryTask: (task: TransitionTask) => () => void

  /** Start transition to a URL (called by EngineLink) */
  startTransition: (url: string, navigate: () => void) => Promise<void>

  /** Signal that new page has mounted (triggers entry tasks) */
  signalPageReady: () => void

  /** Configuration from experience */
  config?: PageTransitionConfig

  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean
}

// =============================================================================
// Context
// =============================================================================

const TransitionContext = createContext<TransitionContextValue | null>(null)

// =============================================================================
// Provider Props
// =============================================================================

export interface TransitionProviderProps {
  /** Page transition config from experience */
  config?: PageTransitionConfig
  /** Child components */
  children: ReactNode
}

// =============================================================================
// Provider Component
// =============================================================================

export function TransitionProvider({
  config,
  children,
}: TransitionProviderProps) {
  const exitStackRef = useRef(new TransitionStack())
  const entryStackRef = useRef(new TransitionStack())

  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  /**
   * Register an exit task.
   */
  const registerExitTask = useCallback((task: TransitionTask): (() => void) => {
    return exitStackRef.current.add(task)
  }, [])

  /**
   * Register an entry task.
   */
  const registerEntryTask = useCallback((task: TransitionTask): (() => void) => {
    return entryStackRef.current.add(task)
  }, [])

  /**
   * Start a page transition.
   * Executes exit stack, then calls navigate, then waits for signalPageReady.
   */
  const startTransition = useCallback(
    async (url: string, navigate: () => void): Promise<void> => {
      // Skip if already transitioning
      if (phase !== 'idle') return

      // Skip animations if reduced motion
      if (prefersReducedMotion && config?.respectReducedMotion !== false) {
        navigate()
        return
      }

      // Start exit phase
      setPhase('exiting')

      // Execute exit tasks with timeout
      const timeout = config?.timeout ?? 2000
      const exitDuration = config?.defaultExitDuration ?? 0

      // If no tasks but default duration, wait that long
      if (exitStackRef.current.size === 0 && exitDuration > 0) {
        await new Promise((r) => setTimeout(r, exitDuration))
      } else {
        await exitStackRef.current.execute(timeout)
      }

      // Navigate
      navigate()

      // Phase will be set to 'entering' by signalPageReady
    },
    [phase, prefersReducedMotion, config]
  )

  /**
   * Signal that the new page has mounted.
   * Executes entry tasks.
   */
  const signalPageReady = useCallback(async () => {
    // Only proceed if we were in a transition
    if (phase !== 'exiting') {
      // Page loaded without transition (direct navigation or initial load)
      // Still run entry tasks if any
      if (entryStackRef.current.size > 0) {
        setPhase('entering')
        const timeout = config?.timeout ?? 2000
        await entryStackRef.current.execute(timeout)
        setPhase('idle')
      }
      return
    }

    // Start entry phase
    setPhase('entering')

    // Execute entry tasks
    const timeout = config?.timeout ?? 2000
    const entryDuration = config?.defaultEntryDuration ?? 0

    if (entryStackRef.current.size === 0 && entryDuration > 0) {
      await new Promise((r) => setTimeout(r, entryDuration))
    } else {
      await entryStackRef.current.execute(timeout)
    }

    // Complete
    setPhase('idle')
  }, [phase, config])

  const value: TransitionContextValue = {
    phase,
    registerExitTask,
    registerEntryTask,
    startTransition,
    signalPageReady,
    config,
    prefersReducedMotion,
  }

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  )
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Access transition context.
 * Throws if not within TransitionProvider.
 */
export function useTransition(): TransitionContextValue {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider')
  }
  return context
}

/**
 * Get current transition phase.
 */
export function useTransitionPhase(): TransitionPhase {
  const { phase } = useTransition()
  return phase
}

/**
 * Try to get transition context (returns null if not available).
 * Useful for EngineLink which should work even without provider.
 */
export function useTransitionOptional(): TransitionContextValue | null {
  return useContext(TransitionContext)
}

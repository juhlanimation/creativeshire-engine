/**
 * Intro layer barrel export.
 * Intro sequences run before Experience takes over.
 */

// Types
export type {
  IntroPhase,
  IntroState,
  IntroConfig,
  IntroMeta,
  IntroPatternMeta,
  IntroPattern,
  IntroTriggerConfig,
  IntroActions,
  SequenceStepConfig,
  IntroCategory,
} from './types'

// Provider, context, and content gate
export { IntroProvider } from './IntroProvider'
export type { IntroProviderProps } from './IntroProvider'
export { IntroContentGate } from './IntroContentGate'
export type { IntroContentGateProps } from './IntroContentGate'
export { IntroTriggerInitializer } from './IntroTriggerInitializer'
export type { IntroTriggerInitializerProps } from './IntroTriggerInitializer'
export { IntroContext, useIntro, useIntroRequired } from './IntroContext'
export type { IntroContextValue, IntroStore } from './IntroContext'

// Registry (pattern registry)
export {
  registerIntroPattern,
  registerLazyIntroPattern,
  getIntroPattern,
  getIntroPatternAsync,
  preloadIntroPattern,
  getIntroPatternIds,
  getAllIntroPatterns,
  defineIntroPatternMeta,
  getAllIntroPatternMetas,
  getIntroOverride,
  setIntroOverride,
  DEV_INTRO_PARAM,
  // Compiled intro registry
  registerIntro,
  getRegisteredIntro,
  getRegisteredIntroMeta,
  getAllRegisteredIntroMetas,
  findIntroIdByConfig,
} from './registry'

// Patterns
export {
  videoGatePattern,
  timedPattern,
  scrollRevealPattern,
  sequenceTimedPattern,
  ensureIntroPatternsRegistered,
} from './patterns'

// Compiled intros
export { ensureIntrosRegistered } from './intros'

// Triggers
export {
  useVideoTime,
  useTimer,
  useSequence,
  usePhaseController,
} from './triggers'
export type {
  UseVideoTimeOptions,
  UseTimerOptions,
  UseSequenceOptions,
  UsePhaseControllerOptions,
} from './triggers'

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
  IntroActions,
  SequenceStepConfig,
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

// Dev override helpers
export {
  getIntroOverride,
  setIntroOverride,
  DEV_INTRO_PARAM,
} from './registry'

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

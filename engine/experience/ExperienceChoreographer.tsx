'use client'

/**
 * ExperienceChoreographer - renders experience controllers + presentation.
 *
 * No model name checks. Reads the experience definition and renders:
 * - Controllers (from experience.controller)
 * - Presentation wrapper + page wrapper
 *
 * Experience chrome (before/after/overlay) stays in SiteRenderer because
 * ExperienceChromeRenderer imports chrome/registry which creates a circular
 * dependency through Turbopack's module evaluation order.
 *
 * Extracted from SiteRenderer to keep experience logic in the experience layer.
 */

import { useMemo, type ReactNode, type CSSProperties } from 'react'
import { useExperience } from './experiences/ExperienceProvider'
import { PresentationWrapper } from './experiences/PresentationWrapper'
import { BehaviourWrapper } from './behaviours'
import type { Experience, ExperienceConstraints } from './experiences/types'

/**
 * Generates CSS properties from experience constraints.
 * Applied to the page wrapper container.
 */
function getConstraintStyles(constraints?: ExperienceConstraints): CSSProperties | undefined {
  if (!constraints) return undefined

  const styles: Record<string, string | number> = {}

  if (constraints.fullViewportSections) {
    styles['--section-min-height'] = '100vh'
  }

  if (constraints.sectionOverflow) {
    styles.overflow = constraints.sectionOverflow
  }

  return Object.keys(styles).length > 0 ? (styles as CSSProperties) : undefined
}

/**
 * Wraps content with experience pageWrapper if defined.
 */
function PageWrapperRenderer({
  experience,
  children,
}: {
  experience: Experience
  children: ReactNode
}) {
  const constraintStyles = useMemo(
    () => getConstraintStyles(experience.constraints),
    [experience.constraints]
  )

  if (!experience.pageWrapper) {
    if (constraintStyles) {
      return <div style={constraintStyles}>{children}</div>
    }
    return <>{children}</>
  }

  return (
    <BehaviourWrapper
      behaviourId={experience.pageWrapper.behaviourId}
      options={experience.pageWrapper.options}
      style={constraintStyles}
    >
      {children}
    </BehaviourWrapper>
  )
}

interface ExperienceChoreographerProps {
  children: ReactNode
}

export function ExperienceChoreographer({ children }: ExperienceChoreographerProps): ReactNode {
  const { experience, store } = useExperience()

  // Resolve controllers from experience definition
  const controllers = useMemo(() => {
    if (!experience.controller) return []
    return Array.isArray(experience.controller)
      ? experience.controller
      : [experience.controller]
  }, [experience.controller])

  return (
    <>
      {/* Controllers from experience definition */}
      {controllers.map((Controller, i) => (
        <Controller key={i} />
      ))}

      {/* Presentation wrapper + page wrapper + page content */}
      <PresentationWrapper config={experience.presentation} store={store}>
        <PageWrapperRenderer experience={experience}>
          {children}
        </PageWrapperRenderer>
      </PresentationWrapper>
    </>
  )
}

export default ExperienceChoreographer

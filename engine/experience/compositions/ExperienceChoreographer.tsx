'use client'

/**
 * ExperienceChoreographer - renders experience controllers + presentation.
 *
 * No model name checks. Reads the experience definition and renders:
 * - Controllers (from experience.controller)
 * - Presentation wrapper with optional constraint styles
 *
 * Experience chrome (before/after/overlay) stays in SiteRenderer because
 * ExperienceChromeRenderer imports chrome/registry which creates a circular
 * dependency through Turbopack's module evaluation order.
 *
 * Extracted from SiteRenderer to keep experience logic in the experience layer.
 */

import { useMemo, type ReactNode, type CSSProperties } from 'react'
import { useExperience } from './ExperienceProvider'
import { PresentationWrapper } from './PresentationWrapper'
import type { ExperienceConstraints } from './types'

/**
 * Generates CSS properties from experience constraints.
 * Applied to a constraint wrapper div when present.
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

  const constraintStyles = useMemo(
    () => getConstraintStyles(experience.constraints),
    [experience.constraints]
  )

  // Wrap with constraint div only when constraints produce styles
  const content = constraintStyles
    ? <div style={constraintStyles}>{children}</div>
    : children

  return (
    <>
      {/* Controllers from experience definition */}
      {controllers.map((Controller, i) => (
        <Controller key={i} />
      ))}

      {/* Presentation wrapper + page content */}
      <PresentationWrapper config={experience.presentation} store={store}>
        {content}
      </PresentationWrapper>
    </>
  )
}

export default ExperienceChoreographer

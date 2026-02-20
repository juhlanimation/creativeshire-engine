/**
 * Experience Architecture Test
 *
 * Validates that experiences are properly registered with required metadata.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { getExperienceAsync, getExperienceIds } from '../../engine/experience/experiences'
import type { Experience } from '../../engine/experience/experiences'

describe('Experience Architecture', () => {
  let experiences: Experience[]

  beforeAll(async () => {
    const ids = getExperienceIds()
    experiences = (await Promise.all(ids.map(getExperienceAsync))).filter(Boolean) as Experience[]
  })

  it('all experience metas have icon and tags', () => {
    const violations: string[] = []

    for (const exp of experiences) {
      if (!exp.icon) {
        violations.push(`Experience "${exp.id}" missing icon`)
      }
      if (!exp.tags || exp.tags.length === 0) {
        violations.push(`Experience "${exp.id}" missing tags`)
      }
    }

    expect(violations, violations.join('\n')).toHaveLength(0)
  })
})

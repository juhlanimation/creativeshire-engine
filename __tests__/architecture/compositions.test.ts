/**
 * Composition Architecture Test
 *
 * Validates that compositions are properly registered with required metadata.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { getCompositionAsync, getCompositionIds } from '../../engine/experience/compositions'
import type { ExperienceComposition } from '../../engine/experience/compositions'

describe('Composition Architecture', () => {
  let compositions: ExperienceComposition[]

  beforeAll(async () => {
    const ids = getCompositionIds()
    compositions = (await Promise.all(ids.map(getCompositionAsync))).filter(Boolean) as ExperienceComposition[]
  })

  it('all composition metas have icon and tags', () => {
    const violations: string[] = []

    for (const comp of compositions) {
      if (!comp.icon) {
        violations.push(`Composition "${comp.id}" missing icon`)
      }
      if (!comp.tags || comp.tags.length === 0) {
        violations.push(`Composition "${comp.id}" missing tags`)
      }
    }

    expect(violations, violations.join('\n')).toHaveLength(0)
  })
})

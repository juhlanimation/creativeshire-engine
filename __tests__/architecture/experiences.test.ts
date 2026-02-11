/**
 * Experience Settings Architecture Test
 *
 * Validates that experiences with meta files properly wire their settings
 * into the Experience object so they're available via getAllExperienceMetas().
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { getExperienceAsync, getExperienceIds } from '../../engine/experience/experiences'
import type { Experience } from '../../engine/experience/experiences'

describe('Experience Settings', () => {
  let experiences: Experience[]

  beforeAll(async () => {
    const ids = getExperienceIds()
    experiences = (await Promise.all(ids.map(getExperienceAsync))).filter(Boolean) as Experience[]
  })

  it('all experiences (except simple) have settings defined', () => {
    const violations: string[] = []

    for (const exp of experiences) {
      // Skip experiences that intentionally have no settings
      if (exp.id === 'simple') continue       // bare fallback
      if (exp.id === 'cover-scroll') continue // no configurable options

      if (!exp.settings || Object.keys(exp.settings).length === 0) {
        violations.push(`Experience "${exp.id}" missing settings`)
      }
    }

    if (violations.length > 0) {
      console.log('\n Experience settings must be wired from meta.ts:\n')
      violations.forEach((v) => console.log(`  - ${v}`))
      console.log('\nFix: Add `import { meta } from "./meta"` and `settings: meta.settings` to the experience.\n')
    }

    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  it('each setting has required fields (type, label, default)', () => {
    const violations: string[] = []

    for (const exp of experiences) {
      if (!exp.settings) continue

      for (const [key, setting] of Object.entries(exp.settings)) {
        if (!setting) continue

        if (!setting.type) {
          violations.push(`${exp.id}.settings.${key}: missing 'type'`)
        }
        if (!setting.label) {
          violations.push(`${exp.id}.settings.${key}: missing 'label'`)
        }
        if (setting.default === undefined) {
          violations.push(`${exp.id}.settings.${key}: missing 'default'`)
        }
      }
    }

    if (violations.length > 0) {
      console.log('\n Setting definitions must include type, label, and default:\n')
      violations.forEach((v) => console.log(`  - ${v}`))
    }

    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  it('experience settings match meta.ts settings (no drift)', async () => {
    // Dynamically discover and import all experience meta files
    const ids = getExperienceIds()
    const metaModules = await Promise.all(
      ids.map(async (id) => {
        try {
          return await import(`../../engine/experience/experiences/${id}/meta`)
        } catch {
          return null
        }
      })
    )

    const metas = metaModules.filter(Boolean).map((m) => m!.meta)
    const violations: string[] = []

    for (const meta of metas) {
      const experience = experiences.find((e) => e.id === meta.id)
      if (!experience) {
        violations.push(`Experience "${meta.id}" not found in registry`)
        continue
      }

      // Check that settings reference is the same object (not a copy)
      if (experience.settings !== meta.settings) {
        const expKeys = experience.settings ? Object.keys(experience.settings).sort().join(',') : 'none'
        const metaKeys = meta.settings ? Object.keys(meta.settings).sort().join(',') : 'none'

        if (expKeys !== metaKeys) {
          violations.push(
            `${meta.id}: settings mismatch - experience has [${expKeys}], meta has [${metaKeys}]`
          )
        }
      }
    }

    expect(violations, violations.join('\n')).toHaveLength(0)
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

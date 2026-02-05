/**
 * Section Discovery API Tests
 *
 * Tests for platform section discovery functions.
 */

import { describe, it, expect } from 'vitest'
import {
  getAvailableSections,
  getSectionsGroupedByCategory,
  canAddSection,
  createSectionFromPattern,
} from '../../engine/interface/discovery'
import { sectionRegistry } from '../../engine/content/sections/registry'
import type { SectionSchema } from '../../engine/schema/section'

describe('Section Discovery API', () => {
  describe('getAvailableSections', () => {
    it('returns all sections when page is empty', () => {
      const available = getAvailableSections([])

      // Should return all registered sections
      expect(available).toHaveLength(Object.keys(sectionRegistry).length)
      expect(available.every((s) => s.canAdd)).toBe(true)
    })

    it('unique sections are disabled when already present', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'hero-1',
          patternId: 'Hero',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const available = getAvailableSections(existingSections)
      const hero = available.find((s) => s.id === 'Hero')

      expect(hero?.canAdd).toBe(false)
      expect(hero?.reason).toMatch(/only one/i)
    })

    it('non-unique sections remain available when present', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'projects-1',
          patternId: 'FeaturedProjects',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const available = getAvailableSections(existingSections)
      const featured = available.find((s) => s.id === 'FeaturedProjects')

      expect(featured?.canAdd).toBe(true)
      expect(featured?.reason).toBeUndefined()
    })

    it('multiple unique sections can be independently disabled', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'hero-1',
          patternId: 'Hero',
          layout: { type: 'stack' },
          widgets: [],
        },
        {
          id: 'about-1',
          patternId: 'About',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const available = getAvailableSections(existingSections)
      const hero = available.find((s) => s.id === 'Hero')
      const about = available.find((s) => s.id === 'About')
      const featured = available.find((s) => s.id === 'FeaturedProjects')

      expect(hero?.canAdd).toBe(false)
      expect(about?.canAdd).toBe(false)
      expect(featured?.canAdd).toBe(true)
    })

    it('includes settings from meta', () => {
      const available = getAvailableSections([])
      const hero = available.find((s) => s.id === 'Hero')

      expect(hero?.settings).toBeDefined()
      expect(hero?.settings?.introText).toBeDefined()
    })
  })

  describe('getSectionsGroupedByCategory', () => {
    it('groups sections by category', () => {
      const grouped = getSectionsGroupedByCategory([])

      expect(grouped.hero).toBeDefined()
      expect(grouped.about).toBeDefined()
      expect(grouped.project).toBeDefined()
      expect(grouped.contact).toBeDefined()
      expect(grouped.content).toBeDefined()
      expect(grouped.gallery).toBeDefined()
    })

    it('hero category contains Hero section', () => {
      const grouped = getSectionsGroupedByCategory([])

      expect(grouped.hero.some((s) => s.id === 'Hero')).toBe(true)
    })

    it('about category contains About section', () => {
      const grouped = getSectionsGroupedByCategory([])

      expect(grouped.about.some((s) => s.id === 'About')).toBe(true)
    })

    it('project category contains FeaturedProjects and OtherProjects', () => {
      const grouped = getSectionsGroupedByCategory([])

      expect(grouped.project.some((s) => s.id === 'FeaturedProjects')).toBe(true)
      expect(grouped.project.some((s) => s.id === 'OtherProjects')).toBe(true)
    })

    it('respects uniqueness constraints in grouped results', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'hero-1',
          patternId: 'Hero',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const grouped = getSectionsGroupedByCategory(existingSections)
      const hero = grouped.hero.find((s) => s.id === 'Hero')

      expect(hero?.canAdd).toBe(false)
    })
  })

  describe('canAddSection', () => {
    it('returns valid for unknown patterns', () => {
      const result = canAddSection('NonExistent', [])

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.reason).toMatch(/unknown/i)
      }
    })

    it('returns valid for non-unique sections', () => {
      const result = canAddSection('FeaturedProjects', [])

      expect(result.valid).toBe(true)
    })

    it('returns valid for non-unique sections even when present', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'projects-1',
          patternId: 'FeaturedProjects',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const result = canAddSection('FeaturedProjects', existingSections)

      expect(result.valid).toBe(true)
    })

    it('returns valid for unique sections when not present', () => {
      const result = canAddSection('Hero', [])

      expect(result.valid).toBe(true)
    })

    it('returns invalid for unique sections when already present', () => {
      const existingSections: SectionSchema[] = [
        {
          id: 'hero-1',
          patternId: 'Hero',
          layout: { type: 'stack' },
          widgets: [],
        },
      ]

      const result = canAddSection('Hero', existingSections)

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.reason).toMatch(/only one/i)
      }
    })
  })

  describe('createSectionFromPattern', () => {
    it('creates section with patternId set', async () => {
      const section = await createSectionFromPattern('FeaturedProjects', {
        projects: [],
      })

      expect(section.patternId).toBe('FeaturedProjects')
      expect(section.id).toBe('projects') // Default from factory
    })

    it('creates section with custom id', async () => {
      const section = await createSectionFromPattern('FeaturedProjects', {
        id: 'my-projects',
        projects: [],
      })

      expect(section.patternId).toBe('FeaturedProjects')
      expect(section.id).toBe('my-projects')
    })

    it('throws for unknown patterns', async () => {
      await expect(createSectionFromPattern('NonExistent', {})).rejects.toThrow(
        /unknown/i
      )
    })

    it('creates Hero section with required props', async () => {
      const section = await createSectionFromPattern('Hero', {
        introText: 'Hello',
        roles: ['Developer'],
        videoSrc: '/video.mp4',
      })

      expect(section.patternId).toBe('Hero')
      expect(section.id).toBe('hero')
      expect(section.widgets.length).toBeGreaterThan(0)
    })
  })
})

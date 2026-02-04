/**
 * Integration tests for EngineStore and the platform contract.
 * Tests store creation, state management, controller operations, and events.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEngineStore, createSnapshot } from '../../engine/interface/EngineStore'
import type { EngineInput, EngineEvents, EngineState } from '../../engine/interface/types'
import type { SiteSchema, PageSchema, SectionSchema } from '../../engine/schema'

// =============================================================================
// Test Fixtures
// =============================================================================

function createTestSite(): SiteSchema {
  return {
    id: 'test-site',
    schemaVersion: '2.0.0',
    pages: [{ id: 'home', slug: '/' }],
    experience: { id: 'stacking' },
    chrome: { regions: {}, overlays: {} },
  }
}

function createTestPage(): PageSchema {
  return {
    id: 'home',
    slug: '/',
    sections: [
      {
        id: 'section-1',
        layout: { type: 'stack' },
        widgets: [
          { type: 'Text', props: { content: 'Hello' } },
          { type: 'Image', props: { src: '/test.jpg' } },
        ],
      },
      {
        id: 'section-2',
        layout: { type: 'stack' },
        widgets: [{ type: 'Button', props: { label: 'Click' } }],
      },
    ],
  }
}

function createTestInput(overrides: Partial<EngineInput> = {}): EngineInput {
  return {
    site: createTestSite(),
    page: createTestPage(),
    ...overrides,
  }
}

// =============================================================================
// Store Creation Tests
// =============================================================================

describe('EngineStore', () => {
  describe('creation', () => {
    it('creates store with initial state from input', () => {
      const input = createTestInput()
      const store = createEngineStore(input)
      const state = store.getState()

      expect(state.site).toEqual(input.site)
      expect(state.page).toEqual(input.page)
      expect(state.isReady).toBe(false)
      expect(state.lastError).toBe(null)
    })

    it('uses site.experience.id as default experienceId', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      expect(store.getState().experienceId).toBe('stacking')
    })

    it('allows overriding experienceId via input', () => {
      const input = createTestInput({ experienceId: 'parallax' })
      const store = createEngineStore(input)

      expect(store.getState().experienceId).toBe('parallax')
    })

    it('defaults isPreview to false', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      expect(store.getState().isPreview).toBe(false)
    })

    it('allows overriding isPreview via input', () => {
      const input = createTestInput({ isPreview: true })
      const store = createEngineStore(input)

      expect(store.getState().isPreview).toBe(true)
    })
  })

  // ===========================================================================
  // Event Callback Tests
  // ===========================================================================

  describe('events', () => {
    it('calls onReady when setReady(true) is called', () => {
      const onReady = vi.fn()
      const input = createTestInput()
      const store = createEngineStore(input, { onReady })

      expect(onReady).not.toHaveBeenCalled()

      store.getState().setReady(true)

      expect(onReady).toHaveBeenCalledTimes(1)
    })

    it('calls onError when setError is called with error', () => {
      const onError = vi.fn()
      const input = createTestInput()
      const store = createEngineStore(input, { onError })

      const error = { code: 'RENDER_ERROR' as const, message: 'Test error' }
      store.getState().setError(error)

      expect(onError).toHaveBeenCalledWith(error)
    })

    it('calls onStateChange when state is modified', () => {
      const onStateChange = vi.fn()
      const input = createTestInput()
      const store = createEngineStore(input, { onStateChange })

      store.getState().setExperience('new-mode')

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ experienceId: 'new-mode' })
      )
    })

    it('calls onConstraintViolation when constraint is violated', () => {
      const onConstraintViolation = vi.fn()
      const input = createTestInput()
      const store = createEngineStore(input, { onConstraintViolation })

      // Create section with too deep nesting (> 3 levels)
      const deeplyNested: SectionSchema = {
        id: 'deep',
        layout: { type: 'stack' },
        widgets: [
          {
            type: 'Flex',
            widgets: [
              {
                type: 'Flex',
                widgets: [
                  {
                    type: 'Flex',
                    widgets: [{ type: 'Text' }], // 4th level - exceeds limit
                  },
                ],
              },
            ],
          },
        ],
      }

      const result = store.getState().addSection(deeplyNested)

      expect(result.valid).toBe(false)
      expect(result.error && 'type' in result.error ? result.error.type : null).toBe('nesting-depth')
      expect(onConstraintViolation).toHaveBeenCalled()
    })
  })

  // ===========================================================================
  // Section Operations Tests
  // ===========================================================================

  describe('section operations', () => {
    it('addSection adds to end by default', () => {
      const input = createTestInput()
      const store = createEngineStore(input)
      const initialCount = store.getState().page.sections.length

      const newSection: SectionSchema = { id: 'new-section', layout: { type: 'stack' }, widgets: [] }
      const result = store.getState().addSection(newSection)

      expect(result.valid).toBe(true)
      expect(store.getState().page.sections.length).toBe(initialCount + 1)
      expect(store.getState().page.sections[initialCount].id).toBe('new-section')
    })

    it('addSection adds at position when specified', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const newSection: SectionSchema = { id: 'inserted', layout: { type: 'stack' }, widgets: [] }
      store.getState().addSection(newSection, 0)

      expect(store.getState().page.sections[0].id).toBe('inserted')
    })

    it('addSection enforces section limit', () => {
      const input = createTestInput()
      // Create page with 19 sections
      input.page.sections = Array.from({ length: 19 }, (_, i) => ({
        id: `section-${i}`,
        layout: { type: 'stack' as const },
        widgets: [],
      }))

      const store = createEngineStore(input)

      // 20th section should succeed
      const result1 = store.getState().addSection({ id: 'section-20', layout: { type: 'stack' }, widgets: [] })
      expect(result1.valid).toBe(true)

      // 21st section should fail
      const result2 = store.getState().addSection({ id: 'section-21', layout: { type: 'stack' }, widgets: [] })
      expect(result2.valid).toBe(false)
      expect(result2.error && 'type' in result2.error ? result2.error.type : null).toBe('section-limit')
    })

    it('removeSection removes existing section', () => {
      const input = createTestInput()
      const store = createEngineStore(input)
      const initialCount = store.getState().page.sections.length

      const result = store.getState().removeSection('section-1')

      expect(result.valid).toBe(true)
      expect(store.getState().page.sections.length).toBe(initialCount - 1)
      expect(store.getState().page.sections.find((s) => s.id === 'section-1')).toBeUndefined()
    })

    it('removeSection returns error for non-existent section', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().removeSection('non-existent')

      expect(result.valid).toBe(false)
      expect(result.error && 'type' in result.error ? result.error.type : null).toBe('not-found')
    })

    it('updateSection modifies existing section', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().updateSection('section-1', {
        widgets: [{ type: 'Text', props: { content: 'Updated' } }],
      })

      expect(result.valid).toBe(true)
      const section = store.getState().page.sections.find((s) => s.id === 'section-1')
      expect(section?.widgets?.[0].props?.content).toBe('Updated')
    })

    it('reorderSections changes section order', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().reorderSections(['section-2', 'section-1'])

      expect(result.valid).toBe(true)
      expect(store.getState().page.sections[0].id).toBe('section-2')
      expect(store.getState().page.sections[1].id).toBe('section-1')
    })

    it('reorderSections fails with unknown section ID', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().reorderSections(['section-1', 'unknown'])

      expect(result.valid).toBe(false)
      expect(result.error && 'type' in result.error ? result.error.type : null).toBe('not-found')
    })
  })

  // ===========================================================================
  // Widget Operations Tests
  // ===========================================================================

  describe('widget operations', () => {
    it('updateWidget modifies widget at path', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().updateWidget(
        { sectionId: 'section-1', widgetIndices: [0] },
        { props: { content: 'Modified' } }
      )

      expect(result.valid).toBe(true)
      const section = store.getState().page.sections.find((s) => s.id === 'section-1')
      expect(section?.widgets?.[0].props?.content).toBe('Modified')
    })

    it('updateWidget fails for non-existent section', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      const result = store.getState().updateWidget(
        { sectionId: 'non-existent', widgetIndices: [0] },
        { props: {} }
      )

      expect(result.valid).toBe(false)
      expect(result.error && 'type' in result.error ? result.error.type : null).toBe('not-found')
    })
  })

  // ===========================================================================
  // Experience Operations Tests
  // ===========================================================================

  describe('experience operations', () => {
    it('setExperience changes experienceId', () => {
      const input = createTestInput()
      const store = createEngineStore(input)

      store.getState().setExperience('new-mode')

      expect(store.getState().experienceId).toBe('new-mode')
    })
  })

  // ===========================================================================
  // Snapshot Tests
  // ===========================================================================

  describe('createSnapshot', () => {
    it('creates read-only snapshot of state', () => {
      const input = createTestInput()
      const store = createEngineStore(input)
      const snapshot = createSnapshot(store.getState())

      expect(snapshot.site).toEqual(input.site)
      expect(snapshot.page).toEqual(input.page)
      expect(snapshot.experienceId).toBe('stacking')
      expect(snapshot.isPreview).toBe(false)
      expect(snapshot.isReady).toBe(false)
      expect(snapshot.sectionCount).toBe(2)
      expect(snapshot.widgetCount).toBe(3) // 2 in section-1, 1 in section-2
    })
  })
})

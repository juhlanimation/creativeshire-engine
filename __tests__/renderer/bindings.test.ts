/**
 * Tests for binding resolution and repeater expansion.
 * Verifies __label extraction for platform hierarchy display.
 */

import { describe, it, expect } from 'vitest'
import { expandRepeater, processWidgets } from '../../engine/renderer/bindings'
import type { WidgetSchema } from '../../engine/schema'

// =============================================================================
// __label Extraction Tests
// =============================================================================

describe('expandRepeater __label extraction', () => {
  describe('priority chain', () => {
    it('uses title first when available', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{ title: 'Marvel Midnight Sun', name: 'project-1', label: 'Featured' }],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('Marvel Midnight Sun')
    })

    it('falls back to name when title unavailable', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{ name: 'Alice Chen', label: 'Team Lead' }],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('Alice Chen')
    })

    it('falls back to label when title and name unavailable', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{ label: 'Featured', description: 'A featured item' }],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('Featured')
    })

    it('falls back to $index when no label props available', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{}, {}, {}],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('0')
      expect(expanded[1].__label).toBe('1')
      expect(expanded[2].__label).toBe('2')
    })
  })

  describe('type coercion', () => {
    it('stringifies numeric titles', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{ title: 2024 }, { title: 2025 }],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('2024')
      expect(expanded[1].__label).toBe('2025')
    })

    it('handles primitive arrays (fallback to index)', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.tags }}',
        type: 'Badge',
      }

      const content = {
        tags: ['React', 'TypeScript', 'Next.js'],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('0')
      expect(expanded[1].__label).toBe('1')
      expect(expanded[2].__label).toBe('2')
    })
  })

  describe('real-world scenarios', () => {
    it('extracts project titles for gallery items', () => {
      const widget: WidgetSchema = {
        id: 'project-card',
        __repeat: '{{ content.projects }}',
        type: 'Flex',
        props: { direction: 'column' },
        widgets: [
          { type: 'Text', props: { content: '{{ item.title }}' } },
          { type: 'Text', props: { content: '{{ item.year }}' } },
        ],
      }

      const content = {
        projects: [
          { title: 'Marvel Midnight Sun', year: '2022' },
          { title: 'Diablo IV', year: '2023' },
          { title: 'Overwatch 2', year: '2022' },
        ],
      }

      const expanded = expandRepeater(widget, content)

      expect(expanded).toHaveLength(3)
      expect(expanded[0].__label).toBe('Marvel Midnight Sun')
      expect(expanded[1].__label).toBe('Diablo IV')
      expect(expanded[2].__label).toBe('Overwatch 2')
    })

    it('extracts team member names', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.team }}',
        type: 'Card',
      }

      const content = {
        team: [
          { name: 'Alice Chen', role: 'Designer' },
          { name: 'Bob Smith', role: 'Developer' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__label).toBe('Alice Chen')
      expect(expanded[1].__label).toBe('Bob Smith')
    })
  })

  describe('guarantee: every expanded widget has __label', () => {
    it('always sets __label (never undefined)', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Box',
      }

      // Empty objects with no label-able properties
      const content = {
        items: [{}, { foo: 'bar' }, { baz: 123 }],
      }

      const expanded = expandRepeater(widget, content)

      expanded.forEach((w, i) => {
        expect(w.__label).toBeDefined()
        expect(typeof w.__label).toBe('string')
        expect(w.__label).toBe(String(i))
      })
    })
  })
})

// =============================================================================
// processWidgets Integration Tests
// =============================================================================

describe('processWidgets with __label', () => {
  it('preserves __label through nested processing', () => {
    const widgets: WidgetSchema[] = [
      {
        __repeat: '{{ content.sections }}',
        type: 'Stack',
        widgets: [{ type: 'Text', props: { content: '{{ item.title }}' } }],
      },
    ]

    const content = {
      sections: [{ title: 'Hero' }, { title: 'About' }, { title: 'Contact' }],
    }

    const processed = processWidgets(widgets, content)

    expect(processed).toHaveLength(3)
    expect(processed[0].__label).toBe('Hero')
    expect(processed[1].__label).toBe('About')
    expect(processed[2].__label).toBe('Contact')
  })
})

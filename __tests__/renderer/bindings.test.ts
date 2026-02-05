/**
 * Tests for binding resolution and repeater expansion.
 * Verifies __label extraction for platform hierarchy display.
 */

import { describe, it, expect } from 'vitest'
import {
  expandRepeater,
  processWidgets,
  isRepeaterTemplate,
  getRepeaterInfo,
} from '../../engine/renderer/bindings'
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

// =============================================================================
// Key-Based Identity Tests
// =============================================================================

describe('expandRepeater key-based identity', () => {
  describe('__key field', () => {
    it('uses id field by default for widget ID suffix', () => {
      const widget: WidgetSchema = {
        id: 'project-card',
        __repeat: '{{ content.projects }}',
        type: 'Card',
      }

      const content = {
        projects: [
          { id: 'abc123', title: 'Project A' },
          { id: 'def456', title: 'Project B' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].id).toBe('project-card-abc123')
      expect(expanded[1].id).toBe('project-card-def456')
    })

    it('uses custom __key field when specified', () => {
      const widget: WidgetSchema = {
        id: 'item',
        __repeat: '{{ content.items }}',
        __key: 'slug',
        type: 'Card',
      }

      const content = {
        items: [
          { slug: 'hello-world', title: 'Hello World' },
          { slug: 'goodbye-world', title: 'Goodbye World' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].id).toBe('item-hello-world')
      expect(expanded[1].id).toBe('item-goodbye-world')
    })

    it('falls back to index when key field not present on item', () => {
      const widget: WidgetSchema = {
        id: 'card',
        __repeat: '{{ content.items }}',
        __key: 'id', // Explicitly looking for id
        type: 'Card',
      }

      const content = {
        items: [
          { title: 'No ID here' },
          { title: 'Also no ID' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].id).toBe('card-0')
      expect(expanded[1].id).toBe('card-1')
    })
  })

  describe('__itemKey property', () => {
    it('sets __itemKey on expanded widgets using id by default', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.projects }}',
        type: 'Card',
      }

      const content = {
        projects: [
          { id: 'proj-1', title: 'Project 1' },
          { id: 'proj-2', title: 'Project 2' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__itemKey).toBe('proj-1')
      expect(expanded[1].__itemKey).toBe('proj-2')
    })

    it('sets __itemKey using custom __key field', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        __key: 'uuid',
        type: 'Card',
      }

      const content = {
        items: [
          { uuid: 'a1b2c3', name: 'Item A' },
          { uuid: 'd4e5f6', name: 'Item B' },
        ],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__itemKey).toBe('a1b2c3')
      expect(expanded[1].__itemKey).toBe('d4e5f6')
    })

    it('sets __itemKey to index when key field missing', () => {
      const widget: WidgetSchema = {
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      const content = {
        items: [{ title: 'A' }, { title: 'B' }],
      }

      const expanded = expandRepeater(widget, content)
      expect(expanded[0].__itemKey).toBe(0)
      expect(expanded[1].__itemKey).toBe(1)
    })
  })

  describe('reorder stability', () => {
    it('maintains key-based IDs after data reorder', () => {
      const widget: WidgetSchema = {
        id: 'card',
        __repeat: '{{ content.items }}',
        type: 'Card',
      }

      // Original order
      const originalContent = {
        items: [
          { id: 'first', title: 'First' },
          { id: 'second', title: 'Second' },
          { id: 'third', title: 'Third' },
        ],
      }

      // Reordered
      const reorderedContent = {
        items: [
          { id: 'third', title: 'Third' },
          { id: 'first', title: 'First' },
          { id: 'second', title: 'Second' },
        ],
      }

      const original = expandRepeater(widget, originalContent)
      const reordered = expandRepeater(widget, reorderedContent)

      // Same IDs, different positions
      expect(original[0].id).toBe('card-first')
      expect(original[2].id).toBe('card-third')

      expect(reordered[0].id).toBe('card-third')
      expect(reordered[1].id).toBe('card-first')
    })
  })
})

// =============================================================================
// Platform Introspection Tests
// =============================================================================

describe('isRepeaterTemplate', () => {
  it('returns true for widgets with __repeat', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.items }}',
      type: 'Card',
    }
    expect(isRepeaterTemplate(widget)).toBe(true)
  })

  it('returns false for widgets without __repeat', () => {
    const widget: WidgetSchema = {
      type: 'Text',
      props: { content: 'Hello' },
    }
    expect(isRepeaterTemplate(widget)).toBe(false)
  })

  it('returns false for empty __repeat', () => {
    const widget: WidgetSchema = {
      __repeat: '',
      type: 'Card',
    }
    expect(isRepeaterTemplate(widget)).toBe(false)
  })
})

describe('getRepeaterInfo', () => {
  it('returns null for non-repeater widgets', () => {
    const widget: WidgetSchema = { type: 'Text' }
    const content = { items: [] }
    expect(getRepeaterInfo(widget, content)).toBeNull()
  })

  it('returns null when data path does not resolve to array', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.notAnArray }}',
      type: 'Card',
    }
    const content = { notAnArray: 'string value' }
    expect(getRepeaterInfo(widget, content)).toBeNull()
  })

  it('returns correct metadata for valid repeater', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.projects }}',
      type: 'Card',
    }

    const content = {
      projects: [
        { id: 'p1', title: 'Project One' },
        { id: 'p2', title: 'Project Two' },
        { id: 'p3', title: 'Project Three' },
      ],
    }

    const info = getRepeaterInfo(widget, content)

    expect(info).not.toBeNull()
    expect(info!.dataPath).toBe('content.projects')
    expect(info!.itemCount).toBe(3)
    expect(info!.keyField).toBe('id')
    expect(info!.items).toEqual([
      { key: 'p1', label: 'Project One' },
      { key: 'p2', label: 'Project Two' },
      { key: 'p3', label: 'Project Three' },
    ])
  })

  it('uses custom __key field', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.items }}',
      __key: 'slug',
      type: 'Card',
    }

    const content = {
      items: [
        { slug: 'hello', title: 'Hello' },
        { slug: 'world', title: 'World' },
      ],
    }

    const info = getRepeaterInfo(widget, content)

    expect(info!.keyField).toBe('slug')
    expect(info!.items[0].key).toBe('hello')
    expect(info!.items[1].key).toBe('world')
  })

  it('falls back to index for items without key field', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.items }}',
      type: 'Card',
    }

    const content = {
      items: [
        { title: 'No ID A' },
        { title: 'No ID B' },
      ],
    }

    const info = getRepeaterInfo(widget, content)

    expect(info!.items[0].key).toBe(0)
    expect(info!.items[1].key).toBe(1)
  })

  it('handles nested data paths', () => {
    const widget: WidgetSchema = {
      __repeat: '{{ content.pages.home.featured }}',
      type: 'Card',
    }

    const content = {
      pages: {
        home: {
          featured: [
            { id: 'f1', title: 'Featured 1' },
            { id: 'f2', title: 'Featured 2' },
          ],
        },
      },
    }

    const info = getRepeaterInfo(widget, content)

    expect(info!.dataPath).toBe('content.pages.home.featured')
    expect(info!.itemCount).toBe(2)
  })
})

/**
 * Structural tree builder for the Contract Inspector.
 *
 * Walks a SitePreset object, extracts {{ content.XXX }} binding expressions
 * at each structural location (experience.intro, pages, chrome regions/overlays),
 * and maps content contract fields to where they're actually used.
 */

import type { SitePreset } from '../../../engine/presets/types'
import type { ContentContract, ContentSourceField } from '../../../engine/presets/types'

// =============================================================================
// Types
// =============================================================================

export interface StructuralNode {
  /** Unique node identifier */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Content fields claimed by this node */
  fields: ContentSourceField[]
  /** Child nodes */
  children: StructuralNode[]
}

// =============================================================================
// Binding extraction
// =============================================================================

const BINDING_RE = /\{\{\s*content\.([a-zA-Z0-9_.]+)\s*\}\}/g

/**
 * Recursively walks an object and extracts all `{{ content.XXX }}` paths.
 * Returns a Set of content paths (e.g., 'hero.videoSrc', 'footer.navLinks').
 */
export function extractBindingPaths(obj: unknown): Set<string> {
  const paths = new Set<string>()

  function walk(value: unknown): void {
    if (value === null || value === undefined) return

    if (typeof value === 'string') {
      let match: RegExpExecArray | null
      BINDING_RE.lastIndex = 0
      while ((match = BINDING_RE.exec(value)) !== null) {
        paths.add(match[1])
      }
      return
    }

    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }

    if (typeof value === 'object') {
      for (const val of Object.values(value as Record<string, unknown>)) {
        walk(val)
      }
    }
  }

  walk(obj)
  return paths
}

// =============================================================================
// Field claiming
// =============================================================================

/**
 * Check if a content field belongs to a set of binding paths.
 * Uses exact match or prefix match (for collections whose children
 * are accessed via item.xxx in the template).
 */
function fieldMatchesBindings(field: ContentSourceField, bindings: Set<string>): boolean {
  // Exact match
  if (bindings.has(field.path)) return true

  // Prefix match: a binding like 'footer.navLinks' should claim the
  // collection field 'footer.navLinks' even if template only accesses
  // item fields. And 'projects.featured' should match binding paths
  // that start with 'projects.featured'.
  for (const binding of bindings) {
    if (binding.startsWith(field.path + '.')) return true
    if (field.path.startsWith(binding + '.')) return true
  }

  return false
}

// =============================================================================
// Tree builder
// =============================================================================

/**
 * Builds a structural tree mapping content fields to their location
 * in the preset's JSON hierarchy.
 */
export function buildStructuralTree(
  preset: SitePreset,
  contract: ContentContract,
): StructuralNode[] {
  const claimed = new Set<string>()
  const allFields = contract.sourceFields
  const roots: StructuralNode[] = []

  /**
   * Claim fields that match a set of bindings.
   * Returns the claimed fields and marks their paths.
   */
  function claimFields(bindings: Set<string>): ContentSourceField[] {
    const result: ContentSourceField[] = []
    for (const field of allFields) {
      if (claimed.has(field.path)) continue
      if (fieldMatchesBindings(field, bindings)) {
        result.push(field)
        claimed.add(field.path)
      }
    }
    return result
  }

  const pageEntries = Object.entries(preset.pages)
  const isMultiPage = pageEntries.length > 1
  const siteChildren: StructuralNode[] = []

  // ── Head (metadata) ────────────────────────────────────────────────
  for (const [pageId, page] of pageEntries) {
    if (!page.head) continue
    const headBindings = extractBindingPaths(page.head)
    const headFields = claimFields(headBindings)
    if (headFields.length === 0) continue

    siteChildren.push({
      id: `site-${pageId}-head`,
      label: isMultiPage ? `${capitalize(pageId)} Head` : 'Head',
      description: 'Page metadata',
      fields: headFields,
      children: [],
    })
  }

  // ── Experience ─────────────────────────────────────────────────────
  if (preset.experience) {
    const expChildren: StructuralNode[] = []

    // Intro
    if (preset.experience.intro) {
      const introBindings = extractBindingPaths(preset.experience.intro)
      const introFields = claimFields(introBindings)
      if (introFields.length > 0) {
        expChildren.push({
          id: 'experience-intro',
          label: 'Intro',
          description: 'Intro sequence configuration',
          fields: introFields,
          children: [],
        })
      }
    }

    // Section behaviours
    if (preset.experience.sectionBehaviours) {
      const behBindings = extractBindingPaths(preset.experience.sectionBehaviours)
      const behFields = claimFields(behBindings)
      if (behFields.length > 0) {
        expChildren.push({
          id: 'experience-behaviours',
          label: 'Section Behaviours',
          fields: behFields,
          children: [],
        })
      }
    }

    if (expChildren.length > 0) {
      siteChildren.push({
        id: 'experience',
        label: 'Experience',
        fields: [],
        children: expChildren,
      })
    }
  }

  // ── Pages ──────────────────────────────────────────────────────────
  const pageChildren: StructuralNode[] = []

  for (const [pageId, page] of pageEntries) {
    const pageLabel = `${pageId} (${page.slug})`
    const sectionNodes: StructuralNode[] = []

    // Sections
    for (const section of page.sections) {
      const sectionBindings = extractBindingPaths(section)
      const sectionFields = claimFields(sectionBindings)
      if (sectionFields.length > 0) {
        sectionNodes.push({
          id: `pages-${pageId}-${section.id}`,
          label: section.label ?? section.id,
          description: section.id !== (section.label ?? section.id) ? section.id : undefined,
          fields: sectionFields,
          children: [],
        })
      }
    }

    if (sectionNodes.length > 0) {
      pageChildren.push({
        id: `pages-${pageId}`,
        label: pageLabel,
        fields: [],
        children: sectionNodes,
      })
    }
  }

  if (pageChildren.length > 0) {
    siteChildren.push({
      id: 'pages',
      label: 'Pages',
      fields: [],
      children: pageChildren,
    })
  }

  // ── Chrome ─────────────────────────────────────────────────────────
  const chromeChildren: StructuralNode[] = []

  // Regions
  const regionNodes: StructuralNode[] = []
  if (preset.chrome.regions) {
    for (const [regionName, regionConfig] of Object.entries(preset.chrome.regions)) {
      if (regionConfig === 'hidden' || !regionConfig) continue
      const regionBindings = extractBindingPaths(regionConfig)
      const regionFields = claimFields(regionBindings)
      if (regionFields.length > 0) {
        regionNodes.push({
          id: `chrome-regions-${regionName}`,
          label: capitalize(regionName),
          fields: regionFields,
          children: [],
        })
      }
    }
  }

  if (regionNodes.length > 0) {
    chromeChildren.push({
      id: 'chrome-regions',
      label: 'Regions',
      fields: [],
      children: regionNodes,
    })
  }

  // Overlays
  const overlayNodes: StructuralNode[] = []
  if (preset.chrome.overlays) {
    for (const [overlayName, overlayConfig] of Object.entries(preset.chrome.overlays)) {
      if (!overlayConfig) continue
      const overlayBindings = extractBindingPaths(overlayConfig)
      const overlayFields = claimFields(overlayBindings)
      if (overlayFields.length > 0) {
        overlayNodes.push({
          id: `chrome-overlays-${overlayName}`,
          label: formatOverlayName(overlayName),
          fields: overlayFields,
          children: [],
        })
      }
    }
  }

  if (overlayNodes.length > 0) {
    chromeChildren.push({
      id: 'chrome-overlays',
      label: 'Overlays',
      fields: [],
      children: overlayNodes,
    })
  }

  if (chromeChildren.length > 0) {
    siteChildren.push({
      id: 'chrome',
      label: 'Chrome',
      fields: [],
      children: chromeChildren,
    })
  }

  // ── Build root ─────────────────────────────────────────────────────
  roots.push({
    id: 'site',
    label: 'SITE',
    fields: [],
    children: siteChildren,
  })

  // ── Unclaimed ──────────────────────────────────────────────────────
  const unclaimed = allFields.filter((f) => !claimed.has(f.path))
  if (unclaimed.length > 0) {
    roots.push({
      id: 'other',
      label: 'OTHER',
      description: 'Fields not found in preset bindings',
      fields: unclaimed,
      children: [],
    })
  }

  return roots
}

// =============================================================================
// Helpers
// =============================================================================

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatOverlayName(camelCase: string): string {
  // floatingContact → Floating Contact
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

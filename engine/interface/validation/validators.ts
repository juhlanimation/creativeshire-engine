/**
 * Constraint validators for schema operations.
 * Validate before applying changes to state.
 */

import type { ValidationResult, ConstraintViolation, EngineConstraints } from '../types'
import type { WidgetSchema } from '../../schema'
import { getWidget } from '../../content/widgets/registry'

// =============================================================================
// Section Validators
// =============================================================================

/**
 * Validate section count against limit.
 */
export function validateSectionLimit(
  count: number,
  max: number
): ValidationResult {
  if (count > max) {
    return {
      valid: false,
      error: {
        type: 'section-limit',
        message: `Maximum ${max} sections allowed, attempted to add section #${count}`,
        path: ['page', 'sections'],
        value: count,
        limit: max,
      },
    }
  }
  return { valid: true }
}

// =============================================================================
// Widget Validators
// =============================================================================

/**
 * Validate widget nesting depth.
 */
export function validateNestingDepth(
  widgets: WidgetSchema[],
  maxDepth: number,
  currentDepth = 1,
  path: string[] = []
): ValidationResult {
  if (currentDepth > maxDepth) {
    return {
      valid: false,
      error: {
        type: 'nesting-depth',
        message: `Maximum widget nesting depth is ${maxDepth}, found depth ${currentDepth}`,
        path,
        value: currentDepth,
        limit: maxDepth,
      },
    }
  }

  for (let i = 0; i < widgets.length; i++) {
    const widget = widgets[i]
    if (widget.widgets && widget.widgets.length > 0) {
      const result = validateNestingDepth(
        widget.widgets,
        maxDepth,
        currentDepth + 1,
        [...path, `widgets[${i}]`]
      )
      if (!result.valid) {
        return result
      }
    }
  }

  return { valid: true }
}

/**
 * Validate widget type exists in registry.
 */
export function validateWidgetType(type: string): ValidationResult {
  const component = getWidget(type)
  if (!component) {
    return {
      valid: false,
      error: {
        type: 'unknown-widget',
        message: `Unknown widget type: ${type}`,
        path: ['type'],
        value: type,
      },
    }
  }
  return { valid: true }
}

/**
 * Validate all widget types in a tree.
 */
export function validateWidgetTree(widget: WidgetSchema): ValidationResult {
  const typeResult = validateWidgetType(widget.type)
  if (!typeResult.valid) {
    return typeResult
  }

  if (widget.widgets) {
    for (const child of widget.widgets) {
      const childResult = validateWidgetTree(child)
      if (!childResult.valid) {
        return childResult
      }
    }
  }

  return { valid: true }
}

// =============================================================================
// Section Validators (Full)
// =============================================================================

/**
 * Validate entire section schema.
 */
export function validateSection(
  section: { widgets?: WidgetSchema[] },
  constraints: EngineConstraints
): ValidationResult {
  // Validate nesting depth
  if (section.widgets) {
    const nestingResult = validateNestingDepth(
      section.widgets,
      constraints.maxWidgetNesting
    )
    if (!nestingResult.valid) {
      return nestingResult
    }

    // Validate widget count
    if (section.widgets.length > constraints.maxWidgetsPerSection) {
      return {
        valid: false,
        error: {
          type: 'section-limit',
          message: `Maximum ${constraints.maxWidgetsPerSection} widgets per section, found ${section.widgets.length}`,
          path: ['section', 'widgets'],
          value: section.widgets.length,
          limit: constraints.maxWidgetsPerSection,
        },
      }
    }

    // Validate all widget types
    for (const widget of section.widgets) {
      const typeResult = validateWidgetTree(widget)
      if (!typeResult.valid) {
        return typeResult
      }
    }
  }

  return { valid: true }
}

// =============================================================================
// Utility Validators
// =============================================================================

/**
 * Validate section exists in page.
 */
export function validateSectionExists(
  sectionId: string,
  sections: Array<{ id: string }>
): ValidationResult {
  const exists = sections.some((s) => s.id === sectionId)
  if (!exists) {
    return {
      valid: false,
      error: {
        type: 'not-found',
        message: `Section not found: ${sectionId}`,
        path: ['page', 'sections', sectionId],
        value: sectionId,
      },
    }
  }
  return { valid: true }
}

/**
 * Validate all section IDs exist (for reordering).
 */
export function validateSectionOrder(
  order: string[],
  sections: Array<{ id: string }>
): ValidationResult {
  const sectionIds = new Set(sections.map((s) => s.id))

  for (const id of order) {
    if (!sectionIds.has(id)) {
      return {
        valid: false,
        error: {
          type: 'not-found',
          message: `Unknown section in order: ${id}`,
          path: ['order'],
          value: id,
        },
      }
    }
  }

  return { valid: true }
}

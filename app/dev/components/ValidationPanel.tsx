/**
 * Inline validation hints for a content contract.
 * Flags common contract issues.
 */

'use client'

import type { ContentContract, ContentSourceField } from '../../../engine/presets/types'

interface ValidationIssue {
  severity: 'warning' | 'error'
  message: string
  path?: string
}

function validateContract(contract: ContentContract): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const sectionIds = new Set(contract.sections.map((s) => s.id))
  const fieldSections = new Set<string>()

  function checkField(field: ContentSourceField, parentPath: string) {
    const fullPath = parentPath ? `${parentPath}.${field.path}` : field.path

    // Orphaned section ref
    if (!sectionIds.has(field.section)) {
      issues.push({
        severity: 'error',
        message: `References non-existent section "${field.section}"`,
        path: fullPath,
      })
    }
    fieldSections.add(field.section)

    // Required without default
    if (field.required && field.default === undefined && !field.hidden) {
      issues.push({
        severity: 'warning',
        message: 'Required field without default value',
        path: fullPath,
      })
    }

    // Hidden + required without default
    if (field.hidden && field.required && field.default === undefined) {
      issues.push({
        severity: 'error',
        message: 'Hidden + required but no default (auto-generated with no fallback)',
        path: fullPath,
      })
    }

    // Collection without itemFields
    if (field.type === 'collection' && (!field.itemFields || field.itemFields.length === 0)) {
      issues.push({
        severity: 'error',
        message: 'Collection field without itemFields definition',
        path: fullPath,
      })
    }

    // Recurse into itemFields
    if (field.itemFields) {
      for (const sub of field.itemFields) {
        checkField(sub, fullPath)
      }
    }
  }

  for (const field of contract.sourceFields) {
    checkField(field, '')
  }

  // Empty sections (defined but no fields reference them)
  for (const section of contract.sections) {
    if (!fieldSections.has(section.id)) {
      issues.push({
        severity: 'warning',
        message: `Section "${section.label}" is defined but no fields reference it`,
        path: section.id,
      })
    }
  }

  return issues
}

interface ValidationPanelProps {
  contract: ContentContract
}

export default function ValidationPanel({ contract }: ValidationPanelProps) {
  const issues = validateContract(contract)

  if (issues.length === 0) {
    return (
      <div className="cd-validation cd-validation--ok">
        <span className="cd-validation__icon">✓</span>
        No validation issues
      </div>
    )
  }

  return (
    <div className="cd-validation">
      <div className="cd-validation__header">
        <span className="cd-validation__icon">⚠</span>
        {issues.length} issue{issues.length !== 1 ? 's' : ''}
      </div>
      <div className="cd-validation__list">
        {issues.map((issue, i) => (
          <div
            key={i}
            className={`cd-validation__item cd-validation__item--${issue.severity}`}
          >
            <span className="cd-validation__severity">
              {issue.severity === 'error' ? '✕' : '!'}
            </span>
            {issue.path && <code className="cd-validation__path">{issue.path}</code>}
            <span className="cd-validation__msg">{issue.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

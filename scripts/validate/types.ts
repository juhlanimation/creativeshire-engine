/**
 * Validation Script Types
 *
 * Type definitions for the creativeshire-engine validation system.
 */

export type ValidationStatus = 'pass' | 'warning' | 'fail'

export interface ValidationResult {
  file: string // Relative path from engine/
  rule: string // Rule identifier
  status: ValidationStatus
  message: string // Human-readable description
  details?: string // Additional context
}

export interface CategoryReport {
  category: string
  results: ValidationResult[]
  passCount: number
  warningCount: number
  failCount: number
}

export interface ValidationReport {
  timestamp: string
  duration: number
  categories: CategoryReport[]
  summary: {
    totalFiles: number
    totalRules: number
    passCount: number
    warningCount: number
    failCount: number
  }
}

export interface Validator {
  name: string
  description: string
  validate(): Promise<ValidationResult[]>
}

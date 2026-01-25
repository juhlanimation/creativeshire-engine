/**
 * Renderer types.
 * Types for widget and section rendering components.
 */

import type { WidgetSchema } from '@/creativeshire/schema'

/**
 * Props for WidgetRenderer component.
 */
export interface WidgetRendererProps {
  /** Widget schema to render */
  widget: WidgetSchema
  /** Index position when rendered in a list */
  index?: number
}

/**
 * Props for ErrorFallback component.
 */
export interface ErrorFallbackProps {
  /** The error that was caught */
  error: Error
  /** Widget type that failed to render */
  widgetType?: string
  /** Function to reset the error boundary */
  resetErrorBoundary?: () => void
}

/**
 * Props for ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: React.ReactNode
  /** Widget type for error context */
  widgetType?: string
  /** Custom fallback component */
  fallback?: React.ReactNode
}

/**
 * State for ErrorBoundary component.
 */
export interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean
  /** The caught error */
  error: Error | null
}

'use client'

/**
 * ErrorBoundary - Catches rendering errors in widget tree.
 * Prevents a single widget error from breaking the entire page.
 *
 * @see .claude/architecture/creativeshire/components/renderer/renderer.spec.md
 */

import { Component, type ReactNode } from 'react'
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorFallbackProps,
} from './types'

/**
 * Default error fallback component.
 * Displays error information in development, minimal info in production.
 */
function DefaultErrorFallback({
  error,
  widgetType,
}: ErrorFallbackProps): ReactNode {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div
      data-error={`Widget render error: ${widgetType ?? 'unknown'}`}
      style={{
        padding: '1rem',
        margin: '0.5rem 0',
        border: '1px solid #ef4444',
        borderRadius: '0.25rem',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        fontSize: '0.875rem',
      }}
    >
      <strong>Widget Error{widgetType ? `: ${widgetType}` : ''}</strong>
      {isDev && (
        <pre
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.25rem',
            overflow: 'auto',
            fontSize: '0.75rem',
          }}
        >
          {error.message}
        </pre>
      )}
    </div>
  )
}

/**
 * ErrorBoundary component.
 * Wraps widget rendering to catch and display errors gracefully.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary widgetType="Text">
 *   <TextWidget {...props} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error('Widget render error:', {
      widgetType: this.props.widgetType,
      error,
      componentStack: errorInfo.componentStack,
    })
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          widgetType={this.props.widgetType}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

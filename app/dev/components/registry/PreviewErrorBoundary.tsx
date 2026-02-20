/**
 * Error boundary for component previews.
 * Catches render errors and shows a recovery UI instead of crashing the dashboard.
 */

'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class PreviewErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  private handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="cd-preview-error">
          <div className="cd-preview-error__msg">
            {this.state.error.message}
          </div>
          <details className="cd-preview-error__details">
            <summary>Stack trace</summary>
            <pre className="cd-preview-error__stack">
              {this.state.error.stack}
            </pre>
          </details>
          <button
            className="cd-preview-error__retry"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

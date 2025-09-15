'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import ErrorPage from './ErrorPage'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorPage
          title="Something went wrong"
          message="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
          error={this.state.error?.message}
          type="error"
          onRetry={this.handleRetry}
          showBack={false}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

import { Middleware } from '@reduxjs/toolkit'
import { toast } from 'sonner'

const errorHandlerMiddleware: Middleware = store => next => action => {
  try {
    const result = next(action)
    
    // Handle rejected actions
    if (action.type.endsWith('/rejected')) {
      const error = action.payload || action.error?.message || 'An error occurred'
      
      // Log error for debugging
      console.error('Action rejected:', {
        type: action.type,
        error: error,
        payload: action.payload,
        meta: action.meta
      })
      
      // Show user-friendly error message
      if (typeof error === 'string') {
        toast.error(error)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
      
      // Track error for analytics
      trackError(action.type, error)
    }
    
    return result
  } catch (error) {
    console.error('Middleware error:', error)
    
    // Show error to user
    toast.error('An unexpected error occurred. Please refresh the page.')
    
    // Track error
    trackError('middleware_error', error)
    
    throw error
  }
}

// Error tracking function
function trackError(actionType: string, error: any) {
  try {
    // Send error to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          action_type: actionType,
          source: 'redux_middleware'
        },
        extra: {
          actionType,
          error: error?.message || error,
          stack: error?.stack
        }
      })
    }
    
    // Send to custom error tracking endpoint
    if (import.meta.env.VITE_ERROR_TRACKING_ENDPOINT) {
      fetch(import.meta.env.VITE_ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action_type: actionType,
          error: error?.message || error,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(err => {
        console.error('Error tracking failed:', err)
      })
    }
  } catch (err) {
    console.error('Error tracking error:', err)
  }
}

export default errorHandlerMiddleware 
import { Middleware } from '@reduxjs/toolkit'

const analyticsMiddleware: Middleware = store => next => action => {
  const result = next(action)
  
  // Track specific actions for analytics
  const analyticsActions = [
    'api/createApi/fulfilled',
    'api/updateApi/fulfilled',
    'api/deleteApi/fulfilled',
    'api/deployApi/fulfilled',
    'auth/login/fulfilled',
    'auth/logout/fulfilled',
    'team/inviteMember/fulfilled',
    'billing/updateSubscription/fulfilled'
  ]
  
  if (analyticsActions.includes(action.type)) {
    // Send analytics event
    trackEvent(action.type, action.payload)
  }
  
  return result
}

// Analytics tracking function
function trackEvent(eventName: string, data?: any) {
  try {
    // Send to analytics service (e.g., Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'user_action',
        event_label: eventName,
        value: 1,
        custom_data: data
      })
    }
    
    // Send to custom analytics endpoint
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: eventName,
          timestamp: new Date().toISOString(),
          data: data
        })
      }).catch(error => {
        console.error('Analytics tracking failed:', error)
      })
    }
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

export default analyticsMiddleware 
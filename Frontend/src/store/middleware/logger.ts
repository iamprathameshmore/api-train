import { Middleware } from '@reduxjs/toolkit'

const loggerMiddleware: Middleware = store => next => action => {
  if (import.meta.env.DEV) {
    console.group(`🚀 ${action.type}`)
    console.log('Previous State:', store.getState())
    console.log('Action:', action)
    
    const result = next(action)
    
    console.log('Next State:', store.getState())
    console.groupEnd()
    
    return result
  }
  
  return next(action)
}

export default loggerMiddleware 
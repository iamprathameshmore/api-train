import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { tokenStorage } from '@/guards/auth-guard'
import { store } from '@/store'
import { logout, lockAccount } from '@/store/slices/auth-slice'

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
const MAX_RETRIES = parseInt(import.meta.env.VITE_MAX_RETRIES || '3')
const RATE_LIMIT_DELAY = parseInt(import.meta.env.VITE_RATE_LIMIT_DELAY || '1000')

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  requests: Array<{ timestamp: number; url: string }>
}

const rateLimit: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  requests: []
}

// Security configuration
const SECURITY_CONFIG = {
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  allowedContentTypes: ['application/json', 'multipart/form-data', 'text/plain'],
  blockedHeaders: ['x-forwarded-for', 'x-real-ip', 'x-forwarded-proto'],
  sensitiveEndpoints: ['/auth/login', '/auth/signup', '/auth/change-password']
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // Security headers
  withCredentials: true,
  maxContentLength: SECURITY_CONFIG.maxRequestSize,
  maxBodyLength: SECURITY_CONFIG.maxRequestSize
})

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Rate limiting check
      if (!checkRateLimit(config.url || '')) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      // Security checks
      if (!validateRequest(config)) {
        throw new Error('Invalid request detected')
      }

      // Add authentication token
      const token = tokenStorage.getToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request ID for tracking
      const requestId = generateRequestId()
      if (config.headers) {
        config.headers['X-Request-ID'] = requestId
      }

      // Add timestamp
      if (config.headers) {
        config.headers['X-Timestamp'] = Date.now().toString()
      }

      // Log request for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data
        })
      }

      return config
    } catch (error) {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    }
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    try {
      // Log response for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data
        })
      }

      // Update rate limit tracking
      updateRateLimit(response.config.url || '')

      // Check for security headers
      validateSecurityHeaders(response)

      // Handle successful response
      return response
    } catch (error) {
      console.error('Response interceptor error:', error)
      return Promise.reject(error)
    }
  },
  async (error: AxiosError) => {
    try {
      // Log error for debugging
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })

      const originalRequest = error.config as any

      // Handle 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // Check if this is a token refresh request to avoid infinite loop
        if (originalRequest.url?.includes('/auth/refresh-token')) {
          // Refresh token is invalid, logout user
          store.dispatch(lockAccount())
          toast.error('Session expired. Please login again.')
          return Promise.reject(error)
        }

        // Try to refresh token
        const refreshToken = tokenStorage.getRefreshToken()
        if (refreshToken && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
              refreshToken
            })

            const { token, refreshToken: newRefreshToken } = response.data.data

            // Update stored tokens
            tokenStorage.setToken(token)
            tokenStorage.setRefreshToken(newRefreshToken)

            // Update session expiry
            const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
            tokenStorage.setSessionExpiry(sessionExpiry.toISOString())

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosInstance(originalRequest)
          } catch (refreshError) {
            // Refresh failed, logout user
            store.dispatch(logout())
            toast.error('Session expired. Please login again.')
            return Promise.reject(refreshError)
          }
        } else {
          // No refresh token or already retried, logout user
          store.dispatch(logout())
          toast.error('Session expired. Please login again.')
          return Promise.reject(error)
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        toast.error('Access denied. You don\'t have permission to perform this action.')
        return Promise.reject(error)
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        toast.error('Resource not found.')
        return Promise.reject(error)
      }

      // Handle 429 Too Many Requests
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.')
        return Promise.reject(error)
      }

      // Handle 500 Internal Server Error
      if (error.response && error.response.status >= 500) {
        toast.error('Server error. Please try again later.')
        return Promise.reject(error)
      }

      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your connection.')
        return Promise.reject(error)
      }

      // Handle other errors
      const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred'
      toast.error(errorMessage)
      return Promise.reject(error)
    } catch (interceptorError) {
      console.error('Response interceptor error:', interceptorError)
      return Promise.reject(error)
    }
  }
)

// Rate limiting functions
function checkRateLimit(url: string): boolean {
  const now = Date.now()
  const windowStart = now - rateLimit.windowMs

  // Remove old requests outside the window
  rateLimit.requests = rateLimit.requests.filter(
    request => request.timestamp > windowStart
  )

  // Check if we're within the limit
  if (rateLimit.requests.length >= rateLimit.maxRequests) {
    return false
  }

  return true
}

function updateRateLimit(url: string): void {
  rateLimit.requests.push({
    timestamp: Date.now(),
    url
  })
}

// Security validation functions
function validateRequest(config: InternalAxiosRequestConfig): boolean {
  // Check request size
  if (config.data && typeof config.data === 'string' && config.data.length > SECURITY_CONFIG.maxRequestSize) {
    console.warn('Request size exceeds limit')
    return false
  }

  // Check content type for sensitive endpoints
  if (SECURITY_CONFIG.sensitiveEndpoints.some(endpoint => config.url?.includes(endpoint))) {
    const contentType = config.headers?.['Content-Type'] as string
    if (!SECURITY_CONFIG.allowedContentTypes.some(type => contentType?.includes(type))) {
      console.warn('Invalid content type for sensitive endpoint')
      return false
    }
  }

  // Remove blocked headers
  SECURITY_CONFIG.blockedHeaders.forEach(header => {
    if (config.headers?.[header]) {
      delete config.headers[header]
    }
  })

  return true
}

function validateSecurityHeaders(response: AxiosResponse): void {
  // Check for security headers
  const securityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security'
  ]

  securityHeaders.forEach(header => {
    if (!response.headers[header.toLowerCase()]) {
      console.warn(`Missing security header: ${header}`)
    }
  })
}

// Utility functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Request retry mechanism
export const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries: number = MAX_RETRIES,
  delay: number = 1000
): Promise<any> => {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error: any) {
      lastError = error

      // Don't retry on certain status codes
      if (error.response?.status && [400, 401, 403, 404, 422].includes(error.response.status)) {
        throw error
      }

      // Don't retry on network errors after first attempt
      if (!error.response && attempt > 1) {
        throw error
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError
}

// Request cancellation
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

// Request timeout wrapper
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = API_TIMEOUT
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ])
}

// Batch request helper
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>,
  concurrency: number = 5
): Promise<T[]> => {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const request of requests) {
    const promise = request().then(result => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(executing.findIndex(p => p === promise), 1)
    }
  }

  await Promise.all(executing)
  return results
}

// Request caching
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const cachedRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
): Promise<T> => {
  const cached = cache.get(key)
  
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }

  const data = await requestFn()
  cache.set(key, { data, timestamp: Date.now(), ttl })
  
  return data
}

// Clear cache
export const clearCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

// Export the configured axios instance
export default axiosInstance

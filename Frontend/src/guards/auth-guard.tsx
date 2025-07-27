import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ROUTES } from "@/constant/route-constant"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { refreshAccessToken, logout } from "@/store/slices/auth-slice"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

// Token management utilities
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const SESSION_EXPIRY_KEY = 'session_expiry'

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  getSessionExpiry: () => localStorage.getItem(SESSION_EXPIRY_KEY),
  setSessionExpiry: (expiry: string) => localStorage.setItem(SESSION_EXPIRY_KEY, expiry),
  removeSessionExpiry: () => localStorage.removeItem(SESSION_EXPIRY_KEY),
  
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
  }
}

export default function AuthGuard() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useAppSelector(state => state.auth)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = tokenStorage.getToken()
        const refreshToken = tokenStorage.getRefreshToken()
        const sessionExpiry = tokenStorage.getSessionExpiry()

        // Check if session has expired
        if (sessionExpiry && new Date(sessionExpiry) < new Date()) {
          console.log('Session expired, logging out')
          await handleLogout()
          return
        }

        if (token && refreshToken) {
          // Verify token is still valid
          const isValid = await verifyToken(token)
          if (!isValid) {
            // Try to refresh token
            const newToken = await refreshAuthToken(refreshToken)
            if (newToken) {
              tokenStorage.setToken(newToken)
              // Update session expiry
              const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
              tokenStorage.setSessionExpiry(newExpiry.toISOString())
            } else {
              await handleLogout()
              return
            }
          }
        } else {
          // No tokens found, redirect to login
          await handleLogout()
          return
        }

        setIsChecking(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        await handleLogout()
      }
    }

    checkAuth()
  }, [dispatch])

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // Decode JWT to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000 // Convert to milliseconds
      
      // Check if token is expired (with 5 minute buffer)
      const buffer = 5 * 60 * 1000
      return Date.now() < (expiry - buffer)
    } catch (error) {
      console.error('Token verification failed:', error)
      return false
    }
  }

  const refreshAuthToken = async (refreshToken: string): Promise<string | null> => {
    try {
      const result = await dispatch(refreshAccessToken()).unwrap()
      if (result) {
        // Set new session expiry
        const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        tokenStorage.setSessionExpiry(newExpiry.toISOString())
        return result
      }
      return null
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      tokenStorage.clearAll()
      toast.error("Session expired. Please login again.")
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  // Show loading spinner while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    // Save the attempted URL for redirect after login
    const returnUrl = location.pathname + location.search
    if (returnUrl !== '/login') {
      sessionStorage.setItem('returnUrl', returnUrl)
    }
    
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Check if user has required permissions for the current route
  const hasRequiredPermissions = checkRoutePermissions(location.pathname, user.permissions)
  if (!hasRequiredPermissions) {
    toast.error("You don't have permission to access this page.")
    return <Navigate to={ROUTES.USER_DASHBOARD.OVERVIEW} replace />
  }

  // User is authenticated and authorized
  return <Outlet />
}

// Permission checking utility
function checkRoutePermissions(pathname: string, userPermissions: any[]): boolean {
  // Define route permissions
  const routePermissions: Record<string, string[]> = {
    '/dashboard/settings': ['settings:read'],
    '/dashboard/billing': ['billing:read'],
    '/dashboard/team': ['team:read'],
    '/dashboard/apis': ['api:read'],
    '/dashboard/analytics': ['analytics:read'],
  }

  // Check if route requires specific permissions
  for (const [route, requiredPermissions] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return requiredPermissions.some(permission => 
        userPermissions.some(userPerm => 
          userPerm.resource === permission.split(':')[0] && 
          userPerm.action === permission.split(':')[1]
        )
      )
    }
  }

  // Default to allowing access for basic routes
  return true
}



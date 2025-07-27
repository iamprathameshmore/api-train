import { useState, useEffect } from 'react'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isPWA: boolean
  isLandscape: boolean
  isPortrait: boolean
  screenWidth: number
  screenHeight: number
  isOnline: boolean
  isStandalone: boolean
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPWA: false,
    isLandscape: false,
    isPortrait: false,
    screenWidth: 0,
    screenHeight: 0,
    isOnline: navigator.onLine,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches
  })

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setState({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.desktop,
        isPWA: window.matchMedia('(display-mode: standalone)').matches,
        isLandscape: width > height,
        isPortrait: height > width,
        screenWidth: width,
        screenHeight: height,
        isOnline: navigator.onLine,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches
      })
    }

    // Initial state
    updateResponsiveState()

    // Event listeners
    window.addEventListener('resize', updateResponsiveState)
    window.addEventListener('orientationchange', updateResponsiveState)
    window.addEventListener('online', () => setState(prev => ({ ...prev, isOnline: true })))
    window.addEventListener('offline', () => setState(prev => ({ ...prev, isOnline: false })))

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateResponsiveState)
      window.removeEventListener('orientationchange', updateResponsiveState)
      window.removeEventListener('online', () => setState(prev => ({ ...prev, isOnline: true })))
      window.removeEventListener('offline', () => setState(prev => ({ ...prev, isOnline: false })))
    }
  }, [])

  return state
}

// Utility functions
export const getResponsiveClass = (mobile: string, tablet: string, desktop: string) => {
  return `${mobile} md:${tablet} lg:${desktop}`
}

export const getResponsiveValue = <T>(mobile: T, tablet: T, desktop: T) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  if (isMobile) return mobile
  if (isTablet) return tablet
  if (isDesktop) return desktop
  
  return desktop // fallback
}

// PWA utilities
export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if running as PWA
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setCanInstall(false)
        setDeferredPrompt(null)
      }
    }
  }

  return { isPWA, canInstall, installPWA }
}

// Touch utilities
export const useTouch = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return { isTouchDevice }
}

// Screen orientation utilities
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
} 
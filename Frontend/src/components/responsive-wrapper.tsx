import React from 'react'
import { useResponsive } from '@/hooks/use-responsive'

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
  mobileClassName?: string
  tabletClassName?: string
  desktopClassName?: string
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
  showOnMobile?: boolean
  showOnTablet?: boolean
  showOnDesktop?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function ResponsiveWrapper({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  showOnMobile = false,
  showOnTablet = false,
  showOnDesktop = false,
  as: Component = 'div',
  ...props
}: ResponsiveWrapperProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  // Determine visibility
  const shouldHide = 
    (hideOnMobile && isMobile) ||
    (hideOnTablet && isTablet) ||
    (hideOnDesktop && isDesktop)

  const shouldShow = 
    (showOnMobile && isMobile) ||
    (showOnTablet && isTablet) ||
    (showOnDesktop && isDesktop)

  if (shouldHide || (showOnMobile || showOnTablet || showOnDesktop) && !shouldShow) {
    return null
  }

  // Build responsive classes
  const responsiveClasses = [
    className,
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName,
  ].filter(Boolean).join(' ')

  return (
    <Component className={responsiveClasses} {...props}>
      {children}
    </Component>
  )
}

// Specialized responsive components
export function MobileOnly({ children, ...props }: Omit<ResponsiveWrapperProps, 'showOnMobile'>) {
  return (
    <ResponsiveWrapper showOnMobile {...props}>
      {children}
    </ResponsiveWrapper>
  )
}

export function TabletOnly({ children, ...props }: Omit<ResponsiveWrapperProps, 'showOnTablet'>) {
  return (
    <ResponsiveWrapper showOnTablet {...props}>
      {children}
    </ResponsiveWrapper>
  )
}

export function DesktopOnly({ children, ...props }: Omit<ResponsiveWrapperProps, 'showOnDesktop'>) {
  return (
    <ResponsiveWrapper showOnDesktop {...props}>
      {children}
    </ResponsiveWrapper>
  )
}

export function MobileAndTablet({ children, ...props }: Omit<ResponsiveWrapperProps, 'hideOnDesktop'>) {
  return (
    <ResponsiveWrapper hideOnDesktop {...props}>
      {children}
    </ResponsiveWrapper>
  )
}

export function TabletAndDesktop({ children, ...props }: Omit<ResponsiveWrapperProps, 'hideOnMobile'>) {
  return (
    <ResponsiveWrapper hideOnMobile {...props}>
      {children}
    </ResponsiveWrapper>
  )
}

// Responsive container with max-widths
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  fluid?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  fluid = false,
  maxWidth = 'xl'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  const containerClasses = fluid 
    ? 'w-full px-4 sm:px-6 lg:px-8'
    : `container mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]}`

  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  )
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

export function ResponsiveGrid({ 
  children, 
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 4, tablet: 6, desktop: 8 }
}: ResponsiveGridProps) {
  const gridClasses = [
    'grid',
    `grid-cols-${cols.mobile}`,
    `sm:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`,
    `gap-${gap.mobile}`,
    `sm:gap-${gap.tablet}`,
    `lg:gap-${gap.desktop}`,
    className
  ].join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  weight?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
}

export function ResponsiveText({ 
  children, 
  className = '',
  size = { mobile: 'base', tablet: 'base', desktop: 'lg' },
  weight = { mobile: 'normal', tablet: 'normal', desktop: 'normal' }
}: ResponsiveTextProps) {
  const textClasses = [
    `text-${size.mobile}`,
    `sm:text-${size.tablet}`,
    `lg:text-${size.desktop}`,
    `font-${weight.mobile}`,
    `sm:font-${weight.tablet}`,
    `lg:font-${weight.desktop}`,
    className
  ].join(' ')

  return (
    <span className={textClasses}>
      {children}
    </span>
  )
} 
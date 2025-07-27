import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error"
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default",
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  const variantClasses = {
    default: "border-gray-300 border-t-gray-600",
    primary: "border-blue-200 border-t-blue-600",
    secondary: "border-gray-200 border-t-gray-600",
    success: "border-green-200 border-t-green-600",
    warning: "border-yellow-200 border-t-yellow-600",
    error: "border-red-200 border-t-red-600"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2",
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Page loading component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}

// Inline loading component
export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

// Button loading component
export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} variant="primary" />
      <span>Loading...</span>
    </div>
  )
}

// Table loading skeleton
export function TableLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

// Card loading skeleton
export function CardLoader() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
    </div>
  )
} 
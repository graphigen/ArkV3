import { RefreshCw } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

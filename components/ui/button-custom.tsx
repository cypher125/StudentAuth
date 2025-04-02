import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const ButtonCustom = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background rounded-md"

    const variants = {
      primary: "bg-primary hover:bg-primary/90 text-white",
      secondary: "bg-white border border-primary text-primary hover:bg-light-gray",
      tertiary: "bg-transparent text-primary hover:bg-light-gray",
      danger: "bg-error hover:bg-error/90 text-white",
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-lg",
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 pointer-events-none",
          className,
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)

ButtonCustom.displayName = "ButtonCustom"

export { ButtonCustom }


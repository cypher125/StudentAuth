import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-card p-6 transition-all duration-300 hover:shadow-lg", className)}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-light-gray rounded-full p-3 mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-dark-neutral">{title}</h3>
        <p className="text-neutral-gray">{description}</p>
      </div>
    </div>
  )
}


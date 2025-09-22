import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { iconSizes, type IconProps } from "@/lib/icons"

interface IconComponentProps extends IconProps {
  icon: LucideIcon
}

const Icon = React.forwardRef<SVGSVGElement, IconComponentProps>(
  ({ icon: IconComponent, size = "md", className, ...props }, ref) => {
    const iconSize = typeof size === "number" ? size : iconSizes[size]
    
    return (
      <IconComponent
        ref={ref}
        size={iconSize}
        className={cn("shrink-0", className)}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon }
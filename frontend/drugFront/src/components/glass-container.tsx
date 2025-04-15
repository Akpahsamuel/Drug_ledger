import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassContainer({ children, className, ...props }: GlassContainerProps) {
  return (
    <div
      className={`backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

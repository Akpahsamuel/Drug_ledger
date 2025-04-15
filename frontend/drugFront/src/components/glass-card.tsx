import * as React from "react"
import { Card } from "./ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card
      className={`backdrop-blur-sm bg-slate-800/50 border-slate-700/50 ${className}`}
      {...props}
    >
      {children}
    </Card>
  )
}

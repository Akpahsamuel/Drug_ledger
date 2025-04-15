import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

// Define the context type
interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean
  state: string
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

// Create the context
const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

// Hook to use the sidebar context
function useSidebar(): SidebarContextType {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Container component props
interface SidebarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
}

// Container component
const SidebarContainer = React.forwardRef<HTMLDivElement, SidebarContainerProps>(
  ({ className = "", side = "left", variant = "sidebar", collapsible = "none", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-full w-full flex-col",
          {
            "border-r": side === "left",
            "border-l": side === "right",
          },
          className
        )}
        {...props}
      />
    )
  }
)
SidebarContainer.displayName = "SidebarContainer"

// Provider component props
interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

// Provider component
const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ children, defaultOpen = false }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    const [openMobile, setOpenMobile] = React.useState(false)
    const isMobile = window.innerWidth < 768
    const state = isOpen ? "open" : "closed"

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
      <SidebarContext.Provider
        value={{
          isOpen,
          setIsOpen,
          toggleSidebar,
          isMobile,
          state,
          openMobile,
          setOpenMobile,
        }}
      >
        <div ref={ref}>{children}</div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// Inset component props
interface SidebarInsetProps {
  children: React.ReactNode
  className?: string
}

// Inset component
const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ children, className = "" }, ref) => {
    const context = React.useContext(SidebarContext)
    if (!context) {
      throw new Error("SidebarInset must be used within SidebarProvider")
    }

    return (
      <div
        ref={ref}
        className={cn("flex-1 transition-all duration-300", {
          "ml-64": context.isOpen,
          "ml-20": !context.isOpen
        }, className)}
      >
        {children}
      </div>
    )
  }
)
SidebarInset.displayName = "SidebarInset"

// Trigger component props
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

// Trigger component
const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className = "", onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("hover:bg-accent", className)}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          toggleSidebar()
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export {
  useSidebar,
  SidebarContainer,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  type SidebarContextType,
  type SidebarContainerProps,
  type SidebarProviderProps,
  type SidebarInsetProps,
  type SidebarTriggerProps,
}

"use client"

import { useAvatar } from "@/lib/avatar-context"
import { AvatarSelector } from "@/components/avatar-selector"

interface UserAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showEditOverlay?: boolean
}

export function UserAvatar({ size = "md", className = "", showEditOverlay = true }: UserAvatarProps) {
  const { currentAvatar, setCurrentAvatar } = useAvatar()

  return (
    <AvatarSelector
      selectedAvatarId={currentAvatar.id}
      onAvatarChange={setCurrentAvatar}
      size={size}
      className={className}
      showEditOverlay={showEditOverlay}
    />
  )
}

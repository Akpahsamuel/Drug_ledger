"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { avatars, type Avatar } from "@/lib/avatars"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n"

interface AvatarContextType {
  currentAvatar: Avatar
  setCurrentAvatar: (avatar: Avatar) => void
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined)

const defaultAvatar: Avatar = {
  id: 'default',
  url: '/default-avatar.png',
}

export function AvatarProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [currentAvatar, setCurrentAvatar] = useState<Avatar>(defaultAvatar)

  // Load saved avatar on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAvatarId = localStorage.getItem("userAvatar")
      if (savedAvatarId) {
        const avatar = avatars.find((a) => a.id === savedAvatarId)
        if (avatar) {
          setCurrentAvatar(avatar)
        }
      }
    }
  }, [])

  const handleSetAvatar = (avatar: Avatar) => {
    setCurrentAvatar(avatar)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userAvatar", avatar.id)
    }

    toast({
      title: t("avatarUpdated"),
      description: t("avatarUpdateSuccess"),
    })
  }

  return (
    <AvatarContext.Provider value={{ currentAvatar, setCurrentAvatar: handleSetAvatar }}>
      {children}
    </AvatarContext.Provider>
  )
}

export function useAvatar() {
  const context = useContext(AvatarContext)
  if (context === undefined) {
    throw new Error("useAvatar must be used within an AvatarProvider")
  }
  return context
}

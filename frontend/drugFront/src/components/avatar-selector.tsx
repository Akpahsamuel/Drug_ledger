"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { avatars, type Avatar as AvatarType } from "@/lib/avatars"
import { Check, Pencil } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

interface AvatarSelectorProps {
  selectedAvatarId: string
  onAvatarChange: (avatar: AvatarType) => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showEditOverlay?: boolean
}

export function AvatarSelector({
  selectedAvatarId,
  onAvatarChange,
  className = "",
  size = "lg",
  showEditOverlay = true,
}: AvatarSelectorProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const selectedAvatar = avatars.find((avatar) => avatar.id === selectedAvatarId) || avatars[0]

  // Size mapping for avatar dimensions
  const sizeClasses = {
    sm: "h-10 w-10 border-2",
    md: "h-16 w-16 border-3",
    lg: "h-24 w-24 border-4",
    xl: "h-32 w-32 border-4",
  }

  // Size mapping for fallback text
  const fallbackSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`relative group cursor-pointer ${className}`}>
          <Avatar className={`${sizeClasses[size]} border-slate-700 group-hover:border-cyan-500 transition-colors`}>
            <AvatarImage src={selectedAvatar.avatarUrl} alt={selectedAvatar.nickname} />
            <AvatarFallback className={`${fallbackSizes[size]} bg-gradient-to-br from-cyan-500 to-blue-600`}>
              {selectedAvatar.nickname.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          {showEditOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className={`${size === "sm" ? "h-4 w-4" : "h-6 w-6"} text-white`} />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
        <DialogHeader>
          <DialogTitle>{t("selectAvatar")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[50vh] max-h-[400px] mt-4 pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`
            relative p-2 rounded-lg cursor-pointer transition-all
            ${avatar.id === selectedAvatarId ? "bg-slate-700 ring-2 ring-cyan-500" : "hover:bg-slate-800"}
          `}
                onClick={() => {
                  onAvatarChange(avatar)
                  setIsOpen(false)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                    <AvatarImage src={avatar.avatarUrl} alt={avatar.nickname} />
                    <AvatarFallback className="text-sm sm:text-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                      {avatar.nickname.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium text-center text-slate-300 truncate w-full">
                    {avatar.nickname}
                  </span>
                </div>
                {avatar.id === selectedAvatarId && (
                  <div className="absolute top-2 right-2 bg-cyan-500 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

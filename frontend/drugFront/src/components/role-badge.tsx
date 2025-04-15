import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FlaskRoundIcon as Flask, ClipboardCheck, Truck, User } from "lucide-react"

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const roleConfig = {
    admin: {
      icon: ShieldCheck,
      label: "Admin",
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    manufacturer: {
      icon: Flask,
      label: "Manufacturer",
      className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    regulator: {
      icon: ClipboardCheck,
      label: "Regulator",
      className: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    distributor: {
      icon: Truck,
      label: "Distributor",
      className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    public: {
      icon: User,
      label: "Public",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
  }

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.public
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`px-3 py-1 text-sm font-medium ${config.className} flex items-center gap-1.5`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}

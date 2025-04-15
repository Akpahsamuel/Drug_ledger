import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ClipboardList,
  Truck,
  FileText,
  Settings,
  LogOut,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  role?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    role: ["admin", "manufacturer", "regulator", "distributor", "public"],
  },
  {
    title: "Products",
    href: "/products",
    icon: <Package className="h-5 w-5" />,
    role: ["admin", "manufacturer"],
  },
  {
    title: "Shipments",
    href: "/shipments",
    icon: <Truck className="h-5 w-5" />,
    role: ["admin", "manufacturer", "distributor"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <ClipboardList className="h-5 w-5" />,
    role: ["admin", "regulator"],
  },
  {
    title: "Verification",
    href: "/verification",
    icon: <Shield className="h-5 w-5" />,
    role: ["public"],
  },
  {
    title: "Issues",
    href: "/issues",
    icon: <AlertTriangle className="h-5 w-5" />,
    role: ["admin", "regulator", "public"],
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
    role: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    role: ["admin", "manufacturer", "regulator", "distributor", "public"],
  },
];

export function SideNav() {
  const location = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { userRole } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    window.location.href = "/login";
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.role || item.role.includes(userRole || "public")
  );

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900/50">
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-cyan-400" />
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            DrugLedger
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start gap-2 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white",
                location.pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "hover:bg-slate-800/50"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-300 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
} 
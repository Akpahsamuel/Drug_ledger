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
  Search,
  FileWarning,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  role?: string[];
  getHref?: (role: string) => string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    role: ["admin", "manufacturer", "regulator", "distributor", "public"],
    getHref: (role) => `/${role}/dashboard`,
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
    getHref: (role) => `/${role}/verification`,
  },
  {
    title: "Issues",
    href: "/issues",
    icon: <AlertTriangle className="h-5 w-5" />,
    role: ["admin", "regulator", "public"],
    getHref: (role) => `/${role}/issues`,
  },
  {
    title: "Report",
    href: "/report",
    icon: <FileWarning className="h-5 w-5" />,
    role: ["public"],
    getHref: (role) => `/${role}/report`,
  },
  {
    title: "Search",
    href: "/search",
    icon: <Search className="h-5 w-5" />,
    role: ["public"],
    getHref: (role) => `/${role}/search`,
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
    getHref: (role) => `/${role}/settings`,
  },
];

export function SideNav() {
  const location = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { userRole } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: t("loggedOutSuccessfully"),
      description: t("loggedOutDescription"),
      variant: "default",
    });
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.role || item.role.includes(userRole || "public")
  );

  // Mobile menu button
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 p-2 flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
              DrugLedger
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-sm pt-14">
            <div className="h-full overflow-auto py-4 px-2">
              <nav className="grid items-start gap-2">
                {filteredNavItems.map((item) => {
                  const href = item.getHref && userRole ? item.getHref(userRole) : item.href;
                  
                  return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white",
                        location.pathname === href
                          ? "bg-slate-800 text-white"
                          : "hover:bg-slate-800/50"
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-slate-300 hover:text-white mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div 
      className={cn(
        "flex h-full flex-col border-r border-slate-800 bg-slate-900/50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
              DrugLedger
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="flex items-center justify-center w-full">
            <FileText className="h-6 w-6 text-cyan-400" />
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-slate-300 hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start gap-2 px-2">
          {filteredNavItems.map((item) => {
            const href = item.getHref && userRole ? item.getHref(userRole) : item.href;
            
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white",
                  location.pathname === href
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800/50",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-slate-800 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-slate-300 hover:text-white",
            isCollapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
} 
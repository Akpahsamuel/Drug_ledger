import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SideNav } from "./side-nav";
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { Toaster } from "./ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect to login if not authenticated and not on public routes
    const publicRoutes = ["/", "/login", "/register"];
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, location.pathname, navigate, location]);

  // Don't show layout on public routes
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(location.pathname)) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <SideNav />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
} 
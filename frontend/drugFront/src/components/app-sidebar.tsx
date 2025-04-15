"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from './ui/sidebar';
import { Link } from 'react-router-dom';
import {
  Home,
  AlertTriangle,
  Database,
  LogOut,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface ProfileData {
  name: string;
  role?: string;
}

export function AppSidebar() {
  const { isOpen } = useSidebar();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }
    } catch (e) {
      console.error("Failed to load profile data:", e);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userProfile");
      
      toast({
        title: t("loggedOutSuccessfully"),
        description: t("loggedOutDescription"),
      });

      navigate("/");
    } catch (e) {
      console.error("Error during logout:", e);
      toast({
        title: t("logoutError"),
        description: t("logoutErrorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-slate-800 transition-all duration-300",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center">
          <Link to="/" className="text-xl font-bold text-white">
            {isOpen ? 'DrugLedger' : 'DL'}
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            to="/dashboard"
            className="flex items-center rounded-lg px-4 py-2 text-white hover:bg-slate-700"
          >
            <Home className="h-5 w-5 mr-3" />
            {isOpen && <span>Dashboard</span>}
          </Link>
          
          <Link
            to="/drugs"
            className="flex items-center rounded-lg px-4 py-2 text-white hover:bg-slate-700"
          >
            <Database className="h-5 w-5 mr-3" />
            {isOpen && <span>Drugs</span>}
          </Link>
          
          <Link
            to="/manufacturers"
            className="flex items-center rounded-lg px-4 py-2 text-white hover:bg-slate-700"
          >
            <Home className="h-5 w-5 mr-3" />
            {isOpen && <span>Manufacturers</span>}
          </Link>
          
          <Link
            to="/issues"
            className="flex items-center rounded-lg px-4 py-2 text-white hover:bg-slate-700"
          >
            <AlertTriangle className="h-5 w-5 mr-3" />
            {isOpen && <span>Issues</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-slate-700"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
}
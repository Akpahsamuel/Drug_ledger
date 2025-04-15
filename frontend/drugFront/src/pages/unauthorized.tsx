import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="text-center space-y-4">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-4xl font-bold text-white">Access Denied</h1>
        <p className="text-slate-400 max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
} 
import { useState } from "react";
import { AlertTriangle, Search, Filter, Plus } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  severity: "low" | "medium" | "high";
  reportedDate: string;
  productId: string;
  productName: string;
}

export default function Issues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [issues] = useState<Issue[]>([
    {
      id: "ISS-001",
      title: "Product Quality Issue",
      description: "Reported unusual color in medication",
      status: "open",
      severity: "medium",
      reportedDate: "2024-03-15",
      productId: "PROD-001",
      productName: "Sample Drug A",
    },
    {
      id: "ISS-002",
      title: "Packaging Damage",
      description: "Received damaged product packaging",
      status: "in_progress",
      severity: "low",
      reportedDate: "2024-03-14",
      productId: "PROD-002",
      productName: "Sample Drug B",
    },
  ]);

  const getStatusBadge = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-500/20 text-red-400">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500/20 text-yellow-400">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500/20 text-green-400">Resolved</Badge>;
    }
  };

  const getSeverityBadge = (severity: Issue["severity"]) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge>;
      case "high":
        return <Badge className="bg-red-500/20 text-red-400">High</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Issues</h1>
          <p className="text-slate-300">View and manage reported issues</p>
        </div>
        <Link to="/public/report">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </Link>
      </div>

      <GlassContainer>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <Button variant="outline" className="border-slate-700">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {issues.map((issue) => (
              <GlassCard key={issue.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-cyan-400 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      {issue.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      {getStatusBadge(issue.status)}
                      {getSeverityBadge(issue.severity)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Issue ID</p>
                      <p className="text-white">{issue.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Product</p>
                      <p className="text-white">{issue.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Product ID</p>
                      <p className="text-white">{issue.productId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Reported Date</p>
                      <p className="text-white">{issue.reportedDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Description</p>
                    <p className="text-white">{issue.description}</p>
                  </div>
                </CardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
} 
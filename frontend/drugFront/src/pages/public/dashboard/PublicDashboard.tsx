import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, ArrowRight, QrCode, FileText, ExternalLink, Info, Shield, Pill, Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/role-badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  verificationDate: string;
  batchNumber: string;
  expiryDate: string;
}

function PublicDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [recentVerifications] = useState([
    {
      id: "DRG-2025-001",
      name: "Amoxicillin 500mg",
      manufacturer: "PharmaCorp Inc.",
      status: "Verified",
      verificationDate: "2025-11-10",
    },
    {
      id: "DRG-2025-007",
      name: "Atorvastatin 20mg",
      manufacturer: "HealthGen Pharmaceuticals",
      status: "Verified",
      verificationDate: "2025-11-05",
    },
  ]);

  const [recentIssues] = useState([
    {
      id: "ISS-2025-001",
      drugId: "DRG-2025-003",
      drugName: "Metformin 850mg",
      description: "Packaging defect reported by multiple distributors",
      status: "Open",
      date: "2025-10-28",
    },
  ]);

  // Simulate search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, we'll return results if the query starts with "DRG-" or contains "amox"
      if (searchQuery.startsWith("DRG-") || searchQuery.toLowerCase().includes("amox")) {
        setSearchResults([
          {
            id: "DRG-2025-001",
            name: "Amoxicillin 500mg",
            manufacturer: "PharmaCorp Inc.",
            status: "Verified",
            verificationDate: "2025-11-10",
            batchNumber: "BATCH-2025-A45",
            expiryDate: "2027-11-10",
          },
        ]);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-900/70 to-blue-900/70 p-6 shadow-lg">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">DrugLedger</span> Public Dashboard
            </h1>
            <p className="text-slate-300 md:text-lg mt-2">Verify products and track pharmaceutical supply chain integrity</p>
          </div>
          <RoleBadge role="public" />
        </div>
      </div>

      {/* Safety Alert Banner */}
      {showBanner && (
        <div className="relative overflow-hidden rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 animate-fadeIn">
          <button 
            className="absolute top-2 right-2 text-amber-400 hover:text-amber-300"
            onClick={() => setShowBanner(false)}
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-400">Safety Alert: Metformin (DRG-2025-003)</h4>
              <p className="text-sm text-slate-300">Packaging defect reported. Verify your medication before use.</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
              <Link to="/public/alerts">
                View Alert
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Verification Container */}
      <GlassContainer className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white">Verify Product Authenticity</h2>
          <p className="text-slate-300 md:text-lg">
            Enter a product ID or scan a QR code to verify the authenticity and status of pharmaceutical products in our blockchain-secured database.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Enter product ID (e.g., DRG-2025-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 py-6 text-base md:text-lg bg-slate-800/40 border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="py-6 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-base md:text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              >
                Verify
              </Button>
              <Button 
                variant="outline" 
                className="py-6 px-4 border-slate-700/60 text-slate-300 hover:bg-slate-700/50 transition-all"
              >
                <QrCode className="h-5 w-5" />
                <span className="sr-only md:not-sr-only md:ml-2">Scan QR</span>
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            You can find the product ID on the packaging or scan the QR code for instant verification.
          </p>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-8 border-t border-slate-700/50 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Search className="mr-2 h-4 w-4 text-cyan-400" />
              Search Results
            </h3>

            {isSearching ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 animate-pulse">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3 w-full">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-48 bg-slate-700/50" />
                        <Skeleton className="h-5 w-20 bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <Skeleton className="h-5 w-40 bg-slate-700/50" />
                        <Skeleton className="h-5 w-36 bg-slate-700/50" />
                        <Skeleton className="h-5 w-32 bg-slate-700/50" />
                        <Skeleton className="h-5 w-28 bg-slate-700/50" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <Skeleton className="h-12 w-48 bg-slate-700/50" />
                      <Skeleton className="h-9 w-48 bg-slate-700/50" />
                    </div>
                  </div>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-700/60 rounded-lg bg-slate-800/20">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-400" />
                <p className="font-medium text-white text-lg">Product Not Found</p>
                <p className="mt-2 max-w-md mx-auto">
                  No products found matching "{searchQuery}". Please check the ID and try again.
                </p>
                <Button variant="outline" className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                  <Link to="/public/report" className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-400" />
                    Report Suspicious Product
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="p-5 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/40 transition-all">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-full bg-slate-700/50">
                            <Pill className="h-5 w-5 text-cyan-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-white">{product.name}</h4>
                          <Badge
                            className={
                              product.status === "Verified"
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                          <div className="p-2 rounded bg-slate-800/50">
                            <span className="text-slate-400">Product ID:</span>
                            <span className="ml-2 font-mono text-white">{product.id}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-800/50">
                            <span className="text-slate-400">Manufacturer:</span>
                            <span className="ml-2 text-white">{product.manufacturer}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-800/50">
                            <span className="text-slate-400">Batch Number:</span>
                            <span className="ml-2 font-mono text-white">{product.batchNumber}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-800/50">
                            <span className="text-slate-400">Expiry Date:</span>
                            <span className="ml-2 text-white">{product.expiryDate}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-800/50">
                            <span className="text-slate-400">Verification Date:</span>
                            <span className="ml-2 text-white">{product.verificationDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center gap-3">
                        {product.status === "Verified" ? (
                          <div className="flex items-center p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Authentic Product</span>
                          </div>
                        ) : (
                          <div className="flex items-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Verification Pending</span>
                          </div>
                        )}

                        <Button 
                          variant="outline" 
                          className="border-slate-700 text-cyan-400 hover:bg-slate-700/50 hover:text-cyan-300 transition-all"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Complete Details
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/30"
                        >
                          <Link to="/public/track" className="flex items-center w-full justify-center">
                            Track Supply Chain
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassContainer>

      {/* Recent Verifications and Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Verifications */}
        <GlassContainer className="h-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Recent Verifications
            </h2>
            <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {recentVerifications.map((verification) => (
              <div
                key={verification.id}
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/40 transition-all"
              >
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{verification.name}</p>
                    <p className="text-sm text-slate-400">
                      {verification.id} • {verification.manufacturer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">{verification.status}</Badge>
                  <Button variant="ghost" size="icon" className="ml-2 text-slate-400 hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {recentVerifications.length === 0 && (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-700 rounded-lg">
                No recent verifications found.
              </div>
            )}
          </div>
        </GlassContainer>

        {/* Recent Issues */}
        <GlassContainer className="h-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
              Recent Issues
            </h2>
            <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div 
                key={issue.id} 
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-3 hover:bg-slate-800/40 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{issue.drugName}</h3>
                      <p className="text-sm text-slate-400">
                        {issue.drugId} • Reported on {issue.date}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">{issue.status}</Badge>
                </div>

                <p className="text-sm text-slate-300 pl-11">{issue.description}</p>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {recentIssues.length === 0 && (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-700 rounded-lg">
                No recent issues found.
              </div>
            )}
          </div>
        </GlassContainer>
      </div>

      {/* Quick Actions */}
      <div>
        <GlassCard className="bg-gradient-to-br from-slate-900/50 to-slate-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                className="h-auto p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/20 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <Link to="/public/report" className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-red-500/10 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <span className="font-medium text-lg">Report an Issue</span>
                    <span className="text-sm text-slate-400 mt-1">Report quality or safety concerns about products</span>
                  </div>
                </Link>
              </Button>

              <Button
                className="h-auto p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/20 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <Link to="/public/search" className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-cyan-500/10 mb-3">
                      <Search className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="font-medium text-lg">Advanced Search</span>
                    <span className="text-sm text-slate-400 mt-1">Find detailed product and manufacturer information</span>
                  </div>
                </Link>
              </Button>

              <Button
                className="h-auto p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/20 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <a href="https://example.com/faq" target="_blank" rel="noopener noreferrer" className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-blue-500/10 mb-3">
                      <ExternalLink className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="font-medium text-lg">Help & Resources</span>
                    <span className="text-sm text-slate-400 mt-1">Access guides, FAQs and educational materials</span>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}

export default PublicDashboard;
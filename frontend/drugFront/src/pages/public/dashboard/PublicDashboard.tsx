import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, ArrowRight, QrCode, FileText, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/role-badge";
import { Input } from "@/components/ui/input";

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
            expiryDate: "2025-11-10",
          },
        ]);
      } else {
        setSearchResults([]);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Public Dashboard</h1>
          <p className="text-slate-300">Verify products and report quality or safety concerns</p>
        </div>
        <RoleBadge role="public" />
      </div>

      <GlassContainer>
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Verify Product Authenticity</h2>
          <p className="text-slate-300">
            Enter a product ID or scan a QR code to verify the authenticity and status of a pharmaceutical product.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Enter product ID (e.g., DRG-2025-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Verify
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              <QrCode className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Scan QR</span>
            </Button>
          </div>

          <p className="text-xs text-slate-400">
            You can find the product ID on the packaging or scan the QR code for instant verification.
          </p>
        </div>

        {hasSearched && (
          <div className="mt-6 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Search Results</h3>

            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-700 rounded-lg">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                <p className="font-medium text-white">Product Not Found</p>
                <p className="mt-1">
                  No products found matching your search criteria. Please check the ID and try again.
                </p>
                <Button variant="outline" className="mt-4 border-slate-700 text-slate-300">
                  <Link to="/public/report">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Suspicious Product
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Product ID:</span>
                            <span className="ml-2 font-mono text-slate-300">{product.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Manufacturer:</span>
                            <span className="ml-2 text-slate-300">{product.manufacturer}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Batch Number:</span>
                            <span className="ml-2 font-mono text-slate-300">{product.batchNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Expiry Date:</span>
                            <span className="ml-2 text-slate-300">{product.expiryDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Verification Date:</span>
                            <span className="ml-2 text-slate-300">{product.verificationDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center gap-2">
                        {product.status === "Verified" ? (
                          <div className="flex items-center p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>Authentic Product</span>
                          </div>
                        ) : (
                          <div className="flex items-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span>Verification Pending</span>
                          </div>
                        )}

                        <Button variant="outline" className="border-slate-700 text-slate-300">
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassContainer>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Verifications</h2>
            <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentVerifications.map((verification) => (
              <div
                key={verification.id}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-slate-700/50">
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

        <GlassContainer>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Issues</h2>
            <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{issue.drugName}</h3>
                    <p className="text-sm text-slate-400">
                      {issue.drugId} • Reported on {issue.date}
                    </p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">{issue.status}</Badge>
                </div>

                <p className="text-sm text-slate-300">{issue.description}</p>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 -mr-2"
                  >
                    Details
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-400 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="h-auto py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30"
              >
                <Link to="/public/report">
                  <div className="flex flex-col items-center text-center">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span className="font-medium">Report an Issue</span>
                    <span className="text-xs text-slate-400 mt-1">Report quality or safety concerns</span>
                  </div>
                </Link>
              </Button>

              <Button
                className="h-auto py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30"
              >
                <Link to="/public/search">
                  <div className="flex flex-col items-center text-center">
                    <Search className="h-6 w-6 mb-2" />
                    <span className="font-medium">Search Products</span>
                    <span className="text-xs text-slate-400 mt-1">Find detailed product information</span>
                  </div>
                </Link>
              </Button>

              <Button
                className="h-auto py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30"
              >
                <a href="https://example.com/faq" target="_blank" rel="noopener noreferrer">
                  <div className="flex flex-col items-center text-center">
                    <ExternalLink className="h-6 w-6 mb-2" />
                    <span className="font-medium">Help & Resources</span>
                    <span className="text-xs text-slate-400 mt-1">Access guides and FAQs</span>
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
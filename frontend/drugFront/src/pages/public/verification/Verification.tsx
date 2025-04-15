import { useState } from "react";
import { Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VerificationResult {
  id: string;
  name: string;
  manufacturer: string;
  status: "verified" | "unverified" | "pending";
  batchNumber: string;
  expiryDate: string;
  verificationDate: string;
}

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVerificationResult({
        id: searchQuery,
        name: "Sample Drug",
        manufacturer: "Pharma Corp",
        status: "verified",
        batchNumber: "BATCH-2024-001",
        expiryDate: "2025-12-31",
        verificationDate: new Date().toISOString().split("T")[0],
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Verification</h1>
          <p className="text-slate-300">Verify the authenticity of pharmaceutical products</p>
        </div>
      </div>

      <GlassContainer>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter product ID or batch number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <Button
              onClick={handleVerification}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>

          {verificationResult && (
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400 flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Verification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Product ID</p>
                    <p className="text-white">{verificationResult.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="text-white">{verificationResult.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Manufacturer</p>
                    <p className="text-white">{verificationResult.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Batch Number</p>
                    <p className="text-white">{verificationResult.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Expiry Date</p>
                    <p className="text-white">{verificationResult.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Verification Date</p>
                    <p className="text-white">{verificationResult.verificationDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {verificationResult.status === "verified" ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <Badge className="bg-green-500/20 text-green-400">
                        Verified Product
                      </Badge>
                    </>
                  ) : verificationResult.status === "unverified" ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <Badge className="bg-red-500/20 text-red-400">
                        Unverified Product
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        Verification Pending
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </GlassCard>
          )}
        </div>
      </GlassContainer>
    </div>
  );
} 
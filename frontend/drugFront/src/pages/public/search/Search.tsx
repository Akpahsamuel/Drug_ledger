import { useState } from "react";
import { Search as SearchIcon, Filter, Package } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  category: string;
  status: "active" | "discontinued" | "pending";
  lastUpdated: string;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products] = useState<Product[]>([
    {
      id: "PROD-001",
      name: "Sample Drug A",
      manufacturer: "Pharma Corp",
      description: "A sample pharmaceutical product",
      category: "Prescription",
      status: "active",
      lastUpdated: "2024-03-15",
    },
    {
      id: "PROD-002",
      name: "Sample Drug B",
      manufacturer: "Health Pharma",
      description: "Another sample pharmaceutical product",
      category: "Over-the-counter",
      status: "active",
      lastUpdated: "2024-03-14",
    },
  ]);

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case "discontinued":
        return <Badge className="bg-red-500/20 text-red-400">Discontinued</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Search Products</h1>
          <p className="text-slate-300">Search and view pharmaceutical product information</p>
        </div>
      </div>

      <GlassContainer>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by product name, ID, or manufacturer..."
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
            {products.map((product) => (
              <GlassCard key={product.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-cyan-400 flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      {product.name}
                    </CardTitle>
                    {getStatusBadge(product.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Product ID</p>
                      <p className="text-white">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Manufacturer</p>
                      <p className="text-white">{product.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Category</p>
                      <p className="text-white">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Last Updated</p>
                      <p className="text-white">{product.lastUpdated}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Description</p>
                    <p className="text-white">{product.description}</p>
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
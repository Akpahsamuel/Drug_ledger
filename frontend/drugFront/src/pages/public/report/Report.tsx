import { useState } from "react";
import { FileWarning, Search } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ReportForm {
  productId: string;
  productName: string;
  issueType: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export default function Report() {
  const { toast } = useToast();
  const [form, setForm] = useState<ReportForm>({
    productId: "",
    productName: "",
    issueType: "",
    description: "",
    severity: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Issue Reported",
        description: "Your issue has been successfully reported and is under review.",
      });
      setForm({
        productId: "",
        productName: "",
        issueType: "",
        description: "",
        severity: "medium",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSearch = async () => {
    if (!form.productId.trim()) return;

    // Simulate API call to fetch product details
    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        productName: "Sample Drug",
      }));
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Report Issue</h1>
          <p className="text-slate-300">Report quality or safety concerns about pharmaceutical products</p>
        </div>
      </div>

      <GlassContainer>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400 flex items-center">
                <FileWarning className="mr-2 h-5 w-5" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Product ID</label>
                <div className="flex gap-2">
                  <Input
                    value={form.productId}
                    onChange={(e) => setForm((prev) => ({ ...prev, productId: e.target.value }))}
                    placeholder="Enter product ID"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    variant="outline"
                    className="border-slate-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Product Name</label>
                <Input
                  value={form.productName}
                  onChange={(e) => setForm((prev) => ({ ...prev, productName: e.target.value }))}
                  placeholder="Product name will appear here"
                  className="bg-slate-800/50 border-slate-700"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Issue Type</label>
                <Input
                  value={form.issueType}
                  onChange={(e) => setForm((prev) => ({ ...prev, issueType: e.target.value }))}
                  placeholder="e.g., Quality Issue, Safety Concern, Packaging Problem"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed description of the issue"
                  className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Severity</label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((severity) => (
                    <Button
                      key={severity}
                      type="button"
                      variant={form.severity === severity ? "default" : "outline"}
                      className={`${
                        form.severity === severity
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                          : "border-slate-700"
                      }`}
                      onClick={() => setForm((prev) => ({ ...prev, severity }))}
                    >
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !form.productId || !form.issueType || !form.description}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </GlassContainer>
    </div>
  );
} 
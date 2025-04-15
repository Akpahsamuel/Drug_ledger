import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { GlassCard } from "@/components/glass-card"
import { GlassContainer } from "@/components/glass-container"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Shield,
  FileText,
  FlaskRound as Flask,
  Truck,
  ClipboardCheck,
  CheckCircle,
  BarChart3,
  Lock,
  Globe,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-16">
        {/* Hero Section */}
        <div className="relative pt-4 sm:pt-8 pb-8 sm:pb-16">
          {/* Background gradient effects */}
          <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 py-4 sm:py-8">
            <div className="flex-1 space-y-4 sm:space-y-8 text-center lg:text-left">
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium">
                Blockchain-Powered Supply Chain
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                  DrugLedger
                </span>
                <span className="text-white"> Platform</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A secure, transparent, and decentralized pharmaceutical supply chain tracking platform that ensures
                product integrity from manufacturer to consumer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
                <Button
                  onClick={handleConnectClick}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-lg text-base sm:text-lg font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.5)]"
                >
                  Connect Wallet
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-4 sm:px-8 py-4 sm:py-6 rounded-lg text-base sm:text-lg"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  Secure
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  Transparent
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  Immutable
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  Compliant
                </div>
              </div>
            </div>

            <div className="flex-1 relative mt-8 lg:mt-0 w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-xl"></div>
              <GlassContainer className="relative p-3 sm:p-6 overflow-hidden rounded-2xl border-slate-700/50 shadow-xl">
                <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="font-bold text-base sm:text-xl text-white">DrugLedger</span>
                    </div>
                    <div className="px-2 sm:px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm">Live Demo</div>
                  </div>
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="DrugLedger Platform Dashboard"
                    className="w-full h-auto rounded-lg border border-slate-700/50 shadow-lg"
                  />
                  <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="p-2 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 flex flex-col items-center justify-center">
                      <div className="text-xl sm:text-2xl font-bold text-cyan-400">42</div>
                      <div className="text-xs sm:text-sm text-slate-400">Products</div>
                    </div>
                    <div className="p-2 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 flex flex-col items-center justify-center">
                      <div className="text-xl sm:text-2xl font-bold text-cyan-400">18</div>
                      <div className="text-xs sm:text-sm text-slate-400">Shipments</div>
                    </div>
                    <div className="p-2 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 flex flex-col items-center justify-center">
                      <div className="text-xl sm:text-2xl font-bold text-cyan-400">96%</div>
                      <div className="text-xs sm:text-sm text-slate-400">Verified</div>
                    </div>
                  </div>
                </div>
              </GlassContainer>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-8 sm:py-16">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Comprehensive Supply Chain Management</h2>
            <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg">
              DrugLedger provides end-to-end visibility and control across the entire pharmaceutical supply chain
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-7xl mx-auto">
            <GlassCard className="transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.2)]">
              <CardHeader className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Flask className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
                </div>
                <CardTitle className="text-cyan-400 text-lg sm:text-xl">Manufacturers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <p className="text-slate-300 text-sm sm:text-base">
                  Register products and manage their lifecycle from production to recall.
                </p>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Product registration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Batch tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Quality assurance
                  </li>
                </ul>
              </CardContent>
            </GlassCard>

            <GlassCard className="transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.2)]">
              <CardHeader className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 sm:h-7 sm:w-7 text-green-400" />
                </div>
                <CardTitle className="text-green-400 text-lg sm:text-xl">Regulators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <p className="text-slate-300 text-sm sm:text-base">Monitor compliance, track issues, and verify product authenticity.</p>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Compliance monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Issue tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Audit trails
                  </li>
                </ul>
              </CardContent>
            </GlassCard>

            <GlassCard className="transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.2)]">
              <CardHeader className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-purple-400" />
                </div>
                <CardTitle className="text-purple-400 text-lg sm:text-xl">Distributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <p className="text-slate-300 text-sm sm:text-base">
                  Track shipments and ensure product integrity throughout distribution.
                </p>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Shipment tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Temperature monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Chain of custody
                  </li>
                </ul>
              </CardContent>
            </GlassCard>

            <GlassCard className="transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.2)]">
              <CardHeader className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400" />
                </div>
                <CardTitle className="text-amber-400 text-lg sm:text-xl">Public</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <p className="text-slate-300 text-sm sm:text-base">Verify product authenticity and report quality or safety concerns.</p>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Product verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Issue reporting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                    Recall notifications
                  </li>
                </ul>
              </CardContent>
            </GlassCard>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-8 sm:py-16">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center max-w-7xl mx-auto">
            <div className="flex-1 w-full">
              <GlassContainer className="p-4 sm:p-8 h-full">
                <div className="space-y-4 sm:space-y-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Choose DrugLedger?</h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Enhanced Security</h3>
                        <p className="text-slate-300 text-sm sm:text-base">
                          Immutable blockchain records ensure data integrity and prevent tampering.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Real-time Analytics</h3>
                        <p className="text-slate-300 text-sm sm:text-base">
                          Comprehensive dashboards provide actionable insights across the supply chain.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Regulatory Compliance</h3>
                        <p className="text-slate-300 text-sm sm:text-base">
                          Built-in compliance features help meet industry regulations and standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-8 py-3 sm:py-6 rounded-lg text-base sm:text-lg">
                      Explore Features
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
              </GlassContainer>
            </div>

            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-xl"></div>
                <GlassContainer className="relative p-4 sm:p-8 border-slate-700/50">
                  <div className="space-y-4 sm:space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Try DrugLedger Today</h3>
                      <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm">Demo Available</div>
                    </div>

                    <p className="text-slate-300 text-base sm:text-lg">
                      Experience the future of pharmaceutical supply chain management with our secure, transparent
                      platform.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-4 sm:p-6 rounded-lg bg-slate-800/50 border border-slate-700/30">
                        <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">For Enterprises</div>
                        <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                          Complete supply chain solution with custom integration
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm sm:text-base py-1 sm:py-2"
                        >
                          Contact Sales
                        </Button>
                      </div>

                      <div className="p-4 sm:p-6 rounded-lg bg-slate-800/50 border border-slate-700/30">
                        <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">For Developers</div>
                        <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                          API access and developer tools to build on our platform
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm sm:text-base py-1 sm:py-2"
                        >
                          View Documentation
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-6">
                      <Button 
                        onClick={handleConnectClick}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-8 py-3 sm:py-6 rounded-lg text-base sm:text-lg font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,214,0.5)]"
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  </div>
                </GlassContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                DrugLedger
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm">
              <Link to="#" className="hover:text-white transition-colors">
                About
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Documentation
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <div className="text-slate-500 text-xs sm:text-sm">© 2025 DrugLedger. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
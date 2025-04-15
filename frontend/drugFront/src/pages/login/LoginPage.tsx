import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GlassContainer } from "@/components/glass-container"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useRoleManager } from "@/hooks/useRoleManager"
import { useDispatch } from 'react-redux'
import { login } from "@/store/authSlice"

// Define wallet addresses for each role
const WALLET_ROLES: Record<string, string> = {
  "0x123": "admin",
  "0x456": "manufacturer",
  "0x789": "regulator",
  "0xabc": "distributor",
  // Default public role for other addresses
}

function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [showTestRoutes, setShowTestRoutes] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const currentAccount = useCurrentAccount()
  const { role, isLoading: isRoleLoading } = useRoleManager()
  const dispatch = useDispatch()
  
  // Handle role-based navigation
  useEffect(() => {
    if (currentAccount && role && !isRoleLoading) {
      setIsConnecting(true)
      
      // Generate a simple token (in production, this should be a proper JWT)
      const token = btoa(`${currentAccount.address}:${role}:${Date.now()}`)
      
      // Dispatch login action
      dispatch(login({ role, token }))
      
      toast({
        title: "Role Detected",
        description: `You have been identified as: ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      })

      // Redirect to the appropriate dashboard or the page they tried to access
      const from = location.state?.from?.pathname || `/${role}/dashboard`
      setTimeout(() => {
        navigate(from)
      }, 1000)
    }
  }, [currentAccount, role, isRoleLoading, dispatch, navigate, location, toast])

  // Handle test route navigation
  const navigateToTestRoute = (role: string) => {
    const token = btoa(`test-user:${role}:${Date.now()}`)
    dispatch(login({ role, token }))
    
    toast({
      title: "Test Mode",
      description: `You are now viewing the ${role} dashboard in test mode`,
    })
    
    navigate(`/${role}/dashboard`)
  }

  // Toggle dev test routes
  const toggleTestRoutes = () => {
    setShowTestRoutes(prev => !prev)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <GlassContainer className="max-w-md w-full p-8">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-cyan-400">Connect Your Wallet</h1>
          <p className="text-slate-300">
            Connect your wallet to access the DrugLedger platform. Your role will be automatically detected from the blockchain.
          </p>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
            {currentAccount ? (
              <div className="space-y-4 relative">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-300">Connected Wallet</p>
                  <p className="font-mono text-cyan-400">
                    {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button disabled className="relative">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRoleLoading ? "Detecting Role..." : "Redirecting..."}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative space-y-4">
                <div className="flex justify-center">
                  <div className="transform transition-all hover:scale-105">
                    <ConnectButton 
                      connectText="Connect Sui Wallet" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(0,194,214,0.5)]" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-400">
            By connecting, you agree to the terms of service and privacy policy.
          </p>
          
          {/* Development Testing Section */}
          <div className="mt-8 pt-4 border-t border-slate-700">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTestRoutes}
              className="text-slate-400 border-slate-700 hover:bg-slate-800"
            >
              {showTestRoutes ? "Hide Test Routes" : "Show Test Routes"}
            </Button>
            
            {showTestRoutes && (
              <div className="mt-4 space-y-3 p-4 bg-slate-800/40 rounded-lg border border-slate-700">
                <h3 className="text-cyan-400 text-sm font-medium">Development Testing Routes</h3>
                <p className="text-xs text-slate-400">Use these buttons to test different role dashboards without connecting a wallet:</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-300"
                    onClick={() => navigateToTestRoute("admin")}
                  >
                    Admin Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300"
                    onClick={() => navigateToTestRoute("manufacturer")}
                  >
                    Manufacturer Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-purple-900/30 hover:bg-purple-800/40 text-purple-300"
                    onClick={() => navigateToTestRoute("regulator")}
                  >
                    Regulator Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-amber-900/30 hover:bg-amber-800/40 text-amber-300"
                    onClick={() => navigateToTestRoute("distributor")}
                  >
                    Distributor Dashboard
                  </Button>
                </div>
                
                <p className="text-xs text-slate-500 italic mt-2">
                  Note: These routes are for development testing only
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassContainer>
    </div>
  )
}

export default LoginPage;
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GlassContainer } from "@/components/glass-container"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useRoleManager } from "@/hooks/useRoleManager"
import { useDispatch } from 'react-redux'
import { login } from "@/store/authSlice"

function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showTestRoutes, setShowTestRoutes] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const currentAccount = useCurrentAccount()
  const { data: role, isLoading: isRoleLoading, refetch: checkRole } = useRoleManager()
  const dispatch = useDispatch()
  
  // Auto-detect role and redirect when wallet is connected
  useEffect(() => {
    const handleRoleDetection = async () => {
      if (currentAccount && !isRoleLoading) {
        // If role is null, it means no wallet is connected
        if (role === null) {
          return;
        }
        
        // If role is public or any other role, log the user in
        const userRole = role || 'public';
        
        // Generate a simple token (in production, this should be a proper JWT)
        const token = btoa(`${currentAccount.address}:${userRole}:${Date.now()}`)
        
        // Dispatch login action
        dispatch(login({ role: userRole, token }))
        
        toast({
          title: "Login Successful",
          description: `You have logged in as: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`,
        })

        // Redirect to the appropriate dashboard or the page they tried to access
        const from = location.state?.from?.pathname || `/${userRole}/dashboard`
        navigate(from)
      }
    }
    
    handleRoleDetection();
  }, [currentAccount, role, isRoleLoading, dispatch, navigate, location.state, toast])
  
  // Handle login button click
  const handleLogin = async () => {
    if (!currentAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet before logging in",
        variant: "destructive"
      })
      return
    }
    
    setIsLoggingIn(true)
    
    try {
      // Fetch the user's role if not already loaded
      if (!role) {
        await checkRole()
      }
      
      // The useEffect will handle the login and redirection
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive"
      })
      console.error("Login error:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle test route navigation
  const navigateToTestRoute = (role: string) => {
    const token = btoa(`test-user:${role}:${Date.now()}`)
    dispatch(login({ role, token }))
    
    toast({
      title: "Development Mode",
      description: `Accessing ${role.charAt(0).toUpperCase() + role.slice(1)} dashboard in development mode`,
      className: "bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30 text-white",
      duration: 3000,
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
          <h1 className="text-3xl font-bold text-cyan-400">Welcome to DrugLedger</h1>
          <p className="text-slate-300">
            Connect your wallet and click login to access the platform.
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
            
            <div className="relative space-y-4">
              {/* Wallet Connection Button */}
              <div className="flex justify-center mb-4">
                <div className="transform transition-all hover:scale-105">
                  <ConnectButton 
                    connectText="Connect Sui Wallet" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(0,194,214,0.5)]" 
                  />
                </div>
              </div>
              
              {/* Connected Wallet Display */}
              {currentAccount && (
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-300">Connected Wallet</p>
                  <p className="font-mono text-cyan-400">
                    {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
                  </p>
                </div>
              )}
              
              {/* Login Button */}
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoggingIn || !currentAccount || isRoleLoading}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-2 rounded-lg font-medium transition-all w-full"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : isRoleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading role...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            By connecting, you agree to the terms of service and privacy policy.
          </p>
          
          {/* Role Status Messages */}
          {!currentAccount && (
            <p className="text-sm text-slate-400 mt-4">
              No wallet connected. Please connect your wallet to continue.
            </p>
          )}
          
          {currentAccount && isRoleLoading && (
            <p className="text-sm text-slate-400 mt-4">
              Detecting your role on the blockchain...
            </p>
          )}
          
          {currentAccount && !isRoleLoading && role === 'public' && (
            <p className="text-sm text-slate-400 mt-4">
              You are logged in as a public user. Only administrators can assign specific roles on the blockchain.
            </p>
          )}
          
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
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-blue-900/30 hover:bg-blue-800/40 text-blue-300"
                    onClick={() => navigateToTestRoute("public")}
                  >
                    Public Dashboard
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

export default LoginPage
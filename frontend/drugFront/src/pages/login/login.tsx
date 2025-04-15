import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoleManager } from '@/hooks/useRoleManager'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useDispatch } from 'react-redux'
import { login } from '@/store/authSlice'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const account = useCurrentAccount()
  const { data: role, isLoading, error } = useRoleManager()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showManualLogin, setShowManualLogin] = useState(false)

  useEffect(() => {
    if (role && !isRedirecting) {
      setIsRedirecting(true)
      console.log('Role detected:', role)
      
      // Store the role in Redux
      dispatch(login({ role, token: 'dummy-token' }))

      // Navigate based on role
      const path = `/${role}/dashboard`
      console.log('Redirecting to:', path)
      navigate(path, { replace: true })
    }
  }, [role, navigate, dispatch, isRedirecting])

  const handleManualLogin = (roleType: string) => {
    // Manually log in as specified role
    dispatch(login({ role: roleType, token: `manual-login-${roleType}` }))
    navigate(`/${roleType}/dashboard`, { replace: true })
    toast.success(`Logged in as ${roleType} user`)
  }

  if (error) {
    toast.error('Error detecting role. Please try again.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome to DrugLedger</h2>
          <p className="mt-2 text-slate-400">Connect your wallet to continue</p>
        </div>

        <div className="mt-8">
          <ConnectButton className="w-full" />
        </div>

        {isLoading && account?.address && (
          <div className="mt-4 text-center text-slate-400">
            Detecting your role...
          </div>
        )}

        {!account?.address && (
          <div className="mt-4 text-center text-slate-400">
            Connect your wallet to access the platform
          </div>
        )}

        {isRedirecting && (
          <div className="mt-4 text-center text-slate-400">
            Redirecting to your dashboard...
          </div>
        )}

        {/* How to Test Routes Section */}
        <div className="mt-8 pt-4 border-t border-slate-700">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-white">How to Test Routes</h3>
            <p className="text-sm text-slate-400">For development and testing purposes only</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleManualLogin('public')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Public
            </button>
            <button
              onClick={() => handleManualLogin('admin')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => handleManualLogin('manufacturer')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Manufacturer
            </button>
            <button
              onClick={() => handleManualLogin('regulator')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Regulator
            </button>
            <button
              onClick={() => handleManualLogin('distributor')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Distributor
            </button>
            <button
              onClick={() => navigate('/unauthorized')}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
            >
              Unauthorized
            </button>
          </div>
          
          <p className="mt-2 text-xs text-slate-500 text-center">
            These buttons bypass wallet connection and role detection
          </p>
        </div>
      </div>
    </div>
  )
} 
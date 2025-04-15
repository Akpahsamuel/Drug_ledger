import { useCurrentAccount } from '@mysten/dapp-kit'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { useQuery } from '@tanstack/react-query'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export const ROLE_ADMIN = 0
export const ROLE_MANUFACTURER = 1
export const ROLE_REGULATOR = 2
export const ROLE_DISTRIBUTOR = 3
export const ROLE_PUBLIC = 'public'

// Get addresses from environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
const PACKAGE_ADDRESS = import.meta.env.VITE_PACKAGE_ADDRESS

// Validate environment variables
if (!CONTRACT_ADDRESS || !PACKAGE_ADDRESS) {
  console.error('Missing required environment variables: VITE_CONTRACT_ADDRESS or VITE_PACKAGE_ADDRESS')
}

export function useRoleManager() {
  const account = useCurrentAccount()
  const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') })

  return useQuery({
    queryKey: ['role', account?.address],
    queryFn: async () => {
      // Immediately return public role if no account is connected
      if (!account?.address) {
        console.log('No account connected, returning public role')
        return ROLE_PUBLIC
      }

      // Return public role if environment variables are not set
      if (!CONTRACT_ADDRESS || !PACKAGE_ADDRESS) {
        console.error('Contract or package address not configured')
        return ROLE_PUBLIC
      }

      try {
        console.log('Checking role for address:', account.address)
        console.log('Using package address:', PACKAGE_ADDRESS)
        
        const tx = new TransactionBlock()
        tx.moveCall({
          target: `${PACKAGE_ADDRESS}::drug_ledger::get_role`,
          arguments: [tx.pure(account.address)],
        })

        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx,
          sender: account.address,
        })

        // Get the return value from the transaction results
        const returnValue = result.results?.[0]?.returnValues?.[0]
        if (!returnValue) {
          console.log('No role found, returning public role')
          return ROLE_PUBLIC
        }

        const [roleValue] = JSON.parse(returnValue[1]) as [number]
        console.log('Role value from contract:', roleValue)
        
        switch (roleValue) {
          case ROLE_ADMIN:
            return 'admin'
          case ROLE_MANUFACTURER:
            return 'manufacturer'
          case ROLE_REGULATOR:
            return 'regulator'
          case ROLE_DISTRIBUTOR:
            return 'distributor'
          default:
            console.log('Unknown role value, returning public role')
            return ROLE_PUBLIC
        }
      } catch (error) {
        console.error('Error fetching role:', error)
        // If the error is related to package not found, return public role
        if (error instanceof Error && error.message.includes('Package object does not exist')) {
          console.log('Package not found, returning public role')
          return ROLE_PUBLIC
        }
        return ROLE_PUBLIC
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  })
}
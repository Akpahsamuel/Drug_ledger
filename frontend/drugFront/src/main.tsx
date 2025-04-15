import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import "@mysten/dapp-kit/dist/index.css"
import "@radix-ui/themes/styles.css"

import App from './App'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { Theme } from '@radix-ui/themes'
import authReducer from './store/authSlice'
import { networkConfig } from "./networkConfig.ts"
import "./index.css"

// Create a Sui client instance for the mainnet
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') })

// Create Redux store with proper typing
const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Disable serializable check for Sui objects
    })
})

// Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Export store type for use in components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <Provider store={store}>
              <App />
            </Provider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </StrictMode>
)

import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { networkConfig } from "./config/networkConfig";

const queryClient = new QueryClient();

// Get preferred network from storage, defaulting to devnet
const getPreferredNetwork = (): keyof typeof networkConfig => {
  if (typeof window === 'undefined') return "devnet";
  
  const savedNetwork = sessionStorage.getItem('preferred_network');
  if (savedNetwork === 'devnet' || savedNetwork === 'testnet' || savedNetwork === 'mainnet') {
    console.log('Using saved network preference:', savedNetwork);
    return savedNetwork as keyof typeof networkConfig;
  }
  
  // Default to devnet
  return "devnet";
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider 
          networks={networkConfig}
          defaultNetwork={getPreferredNetwork()}
          onNetworkChange={(network) => {
            console.log("Network changed to:", network);
            sessionStorage.setItem('preferred_network', network);
          }}
        >
          <WalletProvider autoConnect>
            <RouterProvider router={router} />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);

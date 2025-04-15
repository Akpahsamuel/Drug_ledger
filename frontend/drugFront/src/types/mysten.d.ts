declare module '@mysten/dapp-kit' {
  import { ReactNode } from 'react';
  
  export interface WalletProviderProps {
    autoConnect?: boolean;
    children: ReactNode;
  }
  
  export function WalletProvider(props: WalletProviderProps): JSX.Element;
  
  export interface SuiClientProviderProps {
    networks: Record<string, { url: string }>;
    defaultNetwork: string;
    children: ReactNode;
  }
  
  export function SuiClientProvider(props: SuiClientProviderProps): JSX.Element;
  
  export function ConnectButton(props: any): JSX.Element;
  
  export function useCurrentAccount(): { address: string } | null;
}

declare module '@mysten/sui/client' {
  export function getFullnodeUrl(network: string): string;
} 
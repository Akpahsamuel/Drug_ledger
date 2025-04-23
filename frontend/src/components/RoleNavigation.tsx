import { Link, Text, Flex, Box, Card } from "@radix-ui/themes";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";

export default function RoleNavigation() {
  const currentAccount = useCurrentAccount();
  const location = useLocation();
  
  // Get network name for debugging
  const networkName = useNetworkVariable("network") as string;

  if (!currentAccount) {
    return null;
  }

  // Helper function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Flex gap="4">
        <Link asChild>
          <RouterLink to="/" style={{ color: isActive('/') ? "var(--accent-9)" : undefined }}>
            Home
          </RouterLink>
        </Link>
        
        <Link asChild>
          <RouterLink to="/admin" style={{ color: isActive('/admin') ? "var(--accent-9)" : undefined }}>
            Admin
          </RouterLink>
        </Link>
        
        <Link asChild>
          <RouterLink to="/manufacturer" style={{ color: isActive('/manufacturer') ? "var(--accent-9)" : undefined }}>
            Manufacturer
          </RouterLink>
        </Link>
        
        <Link asChild>
          <RouterLink to="/regulator" style={{ color: isActive('/regulator') ? "var(--accent-9)" : undefined }}>
            Regulator
          </RouterLink>
        </Link>
        
        <Link asChild>
          <RouterLink to="/distributor" style={{ color: isActive('/distributor') ? "var(--accent-9)" : undefined }}>
            Distributor
          </RouterLink>
        </Link>
      </Flex>
      
      <Box position="fixed" bottom="0" right="0" style={{ zIndex: 1000 }}>
        <Card size="1" style={{ width: '450px', maxHeight: '200px', opacity: 0.95, fontSize: '12px', overflow: 'auto' }}>
          <Text weight="bold">🔑 Debug Info:</Text>
          <Box>
            <Text>Account: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}</Text>
            <Text>Network: <Text color={networkName === 'devnet' ? 'cyan' : 
                                    networkName === 'testnet' ? 'amber' : 
                                    networkName === 'mainnet' ? 'green' : 'gray'} 
                      style={{ fontWeight: 'bold' }}>
              {networkName?.toUpperCase() || 'UNKNOWN'}
            </Text></Text>
          </Box>
          <Box mt="2">
            <Text weight="bold">Access Control:</Text>
            <Text color="green">Role checks disabled - all routes accessible</Text>
          </Box>
        </Card>
      </Box>
    </>
  );
} 
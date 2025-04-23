import { ConnectButton, useCurrentAccount, useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import RoleNavigation from "./components/RoleNavigation";
import { useEffect, useState } from "react";
import { useNetworkVariable, networkConfig } from "./config/networkConfig";

// Custom hook to get active network
function useActiveNetwork() {
  const packageId = useNetworkVariable("packageId");
  const client = useSuiClient();
  const [activeNetwork, setActiveNetwork] = useState("unknown");
  
  // Get network directly from network variables (now allowed by our type augmentation)
  try {
    const networkName = useNetworkVariable("network");
    if (networkName) {
      return networkName as string;
    }
  } catch (e) {
    console.log("Error getting network variable:", e);
  }

  // Fallback to package ID detection if network variable not available
  useEffect(() => {
    console.log("Package ID:", packageId || "undefined");
    console.log("SUI Client initialized:", !!client);
    
    // Try to read network from window.location
    const url = window.location.href;
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      console.log("Running on localhost");
    }
    
    // Log if we're in development mode
    console.log("NODE_ENV:", import.meta.env.MODE);
    
    // Determine network from available package IDs
    if (packageId === networkConfig.devnet.variables.packageId) {
      setActiveNetwork("devnet");
    } else if (packageId === networkConfig.testnet.variables.packageId) {
      setActiveNetwork("testnet");
    } else if (packageId === networkConfig.mainnet.variables.packageId) {
      setActiveNetwork("mainnet");
    } else {
      setActiveNetwork("unknown");
    }
  }, [packageId, client]);

  return activeNetwork;
}

// Network switcher component
function NetworkSwitcher() {
  // Get the SuiClient context which has selectNetwork function
  const ctx = useSuiClientContext();
  const activeNetwork = ctx.network;
  
  // Get network label and color
  const getNetworkColor = (network: string) => {
    switch(network) {
      case 'devnet': return '#0891b2'; // cyan
      case 'testnet': return '#ca8a04'; // amber
      case 'mainnet': return '#059669'; // green
      default: return '#6b7280'; // gray
    }
  };
  
  const getNetworkLabel = (network: string) => {
    switch(network) {
      case 'devnet': return 'DEV';
      case 'testnet': return 'TEST';
      case 'mainnet': return 'MAIN';
      default: return 'UNKNOWN';
    }
  };
  
  // Handle network change
  const handleNetworkSwitch = (network: string) => {
    // Use the selectNetwork function from context
    ctx.selectNetwork(network);
    console.log("Network changed to:", network);
  };
  
  return (
    <Flex gap="2" align="center">
      <Text size="1" style={{ minWidth: '60px' }}>Network:</Text>
      <Select.Root value={activeNetwork} onValueChange={handleNetworkSwitch} size="1">
        <Select.Trigger 
          style={{ 
            backgroundColor: getNetworkColor(activeNetwork),
            color: 'white',
            fontWeight: 'bold',
            minWidth: '80px'
          }} 
          aria-label="Network"
        >
          {getNetworkLabel(activeNetwork)}
        </Select.Trigger>
        <Select.Content position="popper">
          <Select.Item value="devnet">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#0891b2' 
              }}/>
              <Text style={{ fontWeight: 'bold' }}>DEVNET</Text>
            </Flex>
          </Select.Item>
          <Select.Item value="testnet">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#ca8a04' 
              }}/>
              <Text style={{ fontWeight: 'bold' }}>TESTNET</Text>
            </Flex>
          </Select.Item>
          <Select.Item value="mainnet">
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#059669'
              }}/>
              <Text style={{ fontWeight: 'bold' }}>MAINNET</Text>
            </Flex>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

function App() {
  const currentAccount = useCurrentAccount();
  const { network: activeNetwork } = useSuiClientContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Log the active network in browser console
    console.log("Active Network:", activeNetwork);
  }, [activeNetwork]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          zIndex: 1000,
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          backgroundColor: isScrolled ? "rgba(20, 20, 30, 0.8)" : "var(--color-panel)",
          transition: "backdrop-filter 0.3s ease, background-color 0.3s ease",
        }}
      >
        <Flex align="center" gap="4">
          <Box>
            <Heading>DrugLedger</Heading>
          </Box>
          
          {currentAccount && <RoleNavigation />}
        </Flex>

        <Flex align="center" gap="3">
          <NetworkSwitcher />
          <Box>
            <ConnectButton />
          </Box>
        </Flex>
      </Flex>
      <Container style={{ paddingTop: "60px" }}>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default App;

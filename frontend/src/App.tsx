import { useCurrentAccount, useSuiClientContext, useSuiClient } from "@mysten/dapp-kit";
import { Box } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNetworkVariable, networkConfig } from "./config/networkConfig";
import NetworkSwitcher from "./components/NetworkSwitcher";
import Navbar from "./components/Navbar";
import RoleNavigation from "./components/RoleNavigation";

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

function App() {
  const currentAccount = useCurrentAccount();
  const { network: activeNetwork } = useSuiClientContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Log the active network in browser console
    console.log("Active Network:", activeNetwork);
  }, [activeNetwork]);

  return (
    <Box style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8faff 0%, #e4f0ff 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Enhanced Navbar with Network Switcher */}
      <Box style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}>
        <Navbar>
        {currentAccount && <RoleNavigation />}
          <NetworkSwitcher />
        </Navbar>
      </Box>

      {/* Main Content */}
      <Box style={{
        paddingTop: "72px", // Match navbar height
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        margin: "0",
        overflow: "hidden"
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;

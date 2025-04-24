import { Box, Flex, Select, Text } from "@radix-ui/themes";
import { useSuiClientContext } from "@mysten/dapp-kit";

export default function NetworkSwitcher() {
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
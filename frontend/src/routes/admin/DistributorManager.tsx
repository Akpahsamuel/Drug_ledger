import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";

export default function DistributorManager() {
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const drugLedgerAdminCapId = useNetworkVariable("drugLedgerAdminCapId");
  const roleRegistryId = useNetworkVariable("roleRegistryId");

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleUseCurrentAccount = () => {
    if (currentAccount) {
      setAddress(currentAccount.address);
    }
  };

  const handleRegisterDistributor = async () => {
    if (!name || !license || !address) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const tx = new Transaction();
      
      // Call the register_distributor function from the distributor module
      tx.moveCall({
        target: `${packageId}::distributor::register_distributor`,
        arguments: [
          tx.object(drugLedgerAdminCapId), // admin cap
          tx.object(roleRegistryId), // role registry
          tx.pure.address(address), // address to register
          tx.pure.string(name), // name
          tx.pure.string(license), // license
          tx.object("0x6"), // clock - Sui system clock object is always 0x6
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            setSuccess(`Successfully registered distributor: ${name}`);
            setName("");
            setLicense("");
            setAddress("");
            setError("");
          },
          onError: (err) => {
            console.error(err);
            setError(`Error registering distributor: ${err.message}`);
          }
        }
      );
    } catch (err: any) {
      setError(`Error creating transaction: ${err.toString()}`);
      console.error(err);
    }
  };

  return (
    <Box>
      <Heading size="4" mb="4">Manage Distributors</Heading>
      
      <Card mb="4">
        <Heading size="3" mb="2">Register New Distributor</Heading>
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="distributor-name">Distributor Name</label>
            <input
              id="distributor-name"
              type="text"
              placeholder="Distributor Name" 
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="distributor-license">License Number</label>
            <input
              id="distributor-license"
              type="text"
              placeholder="License Number" 
              value={license}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicense(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="distributor-address">Distributor Address</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="distributor-address"
                type="text"
                placeholder="Distributor Address" 
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  flexGrow: 1
                }}
              />
              <Button onClick={handleUseCurrentAccount}>
                Use Current Account
              </Button>
            </div>
          </div>
        </Flex>
        
        <Button onClick={handleRegisterDistributor}>Register Distributor</Button>
        
        {error && <Text color="red" mt="2">{error}</Text>}
        {success && <Text color="green" mt="2">{success}</Text>}
        
        <Box mt="4">
          <Button onClick={() => setShowDebugInfo(!showDebugInfo)} variant="outline">
            {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
          </Button>
          
          {showDebugInfo && (
            <Box mt="2" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              <Text size="2">Package ID: {packageId}</Text>
              <Text size="2">Admin Cap ID: {drugLedgerAdminCapId}</Text>
              <Text size="2">Role Registry ID: {roleRegistryId}</Text>
              <Text size="2">Current Account: {currentAccount?.address || "Not connected"}</Text>
            </Box>
          )}
        </Box>
      </Card>
      
      {/* Future enhancement: List and manage existing distributors */}
    </Box>
  );
} 
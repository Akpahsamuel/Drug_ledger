import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

export default function ManufacturerManager() {
  const [manufacturerAddress, setManufacturerAddress] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerLicense, setManufacturerLicense] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [objectsDebugInfo, setObjectsDebugInfo] = useState<Record<string, string>>({});
  
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const packageId = useNetworkVariable("packageId");
  const drugLedgerAdminCapId = useNetworkVariable("drugLedgerAdminCapId");
  const roleRegistryId = useNetworkVariable("roleRegistryId");
  
  // Sui system clock is at 0x6
  const SYSTEM_CLOCK_ID = "0x6";

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Query for existing manufacturer object
  const { data: manufacturerObjData, isLoading: manufacturerLoading, error: manufacturerError } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address || "",
    filter: {
      MatchAll: [
        {
          StructType: `${packageId}::drug_ledger::Manufacturer`
        }
      ]
    },
    options: {
      showContent: true,
      showType: true
    }
  }, {
    enabled: !!currentAccount?.address && !!packageId,
  });

  // Store debug info
  useEffect(() => {
    setObjectsDebugInfo({
      packageId: packageId || 'undefined',
      drugLedgerAdminCapId: drugLedgerAdminCapId || 'undefined',
      roleRegistryId: roleRegistryId || 'undefined',
      walletAddress: currentAccount?.address || 'not connected',
      hasManufacturerObject: manufacturerObjData?.data?.[0] ? 'yes' : 'no',
    });
  }, [packageId, drugLedgerAdminCapId, roleRegistryId, currentAccount, manufacturerObjData]);

  // Handle "Register Yourself" button click
  const handleRegisterSelf = () => {
    if (currentAccount) {
      setManufacturerAddress(currentAccount.address);
      if (!manufacturerName) {
        setManufacturerName("Self Registered Manufacturer");
      }
      if (!manufacturerLicense) {
        setManufacturerLicense("SELF-REG-" + Date.now().toString().substring(0, 6));
      }
    }
  };

  const verifyObjectsExist = async () => {
    // Check all required object IDs are populated
    if (!drugLedgerAdminCapId || !roleRegistryId) {
      return {
        valid: false,
        message: `Missing required object IDs: ${!drugLedgerAdminCapId ? 'drugLedgerAdminCapId ' : ''}${!roleRegistryId ? 'roleRegistryId ' : ''}`
      };
    }

    try {
      // Check that objects exist
      const [adminCapObj, roleRegistryObj] = await Promise.all([
        suiClient.getObject({ id: drugLedgerAdminCapId }),
        suiClient.getObject({ id: roleRegistryId })
      ]);
      
      const invalidObjects = [];
      if (!adminCapObj.data) invalidObjects.push('drugLedgerAdminCap');
      if (!roleRegistryObj.data) invalidObjects.push('roleRegistry');
      
      if (invalidObjects.length > 0) {
        return {
          valid: false,
          message: `The following objects don't exist: ${invalidObjects.join(', ')}`
        };
      }
      
      return { valid: true };
    } catch (err) {
      return {
        valid: false,
        message: `Error verifying objects: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  const handleRegisterManufacturer = async () => {
    if (!manufacturerAddress || !manufacturerName || !manufacturerLicense) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify all objects exist before creating transaction
      const objectsValid = await verifyObjectsExist();
      if (!objectsValid.valid) {
        setError(objectsValid.message || "Invalid objects");
        setIsLoading(false);
        return;
      }

      const tx = new Transaction();
      
      // Call the register_manufacturer function from the smart contract
      tx.moveCall({
        target: `${packageId}::drug_ledger::register_manufacturer`,
        arguments: [
          tx.object(drugLedgerAdminCapId), // admin cap
          tx.object(roleRegistryId), // role registry
          tx.pure.address(manufacturerAddress), // manufacturer address
          tx.pure.string(manufacturerName), // name
          tx.pure.string(manufacturerLicense), // license
          tx.object(SYSTEM_CLOCK_ID), // clock object
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            setSuccess(`Successfully registered manufacturer: ${manufacturerName}`);
            setManufacturerAddress("");
            setManufacturerName("");
            setManufacturerLicense("");
            setError("");
            console.log("Transaction result:", result);
            setIsLoading(false);
          },
          onError: (err: Error) => {
            setError(`Error registering manufacturer: ${err.message}`);
            setIsLoading(false);
          }
        }
      );
    } catch (err: any) {
      setError(`Error creating transaction: ${err}`);
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="4" mb="4">Manage Manufacturers</Heading>
      
      {manufacturerObjData?.data?.[0] && (
        <Card mb="4" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
          <Heading size="3" mb="2">✅ You are registered as a manufacturer</Heading>
          <Text>You can now register drugs in the Manufacturer Dashboard.</Text>
        </Card>
      )}
      
      <Card mb="4">
        <Heading size="3" mb="2">Register New Manufacturer</Heading>
        
        {currentAccount && (
          <Button 
            mb="3" 
            color="amber" 
            onClick={handleRegisterSelf}
          >
            Use Your Own Address
          </Button>
        )}
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="manufacturer-address">Manufacturer Address</label>
            <input
              id="manufacturer-address"
              type="text"
              placeholder="Manufacturer Address" 
              value={manufacturerAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturerAddress(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="manufacturer-name">Manufacturer Name</label>
            <input
              id="manufacturer-name"
              type="text"
              placeholder="Manufacturer Name" 
              value={manufacturerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturerName(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="manufacturer-license">License Number</label>
            <input
              id="manufacturer-license"
              type="text"
              placeholder="License Number" 
              value={manufacturerLicense}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturerLicense(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>
        </Flex>
        
        <Button onClick={handleRegisterManufacturer} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register Manufacturer"}
        </Button>
        
        {error && (
          <Box mt="2" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '8px', borderRadius: '4px' }}>
            <Text color="red">{error}</Text>
          </Box>
        )}
        {success && <Text color="green" mt="2">{success}</Text>}
        
        <Box mt="4" p="3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          <Text size="2" weight="bold">Debug Information:</Text>
          {Object.entries(objectsDebugInfo).map(([key, value]) => (
            <Text key={key} size="1" style={{ fontFamily: 'monospace' }}>
              {key}: {value}
            </Text>
          ))}
        </Box>
      </Card>
    </Box>
  );
} 
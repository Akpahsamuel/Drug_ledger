import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

export default function RegulatorManager() {
  const [regulatorAddress, setRegulatorAddress] = useState("");
  const [regulatorName, setRegulatorName] = useState("");
  const [regulatorJurisdiction, setRegulatorJurisdiction] = useState("");
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

  // Query for existing regulator object
  const { data: regulatorObjData, isLoading: regulatorLoading, error: regulatorError } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address || "",
    filter: {
      MatchAll: [
        {
          StructType: `${packageId}::drug_ledger::Regulator`
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
      hasRegulatorObject: regulatorObjData?.data?.[0] ? 'yes' : 'no',
    });
  }, [packageId, drugLedgerAdminCapId, roleRegistryId, currentAccount, regulatorObjData]);

  // Handle "Register Yourself" button click
  const handleRegisterSelf = () => {
    if (currentAccount) {
      setRegulatorAddress(currentAccount.address);
      if (!regulatorName) {
        setRegulatorName("Self Registered Regulator");
      }
      if (!regulatorJurisdiction) {
        setRegulatorJurisdiction("GLOBAL-" + Date.now().toString().substring(0, 6));
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

  const handleRegisterRegulator = async () => {
    if (!regulatorAddress || !regulatorName || !regulatorJurisdiction) {
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
      
      // Call the register_regulator function from the smart contract
      tx.moveCall({
        target: `${packageId}::regulator::register_regulator`,
        arguments: [
          tx.object(drugLedgerAdminCapId), // admin cap
          tx.object(roleRegistryId), // role registry
          tx.pure.address(regulatorAddress), // regulator address
          tx.pure.string(regulatorName), // name
          tx.pure.string(regulatorJurisdiction), // jurisdiction
          tx.object(SYSTEM_CLOCK_ID), // clock object
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            setSuccess(`Successfully registered regulator: ${regulatorName}`);
            setRegulatorAddress("");
            setRegulatorName("");
            setRegulatorJurisdiction("");
            setError("");
            console.log("Transaction result:", result);
            setIsLoading(false);
          },
          onError: (err: Error) => {
            setError(`Error registering regulator: ${err.message}`);
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
      <Heading size="4" mb="4" style={{ color: "#000" }}>Manage Regulators</Heading>
      
      {regulatorObjData?.data?.[0] && (
        <Card mb="4" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
          <Heading size="3" mb="2" style={{ color: "#000" }}>✅ You are registered as a regulator</Heading>
          <Text style={{ color: "#000" }}>You can now approve and verify drugs in the Regulator Dashboard.</Text>
        </Card>
      )}
      
      <Card mb="4">
        <Heading size="3" mb="2" style={{ color: "#000" }}>Register New Regulator</Heading>
        
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
            <label htmlFor="regulator-address" style={{ color: "#000" }}>Regulator Address</label>
            <input
              id="regulator-address"
              type="text"
              placeholder="Regulator Address" 
              value={regulatorAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegulatorAddress(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="regulator-name" style={{ color: "#000" }}>Regulator Name</label>
            <input
              id="regulator-name"
              type="text"
              placeholder="Regulator Name" 
              value={regulatorName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegulatorName(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="regulator-jurisdiction" style={{ color: "#000" }}>Jurisdiction</label>
            <input
              id="regulator-jurisdiction"
              type="text"
              placeholder="Jurisdiction" 
              value={regulatorJurisdiction}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegulatorJurisdiction(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>
        </Flex>
        
        <Button onClick={handleRegisterRegulator} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register Regulator"}
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
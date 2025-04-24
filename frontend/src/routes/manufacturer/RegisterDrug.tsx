import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

export default function RegisterDrug() {
  const [drugName, setDrugName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturerInfo, setManufacturerInfo] = useState("");
  const [cid, setCid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [objectsDebugInfo, setObjectsDebugInfo] = useState<Record<string, string>>({});

  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const drugCounterId = useNetworkVariable("drugCounterId");
  const manufacturerIndexId = useNetworkVariable("manufacturerIndexId");
  const statusIndexId = useNetworkVariable("statusIndexId");
  
  // Sui system clock is at 0x6
  const SYSTEM_CLOCK_ID = "0x6";

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  // Query for the manufacturer object
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

  // Store debug info to help troubleshoot
  useEffect(() => {
    setObjectsDebugInfo({
      packageId: packageId || 'undefined',
      drugCounterId: drugCounterId || 'undefined',
      manufacturerIndexId: manufacturerIndexId || 'undefined',
      statusIndexId: statusIndexId || 'undefined',
      walletAddress: currentAccount?.address || 'not connected',
      manufacturerObjectFound: manufacturerObjData?.data?.[0] ? 'yes' : 'no',
      manufacturerObjectId: manufacturerObjData?.data?.[0]?.data?.objectId || 'not found'
    });
  }, [packageId, drugCounterId, manufacturerIndexId, statusIndexId, currentAccount, manufacturerObjData]);

  const validateCID = (input: string): boolean => {
    // Simple validation for CID - can be enhanced
    return input.trim().length > 0;
  };

  const verifyObjectsExist = async () => {
    // First check all required object IDs are populated
    if (!drugCounterId || !manufacturerIndexId || !statusIndexId) {
      return {
        valid: false,
        message: `Missing required object IDs: ${!drugCounterId ? 'drugCounterId ' : ''}${!manufacturerIndexId ? 'manufacturerIndexId ' : ''}${!statusIndexId ? 'statusIndexId' : ''}`
      };
    }

    try {
      // Check that objects exist
      const [counterObj, manufacturerIndexObj, statusIndexObj] = await Promise.all([
        client.getObject({ id: drugCounterId }),
        client.getObject({ id: manufacturerIndexId }),
        client.getObject({ id: statusIndexId })
      ]);
      
      const invalidObjects = [];
      if (!counterObj.data) invalidObjects.push('drugCounter');
      if (!manufacturerIndexObj.data) invalidObjects.push('manufacturerIndex');
      if (!statusIndexObj.data) invalidObjects.push('statusIndex');
      
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

  const handleRegisterDrug = async () => {
    if (!validateCID(cid)) {
      setError("Please enter a valid IPFS Content ID (CID)");
      return;
    }

    // Get the manufacturer object for the current account
    const manufacturerObject = manufacturerObjData?.data?.[0];
    
    if (!manufacturerObject || !manufacturerObject.data?.objectId) {
      setError(`No manufacturer object found for your account. Please create one first.
               Since role checks are disabled, you can access the Admin dashboard to register 
               yourself as a manufacturer.`);
      return;
    }

    const manufacturerObjectId = manufacturerObject.data.objectId;

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
      
      // Call the register_drug function from the smart contract
      tx.moveCall({
        target: `${packageId}::drug_ledger::register_drug`,
        arguments: [
          tx.object(manufacturerObjectId), // manufacturer object
          tx.object(drugCounterId), // drug counter
          tx.object(manufacturerIndexId), // manufacturer index
          tx.object(statusIndexId), // status index
          tx.pure.string(cid), // IPFS CID
          tx.object(SYSTEM_CLOCK_ID), // clock object
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            setSuccess(`Successfully registered drug with CID: ${cid}`);
            setCid("");
            setError("");
            console.log("Transaction result:", result);
            setIsLoading(false);
          },
          onError: (err: Error) => {
            setError(`Error registering drug: ${err.message}`);
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
      <Heading size="4" mb="4" style={{ color: "#000" }}>Register New Drug</Heading>
      
      {manufacturerError && (
        <Card mb="4" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
          <Text color="red">Error querying manufacturer object: {manufacturerError.toString()}</Text>
        </Card>
      )}
      
      <Card mb="4">
        <Heading size="3" mb="2" style={{ color: "#000" }}>Drug Information</Heading>
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="drug-name" style={{ color: "#000" }}>Drug Name</label>
            <input
              id="drug-name"
              type="text"
              placeholder="Drug Name" 
              value={drugName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrugName(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="drug-description" style={{ color: "#000" }}>Description</label>
            <input
              id="drug-description"
              type="text"
              placeholder="Drug Description" 
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="manufacturer-info" style={{ color: "#000" }}>Manufacturer Info</label>
            <input
              id="manufacturer-info"
              type="text"
              placeholder="Manufacturer Information" 
              value={manufacturerInfo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturerInfo(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="drug-cid" style={{ color: "#000" }}>Composition IPFS CID</label>
            <input
              id="drug-cid"
              type="text"
              placeholder="IPFS Content ID (CID)" 
              value={cid}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCid(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>

          <Text size="2" color="gray" style={{ color: "#000" }}>
            Upload your drug metadata to IPFS first and provide the CID here.
            The CID should point to a JSON file with all required drug information.
          </Text>
        </Flex>
        
        <Button onClick={handleRegisterDrug} disabled={isLoading || manufacturerLoading}>
          {isLoading ? "Registering..." : manufacturerLoading ? "Loading..." : "Register Drug"}
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
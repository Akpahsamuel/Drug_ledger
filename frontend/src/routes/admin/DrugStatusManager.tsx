import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

export default function DrugStatusManager() {
  const [drugId, setDrugId] = useState("");
  const [drugObjectId, setDrugObjectId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("1"); // Default to active
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const packageId = useNetworkVariable("packageId");
  const statusIndexId = useNetworkVariable("statusIndexId");
  const roleRegistryId = useNetworkVariable("roleRegistryId");
  
  // Sui system clock is at 0x6
  const SYSTEM_CLOCK_ID = "0x6";

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleUpdateStatus = async () => {
    if (!drugObjectId) {
      setError("Please enter a drug object ID");
      return;
    }

    try {
      const tx = new Transaction();
      
      // Call the update_drug_status function from the smart contract
      tx.moveCall({
        target: `${packageId}::drug_ledger::update_drug_status`,
        arguments: [
          tx.object(drugObjectId), // drug object
          tx.object(statusIndexId), // status index
          tx.pure.u8(parseInt(selectedStatus)), // new status
          tx.object(roleRegistryId), // role registry
          tx.object(SYSTEM_CLOCK_ID), // clock object
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setSuccess(`Successfully updated drug status to ${getStatusLabel(parseInt(selectedStatus))}`);
            setDrugObjectId("");
            setError("");
          },
          onError: (err: Error) => {
            setError(`Error updating status: ${err.message}`);
          }
        }
      );
    } catch (err: any) {
      setError(`Error creating transaction: ${err}`);
    }
  };

  const getStatusLabel = (statusCode: number): string => {
    switch(statusCode) {
      case 0: return "Draft";
      case 1: return "Active";
      case 2: return "Recalled";
      case 3: return "Expired";
      default: return "Unknown";
    }
  };

  return (
    <Box>
      <Heading size="4" mb="4">Manage Drug Statuses</Heading>
      
      <Card mb="4">
        <Heading size="3" mb="2">Update Drug Status</Heading>
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="drug-object-id">Drug Object ID</label>
            <input
              id="drug-object-id"
              type="text"
              placeholder="Drug Object ID (0x...)" 
              value={drugObjectId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrugObjectId(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <Select.Root value={selectedStatus} onValueChange={setSelectedStatus}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="0">Draft</Select.Item>
              <Select.Item value="1">Active</Select.Item>
              <Select.Item value="2">Recalled</Select.Item>
              <Select.Item value="3">Expired</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
        
        <Button onClick={handleUpdateStatus}>Update Status</Button>
        
        {error && <Text color="red" mt="2">{error}</Text>}
        {success && <Text color="green" mt="2">{success}</Text>}
      </Card>
      
      {/* Future enhancement: List and search drugs by status */}
    </Box>
  );
} 
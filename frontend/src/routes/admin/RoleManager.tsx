import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

// Role constants from smart contract
const ROLE_ADMIN = 0;
const ROLE_MANUFACTURER = 1;
const ROLE_REGULATOR = 2;
const ROLE_DISTRIBUTOR = 3;

export default function RoleManager() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State for revoke role functionality
  const [revokeAddress, setRevokeAddress] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  
  // State for transfer admin functionality
  const [newAdminAddress, setNewAdminAddress] = useState("");

  const packageId = useNetworkVariable("packageId");
  const drugLedgerAdminCapId = useNetworkVariable("drugLedgerAdminCapId");
  const roleRegistryId = useNetworkVariable("roleRegistryId");

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  // Function for revoking roles
  const handleRevokeRole = async () => {
    if (!revokeAddress) {
      setError("Please enter an address");
      return;
    }
    
    if (!revokeReason) {
      setError("Please enter a reason for revocation");
      return;
    }

    try {
      const tx = new Transaction();
      
      // Call the revoke_role function from the smart contract
      tx.moveCall({
        target: `${packageId}::drug_ledger::revoke_role`,
        arguments: [
          tx.object(drugLedgerAdminCapId), // admin cap
          tx.object(roleRegistryId), // role registry
          tx.pure.address(revokeAddress), // address to revoke
          tx.pure.string(revokeReason), // reason for revocation (already used as string in other components)
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setSuccess(`Successfully revoked role from ${revokeAddress}`);
            setRevokeAddress("");
            setRevokeReason("");
            setError("");
          },
          onError: (err: Error) => {
            setError(`Error revoking role: ${err.message}`);
          }
        }
      );
    } catch (err: any) {
      setError(`Error creating transaction: ${err}`);
    }
  };
  
  // Function for transferring admin access
  const handleTransferAdmin = async () => {
    if (!newAdminAddress) {
      setError("Please enter the new admin address");
      return;
    }

    try {
      const tx = new Transaction();
      
      // Call the transfer_admin function from the smart contract
      tx.moveCall({
        target: `${packageId}::drug_ledger::transfer_admin`,
        arguments: [
          tx.object(drugLedgerAdminCapId), // admin cap
          tx.object(roleRegistryId), // role registry
          tx.pure.address(newAdminAddress), // new admin address
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setSuccess(`Successfully transferred admin access to ${newAdminAddress}`);
            setNewAdminAddress("");
            setError("");
          },
          onError: (err: Error) => {
            setError(`Error transferring admin access: ${err.message}`);
          }
        }
      );
    } catch (err: any) {
      setError(`Error creating transaction: ${err}`);
    }
  };

  return (
    <Box>
      <Heading size="4" mb="4" style={{ color: "#000" }}>Manage Roles</Heading>
      
      {/* Card for revoking roles */}
      <Card mb="4">
        <Heading size="3" mb="2" style={{ color: "#000" }}>Revoke Role</Heading>
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="revoke-address" style={{ color: "#000" }}>User Address</label>
            <input
              id="revoke-address"
              type="text"
              placeholder="User Address" 
              value={revokeAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevokeAddress(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="revoke-reason" style={{ color: "#000" }}>Reason for Revocation</label>
            <input
              id="revoke-reason"
              type="text"
              placeholder="Reason for revocation" 
              value={revokeReason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevokeReason(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>
        </Flex>
        
        <Button color="red" onClick={handleRevokeRole}>Revoke Role</Button>
      </Card>
      
      {/* Card for transferring admin access */}
      <Card mb="4">
        <Heading size="3" mb="2" style={{ color: "#000" }}>Transfer Admin Access</Heading>
        <Text size="2" color="gray" mb="3" style={{ color: "#000" }}>Warning: This will transfer administrative rights to another address.</Text>
        
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="new-admin-address" style={{ color: "#000" }}>New Admin Address</label>
            <input
              id="new-admin-address"
              type="text"
              placeholder="New Admin Address" 
              value={newAdminAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdminAddress(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff" }}
            />
          </div>
        </Flex>
        
        <Button color="orange" onClick={handleTransferAdmin}>Transfer Admin Access</Button>
      </Card>
      
      {error && <Text color="red" mt="2">{error}</Text>}
      {success && <Text color="green" mt="2">{success}</Text>}
    </Box>
  );
} 
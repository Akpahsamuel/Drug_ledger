import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { DEVNET_MANUFACTURER_INDEX_ID } from "../../constants";

interface Drug {
  id: string;
  drugId: string;
  cid: string;
  status: number;
}

export default function ManageDrugs() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true);
        // This is a placeholder for the actual implementation to fetch drugs
        // You would need to query the manufacturer index to get the drugs for this manufacturer
        
        // Example implementation:
        // 1. Get drug IDs from manufacturer index
        // 2. Fetch each drug by ID
        
        // Simulated data for the UI
        const mockDrugs = [
          { id: "0x123", drugId: "1", cid: "QmX...", status: 0 },
          { id: "0x456", drugId: "2", cid: "QmY...", status: 1 },
        ];
        
        setDrugs(mockDrugs);
      } catch (err) {
        console.error("Error fetching drugs:", err);
        setError("Failed to load drugs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentAccount) {
      fetchDrugs();
    }
  }, [currentAccount, suiClient]);

  const getStatusLabel = (status: number): string => {
    switch(status) {
      case 0: return "Draft";
      case 1: return "Active";
      case 2: return "Recalled";
      case 3: return "Expired";
      default: return "Unknown";
    }
  };

  const getStatusColor = (status: number) => {
    switch(status) {
      case 0: return "gray" as const;
      case 1: return "green" as const;
      case 2: return "red" as const;
      case 3: return "amber" as const;
      default: return "gray" as const;
    }
  };

  if (!currentAccount) {
    return (
      <Box>
        <Text>Please connect your wallet to view your drugs.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="4" mb="4">Manage Your Drugs</Heading>
      
      {loading ? (
        <Text>Loading your drugs...</Text>
      ) : error ? (
        <Text color="red">
          {error}
        </Text>
      ) : drugs.length === 0 ? (
        <Card>
          <Text>You have not registered any drugs yet.</Text>
        </Card>
      ) : (
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Drug ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {drugs.map((drug) => (
                <Table.Row key={drug.id}>
                  <Table.Cell>{drug.drugId}</Table.Cell>
                  <Table.Cell>
                    <Text size="2" style={{ wordBreak: "break-all" }}>
                      {drug.cid}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color={getStatusColor(drug.status)}>
                      {getStatusLabel(drug.status)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button size="1" variant="soft">View</Button>
                      {drug.status === 0 && (
                        <Button size="1" variant="soft" color="green">Activate</Button>
                      )}
                      {drug.status === 1 && (
                        <Button size="1" variant="soft" color="red">Recall</Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      )}
    </Box>
  );
} 
import { Box, Button, Container, Dialog, Flex, Heading, Separator, Table, Text, Tabs } from "@radix-ui/themes";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import RoleCheckDisabledBanner from "../../components/RoleCheckDisabledBanner";
import { useState, useEffect } from "react";
import { useNetworkVariable } from "../../config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

// Define a shipment type
interface Shipment {
  id: string;
  shipmentId: string;
  drugId: string;
  destination: string;
  quantity: string;
  status: string;
  createdAt: string;
  tracking: string;
  notes?: string;
}

// Define a shipment event type
interface ShipmentEvent {
  timestamp: string;
  status: string;
  notes: string;
}

// Function to format timestamps
const formatDate = (timestamp: string) => {
  return new Date(parseInt(timestamp)).toLocaleString();
};

// Function to get status text
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "Pending",
    "1": "In Transit",
    "2": "Delivered",
    "3": "Rejected"
  };
  return statusMap[status] || "Unknown";
};

export default function DistributorDashboard() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  
  const [destination, setDestination] = useState("");
  const [drugId, setDrugId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [shipmentId, setShipmentId] = useState("");
  const [newStatus, setNewStatus] = useState("1"); // Default to IN_TRANSIT
  const [statusNotes, setStatusNotes] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Shipments state
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [distributorObject, setDistributorObject] = useState<string | null>(null);
  
  // Selected shipment for details modal
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [shipmentEvents, setShipmentEvents] = useState<ShipmentEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch shipments on component mount
  useEffect(() => {
    if (currentAccount) {
      fetchDistributorObject();
    }
  }, [currentAccount]);

  // Function to fetch the distributor object for the current account
  const fetchDistributorObject = async () => {
    if (!currentAccount) return;
    
    try {
      setLoadingShipments(true);
      
      // In a real implementation, you would query for the distributor object
      // For example:
      // const response = await suiClient.getOwnedObjects({
      //   owner: currentAccount.address,
      //   filter: {
      //     StructType: `${packageId}::distributor::Distributor`
      //   },
      //   options: {
      //     showContent: true
      //   }
      // });
      
      // const distributorObj = response.data[0]?.objectId;
      const distributorObj = "0xSampleDistributorObjectId";
      
      // Set the distributor object and fetch shipments
      setDistributorObject(distributorObj);
      fetchShipments(distributorObj);
      
    } catch (error) {
      console.error("Error fetching distributor object:", error);
      setLoadingShipments(false);
    }
  };

  // Function to fetch shipments
  const fetchShipments = async (distributorObjId?: string) => {
    if (!currentAccount) return;
    
    try {
      setLoadingShipments(true);
      
      const distId = distributorObjId || distributorObject;
      if (!distId) {
        console.warn("No distributor object found");
        setLoadingShipments(false);
        return;
      }
      
      // In a real implementation, you would:
      // 1. Query for shared objects of type Shipment where origin = current account's address
      // 2. Parse the shipment data from objects
      // For example:
      // const response = await suiClient.queryObjects({
      //   query: {
      //     Struct: {
      //       type: `${packageId}::distributor::Shipment`,
      //       field: {
      //         path: "origin",
      //         value: currentAccount.address
      //       }
      //     }
      //   },
      //   options: {
      //     showContent: true
      //   }
      // });
      
      // For now, we'll use sample data
      setTimeout(() => {
        const sampleShipments: Shipment[] = [
          {
            id: "0x123",
            shipmentId: "1",
            drugId: "42",
            destination: "0x456789abcdef0123456789abcdef0123456789ab",
            quantity: "100",
            status: "1",
            createdAt: Date.now().toString(),
            tracking: "TRK12345",
            notes: "Fragile cargo, handle with care"
          },
          {
            id: "0x124",
            shipmentId: "2",
            drugId: "43",
            destination: "0x789abcdef0123456789abcdef0123456789abcdef",
            quantity: "50",
            status: "2",
            createdAt: (Date.now() - 86400000).toString(), // 1 day ago
            tracking: "TRK67890",
            notes: "Delivered on time and accepted"
          },
          {
            id: "0x125",
            shipmentId: "3",
            drugId: "44",
            destination: "0xabcdef0123456789abcdef0123456789abcdef01",
            quantity: "75",
            status: "3",
            createdAt: (Date.now() - 172800000).toString(), // 2 days ago
            tracking: "TRK24680",
            notes: "Package damaged during transit, rejected by recipient"
          },
          {
            id: "0x126",
            shipmentId: "4",
            drugId: "45",
            destination: "0xcdef0123456789abcdef0123456789abcdef0123",
            quantity: "200",
            status: "0",
            createdAt: (Date.now() - 3600000).toString(), // 1 hour ago
            tracking: "TRK13579",
            notes: "Awaiting pickup"
          }
        ];
        
        setShipments(sampleShipments);
        setLoadingShipments(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching shipments:", error);
      setLoadingShipments(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!currentAccount) return;
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!destination || !drugId || !quantity || !trackingNumber) {
        alert("Please fill all required fields");
        return;
      }
      
      if (!distributorObject) {
        alert("Distributor object not found. You might need to register as a distributor first.");
        return;
      }
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the create_shipment function from the distributor module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::distributor::create_shipment`,
      //   arguments: [
      //     tx.object(distributorObject), // distributor object
      //     tx.object(drugId), // drug object
      //     tx.object("0x..."), // shipment counter object
      //     tx.pure.address(destination), // destination address
      //     tx.pure.u64(parseInt(quantity)), // quantity
      //     tx.pure.string(trackingNumber), // tracking number
      //     tx.pure.string(notes || ""), // notes
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      alert("Shipment will be implemented in a future update");
      
      // Reset form
      setDestination("");
      setDrugId("");
      setQuantity("");
      setTrackingNumber("");
      setNotes("");
      
      // Refresh the shipments list
      fetchShipments();
    } catch (error) {
      console.error(error);
      alert("Error creating shipment");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateShipmentStatus = async () => {
    if (!currentAccount) return;
    
    try {
      setUpdateLoading(true);
      
      // Validate inputs
      if (!shipmentId || !newStatus) {
        alert("Please fill all required fields");
        return;
      }
      
      if (!distributorObject) {
        alert("Distributor object not found. You might need to register as a distributor first.");
        return;
      }
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the update_shipment_status function from the distributor module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::distributor::update_shipment_status`,
      //   arguments: [
      //     tx.object(distributorObject), // distributor object
      //     tx.object(shipmentId), // shipment object
      //     tx.pure.u8(parseInt(newStatus)), // new status
      //     tx.pure.string(statusNotes || ""), // notes
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      alert("Status update will be implemented in a future update");
      
      // Reset form
      setShipmentId("");
      setNewStatus("1");
      setStatusNotes("");
      
      // Refresh the shipments list
      fetchShipments();
    } catch (error) {
      console.error(error);
      alert("Error updating shipment status");
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Function to fetch shipment events/history
  const fetchShipmentEvents = async (shipmentId: string) => {
    try {
      setLoadingEvents(true);
      
      // In a real implementation, you would:
      // 1. Query the blockchain for events associated with this shipment
      // 2. Parse the event data and format it
      
      // For now, we'll use sample data based on the shipment status
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment) {
        setShipmentEvents([]);
        setLoadingEvents(false);
        return;
      }
      
      setTimeout(() => {
        const createdDate = new Date(parseInt(shipment.createdAt));
        
        // Start with creation event
        const events: ShipmentEvent[] = [
          {
            timestamp: shipment.createdAt,
            status: "0",
            notes: "Shipment created and pending pickup"
          }
        ];
        
        // Add events based on current status
        if (["1", "2", "3"].includes(shipment.status)) {
          // Add transit event if shipped or beyond
          const transitDate = new Date(createdDate.getTime() + 3600000); // 1 hour after creation
          events.push({
            timestamp: transitDate.getTime().toString(),
            status: "1",
            notes: "Shipment picked up and in transit"
          });
        }
        
        if (["2", "3"].includes(shipment.status)) {
          // Add arrival event if delivered or rejected
          const arrivalDate = new Date(createdDate.getTime() + 86400000); // 1 day after creation
          events.push({
            timestamp: arrivalDate.getTime().toString(),
            status: shipment.status,
            notes: shipment.status === "2" 
              ? "Shipment delivered and accepted by recipient" 
              : "Shipment rejected by recipient due to " + (shipment.notes || "unspecified reason")
          });
        }
        
        // Sort events by timestamp (newest first)
        events.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
        
        setShipmentEvents(events);
        setLoadingEvents(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching shipment events:", error);
      setLoadingEvents(false);
    }
  };
  
  const handleShipmentRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    fetchShipmentEvents(shipment.id);
  };

  if (!currentAccount) {
    return (
      <Container size="3">
        <Box py="6" style={{color: "#000"}}>
          <Heading size="6" mb="4">Distributor Dashboard</Heading>
          <Text size="3">Please connect your wallet to access the distributor dashboard.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="3">
      <Box py="6" style={{color: "#000"}}>
        <Heading size="6" mb="4">Distributor Dashboard</Heading>
        
        <RoleCheckDisabledBanner />
        
        <Text size="3" mb="4">
          Connected as: {currentAccount.address}
          {distributorObject ? 
            <Text as="span" color="green"> (Distributor object found)</Text> : 
            <Text as="span" color="red"> (No distributor object found - please register in Admin Dashboard)</Text>
          }
        </Text>
        
        <Separator my="4" size="4" />
        
        <Heading size="5" mb="3">Create New Shipment</Heading>
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="destination">Destination Address</label>
            <input
              id="destination"
              type="text"
              placeholder="Destination Address" 
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="drug-id">Drug ID</label>
            <input
              id="drug-id"
              type="text"
              placeholder="Drug ID" 
              value={drugId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDrugId(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              placeholder="Quantity" 
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="tracking">Tracking Number</label>
            <input
              id="tracking"
              type="text"
              placeholder="Tracking Number" 
              value={trackingNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrackingNumber(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="notes">Notes (Optional)</label>
            <input
              id="notes"
              type="text"
              placeholder="Notes" 
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <Button onClick={handleCreateShipment} disabled={loading || !distributorObject}>
            {loading ? "Creating..." : "Create Shipment"}
          </Button>
          {!distributorObject && (
            <Text size="2" color="red">
              You need to register as a distributor in the Admin Dashboard before creating shipments.
            </Text>
          )}
        </Flex>
        
        <Separator my="4" size="4" />
        
        <Heading size="5" mb="3">Update Shipment Status</Heading>
        <Flex direction="column" gap="3" mb="4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="shipment-id">Shipment ID</label>
            <input
              id="shipment-id"
              type="text"
              placeholder="Shipment ID" 
              value={shipmentId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipmentId(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              value={newStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc',color: "#000", backgroundColor: "#fff"  }}
            >
              <option value="1">In Transit</option>
              <option value="2">Delivered</option>
              <option value="3">Rejected</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="status-notes">Status Notes (Optional)</label>
            <input
              id="status-notes"
              type="text"
              placeholder="Status Notes" 
              value={statusNotes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatusNotes(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', color: "#000", backgroundColor: "#fff"  }}
            />
          </div>
          
          <Button onClick={handleUpdateShipmentStatus} disabled={updateLoading || !distributorObject}>
            {updateLoading ? "Updating..." : "Update Status"}
          </Button>
          {!distributorObject && (
            <Text size="2" color="red">
              You need to register as a distributor in the Admin Dashboard before updating shipments.
            </Text>
          )}
        </Flex>
        
        <Separator my="4" size="4" />
        
        <Heading size="5" mb="3">My Shipments</Heading>
        <Box mb="2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="3">{loadingShipments ? "Loading shipments..." : `${shipments.length} shipments found`}</Text>
          <Button variant="outline" onClick={() => fetchShipments()} disabled={loadingShipments}>
            {loadingShipments ? "Refreshing..." : "Refresh"}
          </Button>
        </Box>
        <Text size="2" mb="2" color="gray">Click on a row to view shipment details</Text>
        <Table.Root>
          <Table.Header>
            <Table.Row style={{color: "#000"}}>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Drug ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Destination</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tracking</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body style={{color: "#000"}}>
            {shipments.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7} style={{ textAlign: 'center' }}>
                  {loadingShipments ? "Loading shipments..." : "No shipments found"}
                </Table.Cell>
              </Table.Row>
            ) : (
              shipments.map((shipment) => (
                <Table.Row key={shipment.id} onClick={() => handleShipmentRowClick(shipment)} style={{ cursor: 'pointer' }}>
                  <Table.Cell style={{color: "#000"}}>{shipment.shipmentId}</Table.Cell>
                  <Table.Cell style={{color: "#000"}}>{shipment.drugId}</Table.Cell>
                  <Table.Cell title={shipment.destination} style={{color: "#000"}}>
                    {shipment.destination.substring(0, 8)}...
                  </Table.Cell>
                  <Table.Cell style={{color: "#000"}}>{shipment.quantity}</Table.Cell>
                  <Table.Cell style={{color: "#000"}}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      backgroundColor: shipment.status === '2' ? '#d1fae5' : 
                                      shipment.status === '3' ? '#fee2e2' : 
                                      shipment.status === '1' ? '#e0f2fe' : '#f3f4f6',
                      color: shipment.status === '2' ? '#065f46' : 
                             shipment.status === '3' ? '#7f1d1d' : 
                             shipment.status === '1' ? '#0c4a6e' : '#4b5563',
                    }}>
                      {getStatusText(shipment.status)}
                    </span>
                  </Table.Cell>
                  <Table.Cell style={{color: "#000"}}>{formatDate(shipment.createdAt)}</Table.Cell>
                  <Table.Cell style={{color: "#000"}}>{shipment.tracking}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
        
        {/* Shipment Details Modal */}
        <Dialog.Root open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
          <Dialog.Content style={{ maxWidth: '600px', color: "#000", backgroundColor: "#fff"  }}>
            <Dialog.Title>Shipment Details</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Detailed information about the selected shipment.
            </Dialog.Description>
            
            {selectedShipment && (
              <Box>
                <Tabs.Root defaultValue="details">
                  <Tabs.List>
                    <Tabs.Trigger value="details">Details</Tabs.Trigger>
                    <Tabs.Trigger value="history">History</Tabs.Trigger>
                  </Tabs.List>
                  
                  <Tabs.Content value="details">
                    <Box pt="3">
                      <Flex direction="column" gap="2">
                        <Flex justify="between">
                          <Text weight="bold">Shipment ID:</Text>
                          <Text>{selectedShipment.shipmentId}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Object ID:</Text>
                          <Text>{selectedShipment.id}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Drug ID:</Text>
                          <Text>{selectedShipment.drugId}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Destination:</Text>
                          <Text style={{ wordBreak: 'break-all' }}>{selectedShipment.destination}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Quantity:</Text>
                          <Text>{selectedShipment.quantity}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Status:</Text>
                          <Text>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: selectedShipment.status === '2' ? '#d1fae5' : 
                                              selectedShipment.status === '3' ? '#fee2e2' : 
                                              selectedShipment.status === '1' ? '#e0f2fe' : '#f3f4f6',
                              color: selectedShipment.status === '2' ? '#065f46' : 
                                    selectedShipment.status === '3' ? '#7f1d1d' : 
                                    selectedShipment.status === '1' ? '#0c4a6e' : '#4b5563',
                            }}>
                              {getStatusText(selectedShipment.status)}
                            </span>
                          </Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Created At:</Text>
                          <Text>{formatDate(selectedShipment.createdAt)}</Text>
                        </Flex>
                        <Flex justify="between">
                          <Text weight="bold">Tracking Number:</Text>
                          <Text>{selectedShipment.tracking}</Text>
                        </Flex>
                        {selectedShipment.notes && (
                          <Flex direction="column" gap="1">
                            <Text weight="bold">Notes:</Text>
                            <Text style={{ 
                              padding: '8px', 
                              background: '#f5f5f5', 
                              borderRadius: '4px',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {selectedShipment.notes}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Box>
                  </Tabs.Content>
                  
                  <Tabs.Content value="history">
                    <Box pt="3">
                      <Text size="2" mb="2">Tracking history for this shipment:</Text>
                      
                      {loadingEvents ? (
                        <Text size="2">Loading shipment history...</Text>
                      ) : shipmentEvents.length === 0 ? (
                        <Text size="2">No history found for this shipment.</Text>
                      ) : (
                        <Box style={{ 
                          border: '1px solid #eaeaea', 
                          borderRadius: '6px', 
                          overflow: 'hidden'
                        }}>
                          {shipmentEvents.map((event, index) => (
                            <Box key={index} style={{ 
                              padding: '12px 16px',
                              borderBottom: index < shipmentEvents.length - 1 ? '1px solid #eaeaea' : 'none',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <Flex justify="between" align="center">
                                <Text weight="bold">
                                  <span style={{ 
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    marginRight: '8px',
                                    backgroundColor: event.status === '2' ? '#10b981' : 
                                                    event.status === '3' ? '#ef4444' : 
                                                    event.status === '1' ? '#3b82f6' : '#9ca3af',
                                  }}></span>
                                  {getStatusText(event.status)}
                                </Text>
                                <Text size="2" color="gray">{formatDate(event.timestamp)}</Text>
                              </Flex>
                              <Text size="2">{event.notes}</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      <Box mt="3">
                        <Text size="2" color="gray">
                          * In a production implementation, this would show actual blockchain events.
                        </Text>
                      </Box>
                    </Box>
                  </Tabs.Content>
                </Tabs.Root>
                
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">Close</Button>
                  </Dialog.Close>
                  <Button onClick={() => {
                    setShipmentId(selectedShipment.id);
                    setSelectedShipment(null);
                  }}>
                    Update Status
                  </Button>
                </Flex>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Root>
        
        {/* Future enhancement: Add pagination for shipments */}
        {shipments.length > 0 && (
          <Box mt="2">
            <Text size="2" color="gray">
              * In a production implementation, this table would show actual shipments from the blockchain.
            </Text>
          </Box>
        )}
      </Box>
    </Container>
  );
} 
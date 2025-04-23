import { Box, Button, Card, Container, Dialog, Flex, Heading, Select, Separator, Table, Tabs, Text, TextField } from "@radix-ui/themes";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import RoleCheckDisabledBanner from "../../components/RoleCheckDisabledBanner";
import { useState, useEffect } from "react";
import { useNetworkVariable } from "../../config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

// Define drug type for the dashboard
interface Drug {
  id: string;
  drugId: string;
  cid: string;
  manufacturer: string;
  createdAt: string;
  status: string;
  verified: boolean;
}

// Function to format timestamps
const formatDate = (timestamp: string) => {
  return new Date(parseInt(timestamp)).toLocaleString();
};

// Function to get status text
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    "0": "Draft",
    "1": "Active",
    "2": "Recalled",
    "3": "Expired"
  };
  return statusMap[status] || "Unknown";
};

// Function to get status color
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "0": "#f3f4f6", // gray
    "1": "#d1fae5", // green
    "2": "#fee2e2", // red
    "3": "#fef3c7" // amber
  };
  return colorMap[status] || "#f3f4f6";
};

// Function to get text color based on status
const getStatusTextColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "0": "#4b5563", // gray
    "1": "#065f46", // green
    "2": "#7f1d1d", // red
    "3": "#78350f" // amber
  };
  return colorMap[status] || "#4b5563";
};

export default function RegulatorDashboard() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  
  const [activeTab, setActiveTab] = useState<string>("pending");
  
  // Drug lists
  const [pendingDrugs, setPendingDrugs] = useState<Drug[]>([]);
  const [activeDrugs, setActiveDrugs] = useState<Drug[]>([]);
  const [recalledDrugs, setRecalledDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  
  // Form states
  const [approvalNotes, setApprovalNotes] = useState("");
  const [recallReason, setRecallReason] = useState("");
  const [recallSeverity, setRecallSeverity] = useState("3");
  const [reportType, setReportType] = useState("compliance");
  const [reportContent, setReportContent] = useState("");
  const [oversightLevel, setOversightLevel] = useState("2");
  const [verificationFrequency, setVerificationFrequency] = useState("90");
  const [oversightNotes, setOversightNotes] = useState("");
  
  // Action states
  const [isApproving, setIsApproving] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isSettingOversight, setIsSettingOversight] = useState(false);
  
  // Regulator object
  const [regulatorObject, setRegulatorObject] = useState<string | null>(null);
  const [regulatorInfo, setRegulatorInfo] = useState<{ name: string, jurisdiction: string } | null>(null);
  
  // Error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch regulator object and drugs on component mount
  useEffect(() => {
    if (currentAccount) {
      fetchRegulatorObject();
    }
  }, [currentAccount]);

  // Function to fetch the regulator object for the current account
  const fetchRegulatorObject = async () => {
    if (!currentAccount) return;
    
    try {
      setLoadingDrugs(true);
      setError("");
      
      // In a real implementation, you would query for the regulator object
      // For example:
      // const response = await suiClient.getOwnedObjects({
      //   owner: currentAccount.address,
      //   filter: {
      //     StructType: `${packageId}::regulator::Regulator`
      //   },
      //   options: {
      //     showContent: true
      //   }
      // });
      
      // const regulatorObj = response.data[0]?.objectId;
      const regulatorObj = "0xSampleRegulatorObjectId";
      
      // Set the regulator object and mock info
      setRegulatorObject(regulatorObj);
      setRegulatorInfo({
        name: "Global Health Regulator",
        jurisdiction: "International"
      });
      
      // Fetch drugs for each category
      fetchDrugs();
      
    } catch (error) {
      console.error("Error fetching regulator object:", error);
      setError("Failed to load regulator information. Please try again.");
      setLoadingDrugs(false);
    }
  };

  // Function to fetch drugs for the regulator dashboard
  const fetchDrugs = async () => {
    if (!currentAccount) return;
    
    try {
      setLoadingDrugs(true);
      
      // In a real implementation, you would:
      // 1. Query for the status index object
      // 2. Call the get_regulatory_dashboard function
      // 3. Use the returned drug IDs to fetch drug objects
      
      // For now, we'll use sample data
      setTimeout(() => {
        // Sample pending (draft) drugs
        const mockPendingDrugs: Drug[] = [
          {
            id: "0x123",
            drugId: "1",
            cid: "QmX1AbCdEf2GhIjK3LmNoPqRsT4UvWxYz5AbCdEfGhIjK",
            manufacturer: "0xabcd...1234",
            createdAt: Date.now().toString(),
            status: "0", // Draft
            verified: true
          },
          {
            id: "0x456",
            drugId: "2",
            cid: "QmY2AbCdEf2GhIjK3LmNoPqRsT4UvWxYz5AbCdEfGhIjK",
            manufacturer: "0xefgh...5678",
            createdAt: (Date.now() - 86400000).toString(), // 1 day ago
            status: "0", // Draft
            verified: false
          }
        ];
        
        // Sample active drugs
        const mockActiveDrugs: Drug[] = [
          {
            id: "0x789",
            drugId: "3",
            cid: "QmZ3AbCdEf2GhIjK3LmNoPqRsT4UvWxYz5AbCdEfGhIjK",
            manufacturer: "0xabcd...1234",
            createdAt: (Date.now() - 172800000).toString(), // 2 days ago
            status: "1", // Active
            verified: true
          },
          {
            id: "0xabc",
            drugId: "4",
            cid: "QmA4AbCdEf2GhIjK3LmNoPqRsT4UvWxYz5AbCdEfGhIjK",
            manufacturer: "0xijkl...9012",
            createdAt: (Date.now() - 259200000).toString(), // 3 days ago
            status: "1", // Active
            verified: true
          }
        ];
        
        // Sample recalled drugs
        const mockRecalledDrugs: Drug[] = [
          {
            id: "0xdef",
            drugId: "5",
            cid: "QmB5AbCdEf2GhIjK3LmNoPqRsT4UvWxYz5AbCdEfGhIjK",
            manufacturer: "0xabcd...1234",
            createdAt: (Date.now() - 345600000).toString(), // 4 days ago
            status: "2", // Recalled
            verified: true
          }
        ];
        
        setPendingDrugs(mockPendingDrugs);
        setActiveDrugs(mockActiveDrugs);
        setRecalledDrugs(mockRecalledDrugs);
        setLoadingDrugs(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching drugs:", error);
      setError("Failed to load drugs. Please try again.");
      setLoadingDrugs(false);
    }
  };

  // Handler for approving a drug
  const handleApproveDrug = async () => {
    if (!currentAccount || !selectedDrug || !regulatorObject) return;
    
    try {
      setIsApproving(true);
      setError("");
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the approve_drug function from the regulator module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::regulator::approve_drug`,
      //   arguments: [
      //     tx.object(regulatorObject), // regulator object
      //     tx.object(selectedDrug.id), // drug object
      //     tx.object("0x..."), // status index object
      //     tx.pure.string(approvalNotes), // notes
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      // For the mock version, we'll just update our local state
      setTimeout(() => {
        const updatedPendingDrugs = pendingDrugs.filter(d => d.id !== selectedDrug.id);
        const updatedDrug = {...selectedDrug, status: "1"};
        const updatedActiveDrugs = [...activeDrugs, updatedDrug];
        
        setPendingDrugs(updatedPendingDrugs);
        setActiveDrugs(updatedActiveDrugs);
        
        setSuccess(`Drug ${selectedDrug.drugId} has been approved.`);
        setSelectedDrug(null);
        setApprovalNotes("");
        setIsApproving(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error approving drug:", error);
      setError("Failed to approve drug. Please try again.");
      setIsApproving(false);
    }
  };

  // Handler for recalling a drug
  const handleRecallDrug = async () => {
    if (!currentAccount || !selectedDrug || !regulatorObject) return;
    
    try {
      setIsRecalling(true);
      setError("");
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the recall_drug function from the regulator module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::regulator::recall_drug`,
      //   arguments: [
      //     tx.object(regulatorObject), // regulator object
      //     tx.object(selectedDrug.id), // drug object
      //     tx.object("0x..."), // status index object
      //     tx.pure.string(recallReason), // reason
      //     tx.pure.u8(parseInt(recallSeverity)), // severity
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      // For the mock version, we'll just update our local state
      setTimeout(() => {
        const updatedActiveDrugs = activeDrugs.filter(d => d.id !== selectedDrug.id);
        const updatedDrug = {...selectedDrug, status: "2"};
        const updatedRecalledDrugs = [...recalledDrugs, updatedDrug];
        
        setActiveDrugs(updatedActiveDrugs);
        setRecalledDrugs(updatedRecalledDrugs);
        
        setSuccess(`Drug ${selectedDrug.drugId} has been recalled.`);
        setSelectedDrug(null);
        setRecallReason("");
        setRecallSeverity("3");
        setIsRecalling(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error recalling drug:", error);
      setError("Failed to recall drug. Please try again.");
      setIsRecalling(false);
    }
  };

  // Handler for filing a report on a drug
  const handleFileReport = async () => {
    if (!currentAccount || !selectedDrug || !regulatorObject) return;
    
    try {
      setIsReporting(true);
      setError("");
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the file_report function from the regulator module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::regulator::file_report`,
      //   arguments: [
      //     tx.object(regulatorObject), // regulator object
      //     tx.object(selectedDrug.id), // drug object
      //     tx.pure.string(reportType), // report type
      //     tx.pure.string(reportContent), // content
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      // For the mock version, we'll just simulate the report
      setTimeout(() => {
        setSuccess(`Report has been filed for drug ${selectedDrug.drugId}.`);
        setSelectedDrug(null);
        setReportType("compliance");
        setReportContent("");
        setIsReporting(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error filing report:", error);
      setError("Failed to file report. Please try again.");
      setIsReporting(false);
    }
  };

  // Handler for setting oversight requirements for a drug
  const handleSetOversight = async () => {
    if (!currentAccount || !selectedDrug || !regulatorObject) return;
    
    try {
      setIsSettingOversight(true);
      setError("");
      
      // Create transaction
      const tx = new Transaction();
      
      // Call the set_oversight_requirements function from the regulator module
      // In a real implementation, you would:
      // tx.moveCall({
      //   target: `${packageId}::regulator::set_oversight_requirements`,
      //   arguments: [
      //     tx.object(regulatorObject), // regulator object
      //     tx.object(selectedDrug.id), // drug object
      //     tx.pure.u8(parseInt(oversightLevel)), // oversight level
      //     tx.pure.u64(parseInt(verificationFrequency)), // verification frequency
      //     tx.pure.string(oversightNotes), // notes
      //     tx.object("0x..."), // role registry
      //     tx.object("0x6"), // clock - Sui system clock object
      //   ],
      // });
      
      // For the mock version, we'll just simulate setting oversight
      setTimeout(() => {
        setSuccess(`Oversight requirements set for drug ${selectedDrug.drugId}.`);
        setSelectedDrug(null);
        setOversightLevel("2");
        setVerificationFrequency("90");
        setOversightNotes("");
        setIsSettingOversight(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error setting oversight requirements:", error);
      setError("Failed to set oversight requirements. Please try again.");
      setIsSettingOversight(false);
    }
  };

  if (!currentAccount) {
    return (
      <Container size="3">
        <Box py="6">
          <Heading size="6" mb="4">Regulator Dashboard</Heading>
          <Text size="3">Please connect your wallet to access the regulator dashboard.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="3">
      <Box py="6">
        <Heading size="6" mb="4">Regulator Dashboard</Heading>
        
        <RoleCheckDisabledBanner />
        
        <Text size="3" mb="4">
          Connected as: {currentAccount.address}
          {regulatorObject ? 
            <Text as="span" color="green"> (Regulator object found)</Text> : 
            <Text as="span" color="red"> (No regulator object found - please register in Admin Dashboard)</Text>
          }
        </Text>
        
        {regulatorInfo && (
          <Card mb="4">
            <Heading size="3" mb="2">Regulator Information</Heading>
            <Flex direction="column" gap="2">
              <Flex justify="between">
                <Text weight="bold">Name:</Text>
                <Text>{regulatorInfo.name}</Text>
              </Flex>
              <Flex justify="between">
                <Text weight="bold">Jurisdiction:</Text>
                <Text>{regulatorInfo.jurisdiction}</Text>
              </Flex>
            </Flex>
          </Card>
        )}
        
        {error && (
          <Card mb="4" style={{ backgroundColor: "#fee2e2", padding: "12px" }}>
            <Text color="red">{error}</Text>
          </Card>
        )}
        
        {success && (
          <Card mb="4" style={{ backgroundColor: "#d1fae5", padding: "12px" }}>
            <Text color="green">{success}</Text>
          </Card>
        )}
        
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="pending">
              Pending Approval
              {pendingDrugs.length > 0 && (
                <span style={{ 
                  marginLeft: '6px',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem'
                }}>
                  {pendingDrugs.length}
                </span>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger value="active">
              Active Drugs
              {activeDrugs.length > 0 && (
                <span style={{ 
                  marginLeft: '6px',
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem'
                }}>
                  {activeDrugs.length}
                </span>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger value="recalled">
              Recalled Drugs
              {recalledDrugs.length > 0 && (
                <span style={{ 
                  marginLeft: '6px',
                  backgroundColor: '#fee2e2',
                  color: '#7f1d1d',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem'
                }}>
                  {recalledDrugs.length}
                </span>
              )}
            </Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            {/* Pending Approval Tab Content */}
            <Tabs.Content value="pending">
              {loadingDrugs ? (
                <Text>Loading pending drugs...</Text>
              ) : pendingDrugs.length === 0 ? (
                <Card>
                  <Text>No drugs pending approval.</Text>
                </Card>
              ) : (
                <Card>
                  <Text size="2" mb="2">Drugs requiring regulatory approval:</Text>
                  
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Drug ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Manufacturer</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                      {pendingDrugs.map((drug) => (
                        <Table.Row key={drug.id}>
                          <Table.Cell>{drug.drugId}</Table.Cell>
                          <Table.Cell title={drug.manufacturer}>
                            {drug.manufacturer.substring(0, 10)}...
                          </Table.Cell>
                          <Table.Cell>{formatDate(drug.createdAt)}</Table.Cell>
                          <Table.Cell>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: getStatusColor(drug.status),
                              color: getStatusTextColor(drug.status)
                            }}>
                              {getStatusText(drug.status)}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            {drug.verified ? 
                              <Text color="green">Yes</Text> : 
                              <Text color="red">No</Text>
                            }
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="2">
                              <Button 
                                size="1" 
                                onClick={() => setSelectedDrug(drug)}
                                variant="soft"
                              >
                                View
                              </Button>
                              <Button 
                                size="1" 
                                color="green"
                                onClick={() => {
                                  setSelectedDrug(drug);
                                  setApprovalNotes("");
                                }}
                                variant="soft"
                              >
                                Approve
                              </Button>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card>
              )}
            </Tabs.Content>

            {/* Active Drugs Tab Content */}
            <Tabs.Content value="active">
              {loadingDrugs ? (
                <Text>Loading active drugs...</Text>
              ) : activeDrugs.length === 0 ? (
                <Card>
                  <Text>No active drugs found.</Text>
                </Card>
              ) : (
                <Card>
                  <Text size="2" mb="2">Active drugs that can be recalled or reported:</Text>
                  
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Drug ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Manufacturer</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                      {activeDrugs.map((drug) => (
                        <Table.Row key={drug.id}>
                          <Table.Cell>{drug.drugId}</Table.Cell>
                          <Table.Cell title={drug.manufacturer}>
                            {drug.manufacturer.substring(0, 10)}...
                          </Table.Cell>
                          <Table.Cell>{formatDate(drug.createdAt)}</Table.Cell>
                          <Table.Cell>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: getStatusColor(drug.status),
                              color: getStatusTextColor(drug.status)
                            }}>
                              {getStatusText(drug.status)}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            {drug.verified ? 
                              <Text color="green">Yes</Text> : 
                              <Text color="red">No</Text>
                            }
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="2">
                              <Button 
                                size="1" 
                                onClick={() => setSelectedDrug(drug)}
                                variant="soft"
                              >
                                View
                              </Button>
                              <Button 
                                size="1" 
                                color="red"
                                onClick={() => {
                                  setSelectedDrug(drug);
                                  setRecallReason("");
                                  setRecallSeverity("3");
                                }}
                                variant="soft"
                              >
                                Recall
                              </Button>
                              <Button
                                size="1"
                                color="blue"
                                onClick={() => {
                                  setSelectedDrug(drug);
                                  setReportType("compliance");
                                  setReportContent("");
                                }}
                                variant="soft"
                              >
                                Report
                              </Button>
                              <Button
                                size="1"
                                color="orange"
                                onClick={() => {
                                  setSelectedDrug(drug);
                                  setOversightLevel("2");
                                  setVerificationFrequency("90");
                                  setOversightNotes("");
                                }}
                                variant="soft"
                              >
                                Oversight
                              </Button>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card>
              )}
            </Tabs.Content>

            {/* Recalled Drugs Tab Content */}
            <Tabs.Content value="recalled">
              {loadingDrugs ? (
                <Text>Loading recalled drugs...</Text>
              ) : recalledDrugs.length === 0 ? (
                <Card>
                  <Text>No recalled drugs found.</Text>
                </Card>
              ) : (
                <Card>
                  <Text size="2" mb="2">Drugs that have been recalled:</Text>
                  
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Drug ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Manufacturer</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                      {recalledDrugs.map((drug) => (
                        <Table.Row key={drug.id}>
                          <Table.Cell>{drug.drugId}</Table.Cell>
                          <Table.Cell title={drug.manufacturer}>
                            {drug.manufacturer.substring(0, 10)}...
                          </Table.Cell>
                          <Table.Cell>{formatDate(drug.createdAt)}</Table.Cell>
                          <Table.Cell>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: getStatusColor(drug.status),
                              color: getStatusTextColor(drug.status)
                            }}>
                              {getStatusText(drug.status)}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            {drug.verified ? 
                              <Text color="green">Yes</Text> : 
                              <Text color="red">No</Text>
                            }
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="2">
                              <Button 
                                size="1" 
                                onClick={() => setSelectedDrug(drug)}
                                variant="soft"
                              >
                                View
                              </Button>
                              <Button
                                size="1"
                                color="blue"
                                onClick={() => {
                                  setSelectedDrug(drug);
                                  setReportType("compliance");
                                  setReportContent("");
                                }}
                                variant="soft"
                              >
                                Report
                              </Button>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card>
              )}
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        {/* Drug details and action modals will be added in subsequent edits */}
        
        {/* View Drug Modal */}
        <Dialog.Root open={!!selectedDrug && !isApproving && !isRecalling && !isReporting && !isSettingOversight} onOpenChange={(open) => !open && setSelectedDrug(null)}>
          <Dialog.Content>
            <Dialog.Title>Drug Details</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Detailed information about the selected drug.
            </Dialog.Description>
            
            {selectedDrug && (
              <Box>
                <Flex direction="column" gap="2">
                  <Flex justify="between">
                    <Text weight="bold">Drug ID:</Text>
                    <Text>{selectedDrug.drugId}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Object ID:</Text>
                    <Text style={{ wordBreak: 'break-all' }}>{selectedDrug.id}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Manufacturer:</Text>
                    <Text style={{ wordBreak: 'break-all' }}>{selectedDrug.manufacturer}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Created At:</Text>
                    <Text>{formatDate(selectedDrug.createdAt)}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Status:</Text>
                    <Text>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(selectedDrug.status),
                        color: getStatusTextColor(selectedDrug.status)
                      }}>
                        {getStatusText(selectedDrug.status)}
                      </span>
                    </Text>
                  </Flex>
                  <Flex justify="between">
                    <Text weight="bold">Verified:</Text>
                    <Text color={selectedDrug.verified ? "green" : "red"}>
                      {selectedDrug.verified ? "Yes" : "No"}
                    </Text>
                  </Flex>
                  <Separator my="2" />
                  <Text weight="bold">Content ID (IPFS):</Text>
                  <Text size="2" style={{ 
                    wordBreak: 'break-all',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                  }}>
                    {selectedDrug.cid}
                  </Text>
                </Flex>
                
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">Close</Button>
                  </Dialog.Close>
                  {selectedDrug.status === "0" && (
                    <Button 
                      color="green" 
                      onClick={() => {
                        setApprovalNotes("");
                        setIsApproving(true);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {selectedDrug.status === "1" && (
                    <>
                      <Button 
                        color="red" 
                        onClick={() => {
                          setRecallReason("");
                          setRecallSeverity("3");
                          setIsRecalling(true);
                        }}
                      >
                        Recall
                      </Button>
                      <Button 
                        color="blue" 
                        onClick={() => {
                          setReportType("compliance");
                          setReportContent("");
                          setIsReporting(true);
                        }}
                      >
                        Report
                      </Button>
                      <Button 
                        color="orange" 
                        onClick={() => {
                          setOversightLevel("2");
                          setVerificationFrequency("90");
                          setOversightNotes("");
                          setIsSettingOversight(true);
                        }}
                      >
                        Oversight
                      </Button>
                    </>
                  )}
                </Flex>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Root>
        
        {/* Approve Drug Modal */}
        <Dialog.Root open={!!selectedDrug && isApproving} onOpenChange={(open) => !open && setIsApproving(false)}>
          <Dialog.Content>
            <Dialog.Title>Approve Drug</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Approve drug {selectedDrug?.drugId} for distribution.
            </Dialog.Description>
            
            <Flex direction="column" gap="3">
              <label htmlFor="approval-notes">
                <Text weight="bold" as="div" size="2" mb="1">
                  Approval Notes
                </Text>
                <TextField.Root id="approval-notes" size="3" placeholder="Add any notes for this approval" value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} />
              </label>
              
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" onClick={() => setIsApproving(false)}>Cancel</Button>
                </Dialog.Close>
                <Button color="green" onClick={handleApproveDrug} disabled={!regulatorObject}>
                  Approve Drug
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        
        {/* Recall Drug Modal */}
        <Dialog.Root open={!!selectedDrug && isRecalling} onOpenChange={(open) => !open && setIsRecalling(false)}>
          <Dialog.Content>
            <Dialog.Title>Recall Drug</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Recall drug {selectedDrug?.drugId} from distribution.
            </Dialog.Description>
            
            <Flex direction="column" gap="3">
              <label htmlFor="recall-reason">
                <Text weight="bold" as="div" size="2" mb="1">
                  Recall Reason
                </Text>
                <TextField.Root id="recall-reason" size="3" placeholder="Reason for recalling this drug" value={recallReason} onChange={(e) => setRecallReason(e.target.value)} />
              </label>
              
              <label htmlFor="recall-severity">
                <Text weight="bold" as="div" size="2" mb="1">
                  Severity Level (1-5)
                </Text>
                <Select.Root value={recallSeverity} onValueChange={setRecallSeverity}>
                  <Select.Trigger id="recall-severity" />
                  <Select.Content>
                    <Select.Item value="1">1 - Minor Issue</Select.Item>
                    <Select.Item value="2">2 - Low Risk</Select.Item>
                    <Select.Item value="3">3 - Moderate Risk</Select.Item>
                    <Select.Item value="4">4 - High Risk</Select.Item>
                    <Select.Item value="5">5 - Critical Risk</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>
              
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" onClick={() => setIsRecalling(false)}>Cancel</Button>
                </Dialog.Close>
                <Button color="red" onClick={handleRecallDrug} disabled={!regulatorObject || !recallReason}>
                  Recall Drug
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        
        {/* Report Drug Modal */}
        <Dialog.Root open={!!selectedDrug && isReporting} onOpenChange={(open) => !open && setIsReporting(false)}>
          <Dialog.Content>
            <Dialog.Title>File Regulatory Report</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              File a report for drug {selectedDrug?.drugId}.
            </Dialog.Description>
            
            <Flex direction="column" gap="3">
              <label htmlFor="report-type">
                <Text weight="bold" as="div" size="2" mb="1">
                  Report Type
                </Text>
                <Select.Root value={reportType} onValueChange={setReportType}>
                  <Select.Trigger id="report-type" />
                  <Select.Content>
                    <Select.Item value="compliance">Compliance Issue</Select.Item>
                    <Select.Item value="safety">Safety Concern</Select.Item>
                    <Select.Item value="quality">Quality Control</Select.Item>
                    <Select.Item value="manufacturing">Manufacturing Problem</Select.Item>
                    <Select.Item value="labeling">Labeling Error</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>
              
              <label htmlFor="report-content">
                <Text weight="bold" as="div" size="2" mb="1">
                  Report Content
                </Text>
                <textarea
                  id="report-content"
                  placeholder="Detailed description of the report"
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  style={{ 
                    width: '100%', 
                    minHeight: '120px', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc' 
                  }}
                />
              </label>
              
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" onClick={() => setIsReporting(false)}>Cancel</Button>
                </Dialog.Close>
                <Button color="blue" onClick={handleFileReport} disabled={!regulatorObject || !reportContent}>
                  Submit Report
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        
        {/* Set Oversight Requirements Modal */}
        <Dialog.Root open={!!selectedDrug && isSettingOversight} onOpenChange={(open) => !open && setIsSettingOversight(false)}>
          <Dialog.Content>
            <Dialog.Title>Set Oversight Requirements</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Set regulatory oversight requirements for drug {selectedDrug?.drugId}.
            </Dialog.Description>
            
            <Flex direction="column" gap="3">
              <label htmlFor="oversight-level">
                <Text weight="bold" as="div" size="2" mb="1">
                  Oversight Level
                </Text>
                <Select.Root value={oversightLevel} onValueChange={setOversightLevel}>
                  <Select.Trigger id="oversight-level" />
                  <Select.Content>
                    <Select.Item value="1">1 - Minimal Oversight</Select.Item>
                    <Select.Item value="2">2 - Standard Oversight</Select.Item>
                    <Select.Item value="3">3 - Enhanced Oversight</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>
              
              <label htmlFor="verification-frequency">
                <Text weight="bold" as="div" size="2" mb="1">
                  Verification Frequency (days)
                </Text>
                <TextField.Root 
                  id="verification-frequency" 
                  size="3" 
                  placeholder="Verification frequency in days" 
                  value={verificationFrequency} 
                  onChange={(e) => setVerificationFrequency(e.target.value)}
                  type="number"
                  min="1"
                />
              </label>
              
              <label htmlFor="oversight-notes">
                <Text weight="bold" as="div" size="2" mb="1">
                  Oversight Notes
                </Text>
                <textarea
                  id="oversight-notes"
                  placeholder="Additional notes about oversight requirements"
                  value={oversightNotes}
                  onChange={(e) => setOversightNotes(e.target.value)}
                  style={{ 
                    width: '100%', 
                    minHeight: '120px', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc' 
                  }}
                />
              </label>
              
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" onClick={() => setIsSettingOversight(false)}>Cancel</Button>
                </Dialog.Close>
                <Button color="orange" onClick={handleSetOversight} disabled={!regulatorObject || !verificationFrequency}>
                  Set Requirements
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Box>
    </Container>
  );
} 
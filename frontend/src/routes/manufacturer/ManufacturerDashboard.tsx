import { useState } from "react";
import { Box, Container, Heading, Tabs, Text } from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import RegisterDrug from "./RegisterDrug";
import ManageDrugs from "./ManageDrugs";
import RoleCheckDisabledBanner from "../../components/RoleCheckDisabledBanner";

export default function ManufacturerDashboard() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("register");

  if (!currentAccount) {
    return (
      <Container size="3">
        <Box py="6" style={{ color: "#000" }}>
          <Heading size="6" mb="4">Manufacturer Dashboard</Heading>
          <Text size="3">Please connect your wallet to access the manufacturer dashboard.</Text>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container size="3">
      <Box py="6" style={{ color: "#000" }}>
        <Heading size="6" mb="4">Manufacturer Dashboard</Heading>
        
        <RoleCheckDisabledBanner />
        
        <Text size="3" mb="4">
          Connected as: {currentAccount.address}
        </Text>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="register" style={{ color: "#000" }}>Register Drug</Tabs.Trigger>
            <Tabs.Trigger value="manage" style={{ color: "#000" }}>Manage Drugs</Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Tabs.Content value="register">
              <RegisterDrug />
            </Tabs.Content>

            <Tabs.Content value="manage">
              <ManageDrugs />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Container>
  );
} 
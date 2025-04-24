import { useState } from "react";
import { Box, Container, Heading, Tabs, Text } from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import ManufacturerManager from "./ManufacturerManager";
import RoleManager from "./RoleManager";
import DrugStatusManager from "./DrugStatusManager";
import RegulatorManager from "./RegulatorManager";
import DistributorManager from "./DistributorManager";
import RoleChecker from "../../components/RoleChecker";
import RoleCheckDisabledBanner from "../../components/RoleCheckDisabledBanner";

export default function AdminDashboard() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("manufacturers");

  if (!currentAccount) {
    return (
      <Container size="3">
        <Box py="6">
          <Heading size="6" mb="4">Admin Dashboard</Heading>
          <Text size="3">Please connect your wallet to access the admin dashboard.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="3">
      <Box py="6">
        <Heading size="6" mb="4" style={{ color: "#000" }}>Admin Dashboard</Heading>
        
        <RoleCheckDisabledBanner />
        
        <Text size="3" mb="4" style={{ color: "#000" }}>
          Connected as: {currentAccount.address}
        </Text>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab} style={{ color: "#000" }}>
          <Tabs.List>
            <Tabs.Trigger value="manufacturers" style={{ color: "#000" }}>Manufacturers</Tabs.Trigger>
            <Tabs.Trigger value="regulators" style={{ color: "#000" }}>Regulators</Tabs.Trigger>
            <Tabs.Trigger value="distributors" style={{ color: "#000" }}>Distributors</Tabs.Trigger>
            <Tabs.Trigger value="roles" style={{ color: "#000" }}>Roles</Tabs.Trigger>
            <Tabs.Trigger value="drugs" style={{ color: "#000" }}>Drugs</Tabs.Trigger>
            <Tabs.Trigger value="debug" style={{ color: "#000" }}>Role Checker</Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Tabs.Content value="manufacturers">
              <ManufacturerManager />
            </Tabs.Content>

            <Tabs.Content value="regulators">
              <RegulatorManager />
            </Tabs.Content>
            
            <Tabs.Content value="distributors">
              <DistributorManager />
            </Tabs.Content>

            <Tabs.Content value="roles">
              <RoleManager />
            </Tabs.Content>

            <Tabs.Content value="drugs">
              <DrugStatusManager />
            </Tabs.Content>
            
            <Tabs.Content value="debug">
              <RoleChecker />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Container>
  );
} 
import { ReactNode } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import {
  ROLE_ADMIN,
  ROLE_MANUFACTURER,
  ROLE_REGULATOR,
  ROLE_DISTRIBUTOR
} from "../utils/roleUtils";

// Get role name from role ID
const getRoleName = (roleId: string) => {
  switch(roleId) {
    case ROLE_ADMIN: return "Admin";
    case ROLE_MANUFACTURER: return "Manufacturer";
    case ROLE_REGULATOR: return "Regulator";
    case ROLE_DISTRIBUTOR: return "Distributor";
    default: return `Unknown Role (${roleId})`;
  }
};

// Get role description
const getRoleDescription = (roleId: string) => {
  switch(roleId) {
    case ROLE_ADMIN:
      return "Administrators have full access to the system and can manage users, roles, and configurations.";
    case ROLE_MANUFACTURER:
      return "Manufacturers can register new drugs, update information, and track their products in the supply chain.";
    case ROLE_REGULATOR:
      return "Regulators can verify drug information, approve or reject registrations, and audit the supply chain.";
    case ROLE_DISTRIBUTOR:
      return "Distributors can track and manage drug distribution and verify authenticity of products.";
    default:
      return "This role provides specific permissions in the system.";
  }
};

interface AccessDeniedProps {
  requiredRoles: string[];
  onBack?: () => void;
  onHome?: () => void;
  customMessage?: ReactNode;
}

export default function AccessDenied({
  requiredRoles,
  onBack,
  onHome,
  customMessage
}: AccessDeniedProps) {
  const currentAccount = useCurrentAccount();

  return (
    <Card size="3" style={{ maxWidth: 650, margin: "100px auto" }}>
      <Flex direction="column" gap="4">
        <Heading size="5" color="crimson">Access Denied</Heading>
        <Box>
          <Heading size="4">Missing Role Capability</Heading>
          <Text size="2" mt="2">
            {customMessage || "Your wallet does not possess the required role capabilities to access this section."}
          </Text>
        </Box>
        
        <Box>
          <Text weight="bold" mb="2">Required Role Capabilities:</Text>
          <Flex direction="column" gap="3">
            {requiredRoles.map(roleId => (
              <Card key={roleId} style={{ borderLeft: '4px solid var(--accent-9)' }}>
                <Heading size="3">{getRoleName(roleId)} Role</Heading>
                <Text size="2" mt="1">{getRoleDescription(roleId)}</Text>
              </Card>
            ))}
          </Flex>
        </Box>
        
        {currentAccount && (
          <Box mt="2">
            <Text size="2" color="gray">Your address: {currentAccount.address}</Text>
          </Box>
        )}
        
        <Box style={{ background: 'var(--accent-2)', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          <Text weight="bold">How to obtain this capability:</Text>
          <Text size="2" mt="1">
            To gain access to this section, you need to be assigned the required role by an admin. 
            Contact the system administrator to request the appropriate role for your wallet address.
          </Text>
        </Box>
        
        <Flex gap="3" mt="4" justify="end">
          {onBack && (
            <Button variant="soft" onClick={onBack}>Go back</Button>
          )}
          {onHome && (
            <Button onClick={onHome}>Return to Home</Button>
          )}
          {!onBack && !onHome && (
            <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
} 
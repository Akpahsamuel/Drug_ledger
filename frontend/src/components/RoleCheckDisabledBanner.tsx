import { Box, Card, Text } from "@radix-ui/themes";

/**
 * Banner component to indicate that role-based access control is disabled.
 * This can be added to any page that would normally require specific role permissions.
 */
export default function RoleCheckDisabledBanner() {
  return (
    <Card size="1" style={{ marginBottom: '16px', backgroundColor: 'rgba(255, 183, 77, 0.2)' }}>
      <Box p="2">
        <Text weight="bold" color="amber">⚠️ Role Verification Disabled</Text>
        <Text size="2">
          All connected users currently have access to this section regardless of their assigned role.
        </Text>
      </Box>
    </Card>
  );
} 
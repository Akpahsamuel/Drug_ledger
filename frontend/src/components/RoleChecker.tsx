import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { DEBUG_ROLES, ROLE_MANUFACTURER } from "../utils/roleUtils";
import React from "react";

export default function RoleChecker() {
  return (
    <Card>
      <Heading size="3" mb="3" style={{ color: "#000" }}>Role Checker</Heading>
      
      <Box my="4">
        <Text size="3" weight="bold" color="amber" style={{ color: "#000" }}>Role verification is currently disabled</Text>
        <Text mt="2" style={{ color: "#000" }}>
          Role-based access control has been removed from the application. 
          All authenticated users can access all routes regardless of their roles.
        </Text>
        <Text size="2" color="gray" mt="4" style={{ color: "#000" }}>
          This means any user with a connected wallet can access any functionality in the application 
          including admin features, manufacturer tools, regulator functions, and distributor capabilities.
        </Text>
      </Box>
    </Card>
  );
} 
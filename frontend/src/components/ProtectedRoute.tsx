import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Card, Text, Button, Flex, Heading, Code } from "@radix-ui/themes";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  fallbackPath = '/'
}: ProtectedRouteProps) {
  const currentAccount = useCurrentAccount();

  // Check if user is connected
  if (!currentAccount) {
    return (
      <Card size="2" style={{ maxWidth: 500, margin: "100px auto" }}>
        <Flex direction="column" gap="4" align="center">
          <Heading size="4">Authentication Required</Heading>
          <Text>Please connect your wallet to access this page.</Text>
        </Flex>
      </Card>
    );
  }

  // Role verification is bypassed - all users with connected wallets can access any route
  // If user has connected wallet, render the children
  return <>{children}</>;
}

// Single role protected route - no role checks, just wallet connection
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[]} fallbackPath="/">
      {children}
    </ProtectedRoute>
  );
}

export function ManufacturerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[]} fallbackPath="/">
      {children}
    </ProtectedRoute>
  );
}

export function RegulatorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[]} fallbackPath="/">
      {children}
    </ProtectedRoute>
  );
}

export function DistributorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[]} fallbackPath="/">
      {children}
    </ProtectedRoute>
  );
} 
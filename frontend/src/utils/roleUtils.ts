import { useCurrentAccount, useSuiClient, useCurrentWallet, useSuiClientQuery } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useNetworkVariable } from "../config/networkConfig";
import { SuiClient } from "@mysten/sui/client";
import { ObjectOwner, SuiObjectResponse } from "@mysten/sui/client";

// Enable detailed debug logging for role checks
export const DEBUG_ROLES = true;

// Role constants
export const ROLE_ADMIN = "admin";
export const ROLE_MANUFACTURER = "manufacturer";
export const ROLE_REGULATOR = "regulator";
export const ROLE_DISTRIBUTOR = "distributor";

// Role constants from the contract
const CONTRACT_ROLE_ADMIN = 0;
const CONTRACT_ROLE_MANUFACTURER = 1;
const CONTRACT_ROLE_REGULATOR = 2;
const CONTRACT_ROLE_DISTRIBUTOR = 3;

// Hook for direct query of DrugLedgerAdmin capability object
export function useAdminCap() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  
  const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || "",
    filter: {
      MatchAll: [
        {
          StructType: `${packageId}::drug_ledger::DrugLedgerAdmin`
        }
      ]
    },
    options: {
      showContent: true,
      showType: true,
      showOwner: true
    }
  }, {
    enabled: !!account?.address,
  });
  
  const adminCap = data?.data?.[0];
  const hasAdminCap = !!adminCap;
  
  if (DEBUG_ROLES) {
    if (hasAdminCap) {
      console.log('[ADMIN CHECK] Found DrugLedgerAdmin object:', adminCap);
    } else if (!isLoading && account?.address) {
      console.log('[ADMIN CHECK] No DrugLedgerAdmin object found for address:', account.address);
    }
  }
  
  return {
    adminCap,
    adminCapId: adminCap?.data?.objectId,
    hasAdminCap,
    isLoading,
    error
  };
}

// Hook for checking if the current account is the package deployer
export function useIsPackageDeployer() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  const [isDeployer, setIsDeployer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDeployer = async () => {
      if (!currentAccount || !packageId) {
        setIsLoading(false);
        setIsDeployer(false);
        if (!currentAccount) {
          setError("No wallet connected");
        } else if (!packageId) {
          setError("Package ID not configured");
        }
        return;
      }

      try {
        const packageData = await client.getObject({
          id: packageId,
          options: { showOwner: true }
        });

        if (DEBUG_ROLES) {
          console.log("[ROLE CHECK] Package data:", packageData);
        }

        const owner = packageData.data?.owner;
        if (owner && typeof owner === 'object' && 'AddressOwner' in owner) {
          const ownerAddress = owner.AddressOwner;
          const isOwner = ownerAddress === currentAccount.address;

          if (DEBUG_ROLES) {
            console.log(`[ROLE CHECK] Package owner address: ${ownerAddress}`);
            console.log(`[ROLE CHECK] Current account: ${currentAccount.address}`);
            console.log(`[ROLE CHECK] Is package deployer: ${isOwner}`);
          }

          setIsDeployer(isOwner);
        } else {
          setIsDeployer(false);
          setError("Package is not owned by an address");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("[ROLE CHECK] Error checking package deployer:", err);
        setError(`Error checking package deployer: ${err instanceof Error ? err.message : String(err)}`);
        setIsDeployer(false);
        setIsLoading(false);
      }
    };

    checkDeployer();
  }, [currentAccount, client, packageId]);

  return { isDeployer, isLoading, error };
}

// A simpler approach: check the role by using the direct table lookup API
// This avoids issues with transaction simulation and is more reliable
async function checkRoleDirectly(
  client: SuiClient, 
  roleRegistryId: string,
  accountAddress: string
): Promise<number | null> {
  if (DEBUG_ROLES) {
    console.log(`[ROLE CHECK] Checking role for address ${accountAddress}`);
    console.log(`[ROLE CHECK] Using role registry: ${roleRegistryId}`);
  }

  try {
    // First, get the full role registry object to understand its structure
    const roleRegistryObj = await client.getObject({
      id: roleRegistryId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      }
    });

    if (DEBUG_ROLES) {
      console.log(`[ROLE CHECK] Role registry object:`, roleRegistryObj);
    }

    // Based on the object structure, determine how to look up roles
    const objType = roleRegistryObj.data?.type;
    if (DEBUG_ROLES) {
      console.log(`[ROLE CHECK] Role registry type: ${objType}`);
    }

    // Try to determine if the role registry uses Table or direct fields
    let usesTable = false;
    if (roleRegistryObj.data?.content && typeof roleRegistryObj.data.content === 'object') {
      const content = roleRegistryObj.data.content;
      if ('fields' in content) {
        const fields = content.fields;
        if ('roles' in fields && typeof fields.roles === 'object') {
          // This looks like a table structure as in the contract
          usesTable = true;
          if (DEBUG_ROLES) {
            console.log(`[ROLE CHECK] Using table-based role lookup`);
          }
        }
      }
    }

    // Method 1: If the registry uses a Table structure (like in your contract)
    if (usesTable) {
      // Query the role registry object's table for the address entry
      const response = await client.getDynamicFieldObject({
        parentId: roleRegistryId,
        name: {
          type: "address",
          value: accountAddress
        }
      });

      if (DEBUG_ROLES) {
        console.log(`[ROLE CHECK] Dynamic field response:`, response);
      }

      // Check if we found a role entry
      if (response && response.data) {
        // Get the value which contains the role
        const content = response.data.content;
        if (content && typeof content === 'object' && 'fields' in content) {
          const fields = content.fields;
          // The role should be stored as a number in the value field
          if ('value' in fields) {
            if (typeof fields.value === 'number') {
              const role = fields.value;
              
              if (DEBUG_ROLES) {
                console.log(`[ROLE CHECK] Found role: ${role}`);
              }
              
              return role;
            } else if (typeof fields.value === 'string') {
              // Sometimes the role might be stored as a string number
              const role = parseInt(fields.value, 10);
              if (!isNaN(role)) {
                if (DEBUG_ROLES) {
                  console.log(`[ROLE CHECK] Found role (as string): ${role}`);
                }
                return role;
              }
            }
          }
        }
      }
    } 
    // Method 2: Try to check if the admin cap exists and is owned by this address
    // This is a separate check for admin capabilities
    try {
      const adminCapId = useNetworkVariable("drugLedgerAdminCapId");
      if (adminCapId) {
        const adminCapObj = await client.getObject({
          id: adminCapId,
          options: { showOwner: true }
        });
        
        if (DEBUG_ROLES) {
          console.log(`[ROLE CHECK] Admin cap object:`, adminCapObj);
        }
        
        if (adminCapObj.data?.owner) {
          const owner = adminCapObj.data.owner;
          // Check if the owner is the current address
          if (typeof owner === 'object' && 'AddressOwner' in owner && owner.AddressOwner === accountAddress) {
            if (DEBUG_ROLES) {
              console.log(`[ROLE CHECK] Address ${accountAddress} owns the admin cap`);
            }
            return CONTRACT_ROLE_ADMIN;
          }
        }
      }
    } catch (adminErr) {
      console.error(`[ROLE CHECK] Error checking admin cap:`, adminErr);
      // Continue with other methods, don't return yet
    }
    
    // Method 3: Check if there are direct dynamic fields for role permissions
    // Some contracts might store permissions as direct fields
    try {
      const directFields = await client.getDynamicFields({
        parentId: roleRegistryId,
      });
      
      if (DEBUG_ROLES) {
        console.log(`[ROLE CHECK] All dynamic fields:`, directFields);
      }
      
      // Look for any field that might contain the address
      for (const field of directFields.data) {
        const fieldName = field.name;
        if (fieldName && typeof fieldName === 'object' && 
           ((typeof fieldName.value === 'string' && fieldName.value.includes(accountAddress)) ||
            fieldName.value === accountAddress)) {
            
          const fieldObj = await client.getDynamicFieldObject({
            parentId: roleRegistryId,
            name: fieldName
          });
          
          if (DEBUG_ROLES) {
            console.log(`[ROLE CHECK] Found field potentially matching address:`, fieldObj);
          }
          
          // Try to extract a role from the field
          if (fieldObj.data?.content && typeof fieldObj.data.content === 'object' && 'fields' in fieldObj.data.content) {
            const contentFields = fieldObj.data.content.fields;
            
            // Look for any field that might contain role information
            for (const key of Object.keys(contentFields)) {
              const value = contentFields[key as keyof typeof contentFields];
              if (key.toLowerCase().includes('role') || key === 'value') {
                if (typeof value === 'number') {
                  return value;
                } else if (typeof value === 'string') {
                  const role = parseInt(value, 10);
                  if (!isNaN(role)) {
                    return role;
                  }
                }
              }
            }
            
            // If we found a field but couldn't identify the role,
            // check if its type gives us information
            const fieldType = fieldObj.data.type;
            if (fieldType) {
              if (fieldType.toLowerCase().includes('admin')) {
                return CONTRACT_ROLE_ADMIN;
              } else if (fieldType.toLowerCase().includes('manufacturer')) {
                return CONTRACT_ROLE_MANUFACTURER;
              } else if (fieldType.toLowerCase().includes('regulator')) {
                return CONTRACT_ROLE_REGULATOR;
              } else if (fieldType.toLowerCase().includes('distributor')) {
                return CONTRACT_ROLE_DISTRIBUTOR;
              }
            }
          }
        }
      }
    } catch (directFieldErr) {
      console.error(`[ROLE CHECK] Error checking direct fields:`, directFieldErr);
    }
    
    // No role found
    if (DEBUG_ROLES) {
      console.log(`[ROLE CHECK] No role found for address ${accountAddress}`);
    }
    return null;
  } catch (err) {
    console.error(`[ROLE CHECK] Error checking role:`, err);
    return null;
  }
}

// Hook for checking if the current account has the admin role
export function useHasAdminRole() {
  const { hasAdminCap, isLoading: isAdminCapLoading } = useAdminCap();
  const { isDeployer, isLoading: isDeployerLoading } = useIsPackageDeployer();
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const roleRegistryId = useNetworkVariable("roleRegistryId");
  const [hasRoleFromRegistry, setHasRoleFromRegistry] = useState<boolean>(false);
  const [isRegistryLoading, setIsRegistryLoading] = useState<boolean>(true);
  
  // Add direct registry check
  useEffect(() => {
    const checkAdminRoleInRegistry = async () => {
      if (!currentAccount || !roleRegistryId) {
        setIsRegistryLoading(false);
        setHasRoleFromRegistry(false);
        return;
      }

      try {
        // Check role directly from the table
        const role = await checkRoleDirectly(
          client,
          roleRegistryId,
          currentAccount.address
        );
        
        // Check if the role is admin
        const isAdmin = role === CONTRACT_ROLE_ADMIN;
        
        if (DEBUG_ROLES) {
          console.log(`[ADMIN REGISTRY CHECK] Is admin in registry: ${isAdmin}, role value: ${role}`);
        }
        
        setHasRoleFromRegistry(isAdmin);
        setIsRegistryLoading(false);
      } catch (err) {
        console.error("[ADMIN REGISTRY CHECK] Error checking admin role:", err);
        setHasRoleFromRegistry(false);
        setIsRegistryLoading(false);
      }
    };

    checkAdminRoleInRegistry();
  }, [currentAccount, client, roleRegistryId]);
  
  // Check admin cap directly
  const adminCapId = useNetworkVariable("drugLedgerAdminCapId");
  const { data: adminCapData, isLoading: isAdminCapObjLoading } = useSuiClientQuery('getObject', {
    id: adminCapId || '',
    options: { showOwner: true }
  }, {
    enabled: !!adminCapId && !!currentAccount?.address
  });

  const hasAdminCapById = useMemo(() => {
    if (!adminCapData?.data?.owner || !currentAccount) return false;
    
    const owner = adminCapData.data.owner;
    if (typeof owner === 'object' && 'AddressOwner' in owner) {
      return owner.AddressOwner === currentAccount.address;
    }
    return false;
  }, [adminCapData, currentAccount]);
  
  if (DEBUG_ROLES && adminCapData) {
    console.log(`[ADMIN CAP DIRECT CHECK] Admin cap data:`, adminCapData);
    console.log(`[ADMIN CAP DIRECT CHECK] Has admin cap by direct ID check: ${hasAdminCapById}`);
  }
  
  // Combine all checks - user is admin if they have the admin cap, are the deployer, or have admin role in registry
  const hasRole = hasAdminCap || isDeployer || hasRoleFromRegistry || hasAdminCapById;
  const isLoading = isAdminCapLoading || isDeployerLoading || isRegistryLoading || isAdminCapObjLoading;
  
  if (DEBUG_ROLES) {
    console.log(`[ADMIN CHECK] hasAdminCap: ${hasAdminCap}, isDeployer: ${isDeployer}, hasRoleFromRegistry: ${hasRoleFromRegistry}, hasAdminCapById: ${hasAdminCapById}, FINAL: ${hasRole}`);
  }
  
  return { hasRole, isLoading, error: null };
}

// Hook for checking if the current account has the manufacturer role
export function useHasManufacturerRole() {
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  
  const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address || "",
    filter: {
      MatchAll: [
        {
          StructType: `${packageId}::drug_ledger::Manufacturer`
        }
      ]
    },
    options: {
      showContent: true,
      showType: true
    }
  }, {
    enabled: !!currentAccount?.address,
  });
  
  const manufactureObj = data?.data?.[0];
  const hasRole = !!manufactureObj;
  
  if (DEBUG_ROLES) {
    if (hasRole) {
      console.log('[MANUFACTURER CHECK] Found Manufacturer object:', manufactureObj);
    } else if (!isLoading && currentAccount?.address) {
      console.log('[MANUFACTURER CHECK] No Manufacturer object found for address:', currentAccount.address);
    }
  }
  
  return { hasRole, isLoading, error };
}

// Hook for checking if the current account has the regulator role
export function useHasRegulatorRole() {
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  
  const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', {
    owner: currentAccount?.address || "",
    filter: {
      MatchAll: [
        {
          StructType: `${packageId}::drug_ledger::Regulator`
        }
      ]
    },
    options: {
      showContent: true,
      showType: true
    }
  }, {
    enabled: !!currentAccount?.address,
  });
  
  const regulatorObj = data?.data?.[0];
  const hasRole = !!regulatorObj;
  
  if (DEBUG_ROLES) {
    if (hasRole) {
      console.log('[REGULATOR CHECK] Found Regulator object:', regulatorObj);
    } else if (!isLoading && currentAccount?.address) {
      console.log('[REGULATOR CHECK] No Regulator object found for address:', currentAccount.address);
    }
  }
  
  return { hasRole, isLoading, error };
}

// Hook for checking if the current account has the distributor role
export function useHasDistributorRole() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const roleRegistryId = useNetworkVariable("roleRegistryId");

  useEffect(() => {
    const checkDistributorRole = async () => {
      if (!currentAccount || !roleRegistryId) {
        setIsLoading(false);
        setHasRole(false);
        if (!currentAccount) {
          setError("No wallet connected");
        } else if (!roleRegistryId) {
          setError("Required configuration missing");
        }
        return;
      }

      try {
        // Check role directly from the table
        const role = await checkRoleDirectly(
          client,
          roleRegistryId,
          currentAccount.address
        );
        
        // Check if the role is distributor
        const isDistributor = role === CONTRACT_ROLE_DISTRIBUTOR;
        
        if (DEBUG_ROLES) {
          console.log(`[DISTRIBUTOR CHECK] Is distributor: ${isDistributor}, role value: ${role}`);
        }
        
        setHasRole(isDistributor);
        setIsLoading(false);
      } catch (err) {
        console.error("[DISTRIBUTOR CHECK] Error checking distributor role:", err);
        setError(`Error checking distributor role: ${err instanceof Error ? err.message : String(err)}`);
        setHasRole(false);
        setIsLoading(false);
      }
    };

    checkDistributorRole();
  }, [currentAccount, client, roleRegistryId]);

  return { hasRole, isLoading, error };
}

// Generic hook for checking if the current account has a specific role
export function useHasRole(roleId: number) {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const roleRegistryId = useNetworkVariable("roleRegistryId");

  useEffect(() => {
    const checkRole = async () => {
      if (!currentAccount || !roleRegistryId) {
        setIsLoading(false);
        setHasRole(false);
        if (!currentAccount) {
          setError("No wallet connected");
        } else if (!roleRegistryId) {
          setError("Required configuration missing");
        }
        return;
      }

      try {
        // Check role directly from the table
        const role = await checkRoleDirectly(
          client,
          roleRegistryId,
          currentAccount.address
        );
        
        // Check if the role matches
        const hasSpecificRole = role === roleId;
        
        if (DEBUG_ROLES) {
          console.log(`[ROLE CHECK] Has role ${roleId}: ${hasSpecificRole}, actual role: ${role}`);
        }
        
        setHasRole(hasSpecificRole);
        setIsLoading(false);
      } catch (err) {
        console.error(`[ROLE CHECK] Error checking role ${roleId}:`, err);
        setError(`Error checking role: ${err instanceof Error ? err.message : String(err)}`);
        setHasRole(false);
        setIsLoading(false);
      }
    };

    checkRole();
  }, [currentAccount, client, roleRegistryId, roleId]);

  return { hasRole, isLoading, error };
}

// Hook for checking if the current account has any of the specified roles
export function useHasAnyRole(roleIds: number[]) {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [hasAnyRole, setHasAnyRole] = useState<boolean>(false);
  const [matchedRole, setMatchedRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const roleRegistryId = useNetworkVariable("roleRegistryId");

  useEffect(() => {
    const checkRoles = async () => {
      if (!currentAccount || !roleRegistryId) {
        setIsLoading(false);
        setHasAnyRole(false);
        setMatchedRole(null);
        if (!currentAccount) {
          setError("No wallet connected");
        } else if (!roleRegistryId) {
          setError("Required configuration missing");
        }
        return;
      }

      try {
        // Check role directly from the table
        const role = await checkRoleDirectly(
          client,
          roleRegistryId,
          currentAccount.address
        );
        
        // Check if the role is in the list of requested roles
        if (role !== null && roleIds.includes(role)) {
          setHasAnyRole(true);
          setMatchedRole(role);
          
          if (DEBUG_ROLES) {
            console.log(`[ROLE CHECK] Found matching role ${role} in requested roles: ${roleIds.join(', ')}`);
          }
        } else {
          setHasAnyRole(false);
          setMatchedRole(null);
          
          if (DEBUG_ROLES) {
            console.log(`[ROLE CHECK] Role ${role} not found in requested roles: ${roleIds.join(', ')}`);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(`[ROLE CHECK] Error checking multiple roles:`, err);
        setError(`Error checking roles: ${err instanceof Error ? err.message : String(err)}`);
        setHasAnyRole(false);
        setMatchedRole(null);
        setIsLoading(false);
      }
    };

    checkRoles();
  }, [currentAccount, client, roleRegistryId, roleIds]);

  return { hasAnyRole, matchedRole, isLoading, error };
} 
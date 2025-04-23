import { getFullnodeUrl } from "@mysten/sui/client" ;
import { createNetworkConfig } from "@mysten/dapp-kit";
import {
  DEVNET_PACKAGE_ID,
  DEVNET_DRUGLEDGER_ADMIN_CAP_ID,
  DEVNET_ROLE_REGISTRY_ID,
  DEVNET_STATUS_INDEX_ID,
  DEVNET_MANUFACTURER_INDEX_ID,
  DEVNET_DRUG_COUNTER_ID,
  DEVNET_UPGRADE_CAPABILITY_ID,
  TESTNET_PACKAGE_ID,
  TESTNET_DRUGLEDGER_ADMIN_CAP_ID,
  TESTNET_ROLE_REGISTRY_ID,
  TESTNET_STATUS_INDEX_ID,
  TESTNET_MANUFACTURER_INDEX_ID,
  TESTNET_DRUG_COUNTER_ID,
  TESTNET_UPGRADE_CAPABILITY_ID,
  MAINNET_PACKAGE_ID,
  MAINNET_DRUGLEDGER_ADMIN_CAP_ID,
  MAINNET_ROLE_REGISTRY_ID,
  MAINNET_STATUS_INDEX_ID,
  MAINNET_MANUFACTURER_INDEX_ID,
  MAINNET_DRUG_COUNTER_ID,
  MAINNET_UPGRADE_CAPABILITY_ID
} from "../constants";

// Create network config with explicit type
const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: DEVNET_PACKAGE_ID,
        drugLedgerAdminCapId: DEVNET_DRUGLEDGER_ADMIN_CAP_ID,
        roleRegistryId: DEVNET_ROLE_REGISTRY_ID,
        statusIndexId: DEVNET_STATUS_INDEX_ID,
        manufacturerIndexId: DEVNET_MANUFACTURER_INDEX_ID,
        drugCounterId: DEVNET_DRUG_COUNTER_ID,
        upgradeCapabilityId: DEVNET_UPGRADE_CAPABILITY_ID,
        network: "devnet"
      }
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: TESTNET_PACKAGE_ID,
        drugLedgerAdminCapId: TESTNET_DRUGLEDGER_ADMIN_CAP_ID,
        roleRegistryId: TESTNET_ROLE_REGISTRY_ID,
        statusIndexId: TESTNET_STATUS_INDEX_ID,
        manufacturerIndexId: TESTNET_MANUFACTURER_INDEX_ID,
        drugCounterId: TESTNET_DRUG_COUNTER_ID,
        upgradeCapabilityId: TESTNET_UPGRADE_CAPABILITY_ID,
        network: "testnet"
      }
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: MAINNET_PACKAGE_ID,
        drugLedgerAdminCapId: MAINNET_DRUGLEDGER_ADMIN_CAP_ID,
        roleRegistryId: MAINNET_ROLE_REGISTRY_ID,
        statusIndexId: MAINNET_STATUS_INDEX_ID,
        manufacturerIndexId: MAINNET_MANUFACTURER_INDEX_ID,
        drugCounterId: MAINNET_DRUG_COUNTER_ID,
        upgradeCapabilityId: MAINNET_UPGRADE_CAPABILITY_ID,
        network: "mainnet"
      }
    },
  });

// Augment useNetworkVariable to allow 'network' parameter
const originalUseNetworkVariable = useNetworkVariable;
const augmentedUseNetworkVariable = ((key: string) => {
  return originalUseNetworkVariable(key as any);
}) as typeof useNetworkVariable;

export { networkConfig, augmentedUseNetworkVariable as useNetworkVariable, useNetworkVariables };
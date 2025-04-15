export const CONFIG = {
  blockchain: {
    network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
    contractPackage: process.env.NEXT_PUBLIC_CONTRACT_PACKAGE || '',
    rpcUrl: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
  },
  roles: {
    ADMIN: 0,
    MANUFACTURER: 1,
    REGULATOR: 2,
    DISTRIBUTOR: 3,
  },
  drugStatus: {
    DRAFT: 0,
    ACTIVE: 1,
    RECALLED: 2,
    EXPIRED: 3,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  validation: {
    minCidLength: 46,
  },
} as const; 
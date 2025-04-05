# DrugLedger

A blockchain-based pharmaceutical supply chain tracking system built on Sui blockchain.

## Project Structure

```
DrugLedger/
├── contracts/                 # Smart contracts directory
│   └── drugledger/           # Move smart contracts
│       ├── sources/          # Contract source files
│       ├── tests/            # Contract test files
│       ├── Move.toml         # Move package configuration
│       └── Move.lock         # Move dependencies lock file
│
└── frontend/                 # Frontend application
    └── drugFront/           # Next.js frontend application
        ├── package.json     # Frontend dependencies
        └── pnpm-lock.yaml   # Package manager lock file
```

## Technology Stack

### Smart Contracts
- Move programming language
- Sui blockchain

### Frontend
- React
- @mysten/dapp-kit for Sui blockchain integration
- @radix-ui/themes for UI components
- @tanstack/react-query for data fetching

## Getting Started

### Prerequisites
- Node.js
- pnpm (recommended) or npm
- Sui CLI
- Move compiler

### Smart Contract Development
1. Navigate to the contracts directory:
   ```bash
   cd contracts/drugledger
   ```
2. Build the contracts:
   ```bash
   sui move build
   ```
3. Run tests:
   ```bash
   sui move test
   ```

### Frontend Development
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   cd drugfront
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

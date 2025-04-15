import { JsonRpcProvider, TransactionBlock, Ed25519Keypair, fromB64, toB64 } from '@mysten/sui.js';
import { Drug, DrugStatus, Issue, Manufacturer, Regulator } from '../types';
import { CONFIG } from '../config';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_PACKAGE = process.env.NEXT_PUBLIC_CONTRACT_PACKAGE || '';

export class BlockchainService {
  private provider: JsonRpcProvider;
  private contractAddress: string;
  private contractPackage: string;

  constructor() {
    this.provider = new JsonRpcProvider({
      fullnode: CONFIG.blockchain.rpcUrl
    });
    this.contractAddress = CONTRACT_ADDRESS;
    this.contractPackage = CONTRACT_PACKAGE;
  }

  // Drug-related functions
  async registerDrug(drug: Omit<Drug, 'id'>): Promise<string> {
    const tx = new TransactionBlock();
    
    // Call the register_drug function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::register_drug`,
      arguments: [
        tx.pure(drug.cid),
        tx.pure(drug.manufacturer),
        tx.pure(drug.creationDate),
        tx.pure(drug.status),
        tx.pure(drug.verified)
      ]
    });
    
    // Execute the transaction
    const result = await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
    
    // Extract the drug ID from the result
    const drugId = this.extractDrugIdFromResult(result);
    return drugId;
  }

  async getDrug(drugId: number): Promise<Drug> {
    // Call the get_drug function in the contract
    const result = await this.provider.getDynamicFields({
      parentId: `${this.contractAddress}::drug_ledger::DrugCounter`,
      filter: { type: 'drug', id: drugId }
    });
    
    if (!result.data || result.data.length === 0) {
      throw new Error(`Drug with ID ${drugId} not found`);
    }
    
    // Parse the drug data from the result
    const drugData = result.data[0].object;
    return this.parseDrugData(drugData);
  }

  async updateDrugStatus(drugId: number, status: DrugStatus): Promise<void> {
    const tx = new TransactionBlock();
    
    // Call the update_drug_status function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::update_drug_status`,
      arguments: [
        tx.pure(drugId),
        tx.pure(status)
      ]
    });
    
    // Execute the transaction
    await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
  }

  // Issue-related functions
  async createIssue(issue: Omit<Issue, 'date' | 'owner'>): Promise<void> {
    const tx = new TransactionBlock();
    
    // Call the create_issue function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::create_issue`,
      arguments: [
        tx.pure(issue.name),
        tx.pure(issue.description),
        tx.pure(issue.severity),
        tx.pure(issue.category)
      ]
    });
    
    // Execute the transaction
    await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
  }

  async resolveIssue(issueId: number, reason: string): Promise<void> {
    const tx = new TransactionBlock();
    
    // Call the resolve_issue function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::resolve_issue`,
      arguments: [
        tx.pure(issueId),
        tx.pure(reason)
      ]
    });
    
    // Execute the transaction
    await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
  }

  // Manufacturer-related functions
  async registerManufacturer(manufacturer: Omit<Manufacturer, 'id' | 'drugCount' | 'registrationDate'>): Promise<string> {
    const tx = new TransactionBlock();
    
    // Call the register_manufacturer function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::register_manufacturer`,
      arguments: [
        tx.pure(manufacturer.name),
        tx.pure(manufacturer.license),
        tx.pure(manufacturer.address),
        tx.pure(manufacturer.verified)
      ]
    });
    
    // Execute the transaction
    const result = await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
    
    // Extract the manufacturer ID from the result
    const manufacturerId = this.extractManufacturerIdFromResult(result);
    return manufacturerId;
  }

  async getManufacturer(address: string): Promise<Manufacturer> {
    // Call the get_manufacturer function in the contract
    const result = await this.provider.getDynamicFields({
      parentId: `${this.contractAddress}::drug_ledger::RoleRegistry`,
      filter: { type: 'manufacturer', address }
    });
    
    if (!result.data || result.data.length === 0) {
      throw new Error(`Manufacturer with address ${address} not found`);
    }
    
    // Parse the manufacturer data from the result
    const manufacturerData = result.data[0].object;
    return this.parseManufacturerData(manufacturerData);
  }

  // Regulator-related functions
  async registerRegulator(regulator: Omit<Regulator, 'id'>): Promise<string> {
    const tx = new TransactionBlock();
    
    // Call the register_regulator function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::register_regulator`,
      arguments: [
        tx.pure(regulator.name),
        tx.pure(regulator.jurisdiction),
        tx.pure(regulator.address)
      ]
    });
    
    // Execute the transaction
    const result = await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
    
    // Extract the regulator ID from the result
    const regulatorId = this.extractRegulatorIdFromResult(result);
    return regulatorId;
  }

  async getRegulator(address: string): Promise<Regulator> {
    // Call the get_regulator function in the contract
    const result = await this.provider.getDynamicFields({
      parentId: `${this.contractAddress}::drug_ledger::RoleRegistry`,
      filter: { type: 'regulator', address }
    });
    
    if (!result.data || result.data.length === 0) {
      throw new Error(`Regulator with address ${address} not found`);
    }
    
    // Parse the regulator data from the result
    const regulatorData = result.data[0].object;
    return this.parseRegulatorData(regulatorData);
  }

  // Role management
  async assignRole(address: string, role: number): Promise<void> {
    const tx = new TransactionBlock();
    
    // Call the assign_role function in the contract
    tx.moveCall({
      target: `${this.contractPackage}::drug_ledger::assign_role`,
      arguments: [
        tx.pure(address),
        tx.pure(role)
      ]
    });
    
    // Execute the transaction
    await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: await this.getSigner(),
      options: { showEffects: true }
    });
  }

  async getRole(address: string): Promise<number> {
    // Call the get_role function in the contract
    const result = await this.provider.getDynamicFields({
      parentId: `${this.contractAddress}::drug_ledger::RoleRegistry`,
      filter: { type: 'role', address }
    });
    
    if (!result.data || result.data.length === 0) {
      throw new Error(`Role for address ${address} not found`);
    }
    
    // Parse the role from the result
    return this.parseRoleFromResult(result.data[0]);
  }

  // Event listeners
  async subscribeToDrugEvents(callback: (event: any) => void): Promise<void> {
    // Subscribe to drug-related events
    this.provider.subscribeEvent({
      filter: { package: this.contractPackage, module: 'drug_ledger' },
      onMessage: (event) => {
        if (event.type.includes('Drug')) {
          callback(event);
        }
      }
    });
  }

  async subscribeToIssueEvents(callback: (event: any) => void): Promise<void> {
    // Subscribe to issue-related events
    this.provider.subscribeEvent({
      filter: { package: this.contractPackage, module: 'drug_ledger' },
      onMessage: (event) => {
        if (event.type.includes('Issue')) {
          callback(event);
        }
      }
    });
  }

  // Helper methods
  private async getSigner(): Promise<Ed25519Keypair> {
    // In a real application, this would get the signer from the wallet
    // For testing, we can create a new keypair
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY || '';
    if (!privateKey) {
      throw new Error('Private key not found');
    }
    
    const privateKeyBytes = fromB64(privateKey);
    return Ed25519Keypair.fromSecretKey(privateKeyBytes);
  }

  private extractDrugIdFromResult(result: any): string {
    // Extract the drug ID from the transaction result
    // This is a simplified implementation
    return result.digest;
  }

  private extractManufacturerIdFromResult(result: any): string {
    // Extract the manufacturer ID from the transaction result
    // This is a simplified implementation
    return result.digest;
  }

  private extractRegulatorIdFromResult(result: any): string {
    // Extract the regulator ID from the transaction result
    // This is a simplified implementation
    return result.digest;
  }

  private parseDrugData(data: any): Drug {
    // Parse the drug data from the blockchain
    // This is a simplified implementation
    return {
      id: data.id,
      drugId: data.drug_id,
      cid: data.cid,
      manufacturer: data.manufacturer,
      creationDate: data.creation_date,
      lastUpdated: data.last_updated,
      status: data.status,
      verified: data.verified
    };
  }

  private parseManufacturerData(data: any): Manufacturer {
    // Parse the manufacturer data from the blockchain
    // This is a simplified implementation
    return {
      id: data.id,
      name: data.name,
      license: data.license,
      address: data.address,
      verified: data.verified,
      registrationDate: data.registration_date,
      drugCount: data.drug_count
    };
  }

  private parseRegulatorData(data: any): Regulator {
    // Parse the regulator data from the blockchain
    // This is a simplified implementation
    return {
      id: data.id,
      name: data.name,
      jurisdiction: data.jurisdiction,
      address: data.address
    };
  }

  private parseRoleFromResult(data: any): number {
    // Parse the role from the blockchain
    // This is a simplified implementation
    return data.value;
  }
}

// Create a singleton instance
export const blockchainService = new BlockchainService(); 
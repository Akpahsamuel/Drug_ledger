import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { blockchainService } from '@/lib/services/blockchain';
import { Drug, DrugStatus, Issue, Manufacturer, Regulator } from '@/lib/types';
import { CONFIG } from '@/lib/config';

export function useBlockchain() {
  const { connected, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drug functions
  const registerDrug = async (drug: Omit<Drug, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.registerDrug(drug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register drug');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDrug = async (drugId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.getDrug(drugId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get drug');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDrugStatus = async (drugId: number, status: DrugStatus) => {
    try {
      setLoading(true);
      setError(null);
      await blockchainService.updateDrugStatus(drugId, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update drug status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Issue functions
  const createIssue = async (issue: Omit<Issue, 'date' | 'owner'>) => {
    try {
      setLoading(true);
      setError(null);
      await blockchainService.createIssue(issue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resolveIssue = async (issueId: number, reason: string) => {
    try {
      setLoading(true);
      setError(null);
      await blockchainService.resolveIssue(issueId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve issue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manufacturer functions
  const registerManufacturer = async (manufacturer: Omit<Manufacturer, 'id' | 'drugCount' | 'registrationDate'>) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.registerManufacturer(manufacturer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register manufacturer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getManufacturer = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.getManufacturer(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get manufacturer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Regulator functions
  const registerRegulator = async (regulator: Omit<Regulator, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.registerRegulator(regulator);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register regulator');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRegulator = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.getRegulator(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get regulator');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Role management
  const assignRole = async (address: string, role: number) => {
    try {
      setLoading(true);
      setError(null);
      await blockchainService.assignRole(address, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRole = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      return await blockchainService.getRole(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Event subscriptions
  useEffect(() => {
    if (!connected) return;

    const drugCallback = (event: any) => {
      // Handle drug events
      console.log('Drug event:', event);
    };

    const issueCallback = (event: any) => {
      // Handle issue events
      console.log('Issue event:', event);
    };

    blockchainService.subscribeToDrugEvents(drugCallback);
    blockchainService.subscribeToIssueEvents(issueCallback);

    return () => {
      // Cleanup subscriptions if needed
    };
  }, [connected]);

  return {
    loading,
    error,
    connected,
    account,
    registerDrug,
    getDrug,
    updateDrugStatus,
    createIssue,
    resolveIssue,
    registerManufacturer,
    getManufacturer,
    registerRegulator,
    getRegulator,
    assignRole,
    getRole,
  };
} 
export type Role = 'ADMIN' | 'MANUFACTURER' | 'REGULATOR' | 'DISTRIBUTOR';

export interface Drug {
  id: string;
  drugId: number;
  cid: string;
  manufacturer: string;
  creationDate: number;
  lastUpdated: number;
  status: DrugStatus;
  verified: boolean;
}

export enum DrugStatus {
  DRAFT = 0,
  ACTIVE = 1,
  RECALLED = 2,
  EXPIRED = 3
}

export interface Issue {
  name: string;
  description: string;
  date: number;
  owner: string;
  resolved: boolean;
  reason: string;
  severity: number; // 1-5 scale
  category: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  license: string;
  address: string;
  verified: boolean;
  registrationDate: number;
  drugCount: number;
}

export interface Regulator {
  id: string;
  name: string;
  jurisdiction: string;
  address: string;
}

// Event types
export interface IssueOpened {
  drugId: number;
  issueId: number;
  name: string;
  description: string;
  severity: number;
  category: string;
}

export interface IssueClosed {
  drugId: number;
  issueId: number;
  reason: string;
  resolutionTimeMs: number;
}

export interface RegisteredManufacturer {
  name: string;
  license: string;
  address: string;
}

export interface RegisteredDrug {
  drugId: number;
  manufacturer: string;
  cid: string;
}

export interface DrugStatusChanged {
  drugId: number;
  oldStatus: DrugStatus;
  newStatus: DrugStatus;
  changedBy: string;
}

export interface Log {
  drugId: number;
  entity: string;
  action: string;
  from: string;
  timestamp: number;
} 
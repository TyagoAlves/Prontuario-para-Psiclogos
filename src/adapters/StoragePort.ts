/**
 * Storage Port - Interface for all persistence adapters
 * Strategy Pattern: interchangeable storage implementations
 */

import type { BackupData } from '../domain/types';

export interface StorageAdapter {
  // Basic CRUD
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;

  // Batch operations
  getAll(keys: string[]): Promise<Record<string, unknown>>;
  setAll(entries: Record<string, unknown>): Promise<void>;

  // Backup/Restore
  exportBackup(): Promise<BackupData>;
  importBackup(data: BackupData): Promise<void>;

  // Quota info
  getUsage(): Promise<{ used: number; quota: number; percentage: number }>;
}

export type StorageType = 'cookie' | 'localStorage' | 'indexedDB' | 'http';

export interface StorageConfig {
  type: StorageType;
  options?: {
    // HTTP adapter
    apiBaseUrl?: string;
    authToken?: string;
    // Cookie adapter
    cookiePrefix?: string;
    // IndexedDB
    dbName?: string;
    dbVersion?: number;
  };
}

export const STORAGE_KEYS = {
  DB: 'clinica-psi-db-v1',
  SESSION: 'clinica-psi-session-v1',
  TELEMETRY: 'clinica-psi-telemetry',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
import { Storage } from '@ionic/storage-angular';

// Define the Transaction interface
export interface Transaction {
  id: number;
  text: string;
  amount: number;
}

// Create a storage instance
const storage = new Storage();

// Initialize storage
export const initStorage = async () => {
  await storage.create();
};

// Save data to storage
export const setData = async <T>(key: string, value: T): Promise<void> => {
  await storage.set(key, value);
};

// Get data from storage
export const getData = async <T>(key: string): Promise<T | null> => {
  const data = await storage.get(key);
  return data;
};

// Storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions'
} as const; 
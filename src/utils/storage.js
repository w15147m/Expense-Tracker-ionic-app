import { Storage } from '@ionic/storage';

// Create a storage instance
const storage = new Storage();

// Initialize storage
export const initStorage = async () => {
  await storage.create();
};

// Save data to storage
export const setData = async (key, value) => {
  // Convert arrays and objects to JSON strings
  const serializedValue = JSON.stringify(value);
  await storage.set(key, serializedValue);
};

// Get data from storage
export const getData = async (key) => {
  const data = await storage.get(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      return null;
    }
  }
  return null;
};

// Storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions'
}; 
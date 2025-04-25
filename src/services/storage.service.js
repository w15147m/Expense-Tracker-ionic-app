import { Storage } from '@ionic/storage';

const TRANSACTIONS_KEY = 'transactions';

class StorageService {
  constructor() {
    this.storage = new Storage();
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async getTransactions() {
    try {
      const transactions = await this.storage.get(TRANSACTIONS_KEY);
      if (!transactions) return [];
      
      // Ensure transactions is an array
      if (!Array.isArray(transactions)) {
        console.warn('Transactions data is corrupted, resetting to empty array');
        await this.saveTransactions([]);
        return [];
      }
      
      // Ensure amounts are numbers
      return transactions.map(t => ({
        ...t,
        amount: Number(t.amount)
      }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async saveTransactions(transactions) {
    await this.storage.set(TRANSACTIONS_KEY, transactions);
  }

  async addTransaction(transaction) {
    const transactions = await this.getTransactions();
    transactions.push({
      ...transaction,
      amount: Number(transaction.amount)
    });
    await this.saveTransactions(transactions);
    return transactions;
  }

  async editTransaction(id, updatedTransaction) {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...updatedTransaction,
        amount: Number(updatedTransaction.amount)
      };
      await this.saveTransactions(transactions);
    }
    return transactions;
  }

  async deleteTransaction(id) {
    const transactions = await this.getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await this.saveTransactions(updatedTransactions);
    return updatedTransactions;
  }
}

export const storageService = new StorageService(); 
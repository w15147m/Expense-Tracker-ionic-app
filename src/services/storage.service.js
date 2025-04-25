import { Storage } from '@ionic/storage';
import { authService } from './auth.service';

class StorageService {
  constructor() {
    this.storage = new Storage();
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  getUserTransactionsKey(userEmail) {
    return `transactions_${userEmail}`;
  }

  async getTransactions() {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.warn('No user logged in');
        return [];
      }

      const transactions = await this.storage.get(this.getUserTransactionsKey(currentUser.email));
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
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      console.warn('No user logged in, cannot save transactions');
      return;
    }
    await this.storage.set(this.getUserTransactionsKey(currentUser.email), transactions);
  }

  async addTransaction(transaction) {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      console.warn('No user logged in, cannot add transaction');
      return [];
    }

    const transactions = await this.getTransactions();
    transactions.push({
      ...transaction,
      amount: Number(transaction.amount),
      userId: currentUser.email // Add user ID to transaction
    });
    await this.saveTransactions(transactions);
    return transactions;
  }

  async editTransaction(id, updatedTransaction) {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      console.warn('No user logged in, cannot edit transaction');
      return [];
    }

    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === id && t.userId === currentUser.email);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...updatedTransaction,
        amount: Number(updatedTransaction.amount),
        userId: currentUser.email
      };
      await this.saveTransactions(transactions);
    }
    return transactions;
  }

  async deleteTransaction(id) {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      console.warn('No user logged in, cannot delete transaction');
      return [];
    }

    const transactions = await this.getTransactions();
    const updatedTransactions = transactions.filter(t => !(t.id === id && t.userId === currentUser.email));
    await this.saveTransactions(updatedTransactions);
    return updatedTransactions;
  }
}

export const storageService = new StorageService(); 
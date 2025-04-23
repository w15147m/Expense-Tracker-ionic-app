<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center app-title">💰 Expense Tracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding gradient-background">
      <div class="balance-section">
        <h2 class="balance-label">YOUR BALANCE</h2>
        <h1 class="balance-amount">${{ totalBalance.toFixed(2) }}</h1>

        <ion-card class="summary-card">
          <ion-row>
            <ion-col>
              <div class="income-expense">
                <h3>INCOME</h3>
                <p class="income">+${{ totalIncome.toFixed(2) }}</p>
              </div>
            </ion-col>
            <ion-col class="divider">
              <div class="income-expense">
                <h3>EXPENSE</h3>
                <p class="expense">-${{ totalExpense.toFixed(2) }}</p>
              </div>
            </ion-col>
          </ion-row>
        </ion-card>
      </div>

      <div class="history-section">
        <h2 class="section-title">
          <ion-icon :icon="timeOutline"></ion-icon>
          History
        </h2>
        <div class="scrollable-list">
          <ion-list class="transaction-list">
            <ion-item-sliding v-for="transaction in transactions" :key="transaction.id">
              <ion-item 
                lines="none" 
                class="transaction-item" 
                :class="transaction.amount > 0 ? 'income-border' : 'expense-border'"
                @click="openEditModal(transaction)"
              >
                <ion-label>
                  <h2>{{ transaction.text }}</h2>
                  <p>{{ new Date().toLocaleDateString() }}</p>
                </ion-label>
                <div class="amount-container">
                  <ion-note :class="transaction.amount > 0 ? 'income-text' : 'expense-text'">
                    {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
                  </ion-note>
                  <ion-button 
                    fill="clear" 
                    class="delete-button" 
                    @click.stop="(event) => handleDelete(event, transaction.id)"
                  >
                    <ion-icon :icon="trashOutline" color="danger"></ion-icon>
                  </ion-button>
                </div>
              </ion-item>
            </ion-item-sliding>
          </ion-list>
        </div>
      </div>
    </ion-content>

    <!-- Floating Action Button -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openModal" class="fab-button">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- Modal for Adding Transaction -->
    <ion-modal :is-open="isModalOpen" @didDismiss="closeModal" class="transaction-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Transaction</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card class="form-card">
          <ion-card-content>
            <ion-item class="custom-input">
              <ion-label position="floating">Description</ion-label>
              <ion-input v-model="newTransaction.text" placeholder="What's this transaction?"></ion-input>
            </ion-item>

            <ion-item class="custom-input">
              <ion-label position="floating">Amount</ion-label>
              <ion-input 
                v-model="newTransaction.amount" 
                type="number" 
                placeholder="Enter amount (- for expense)"
                :class="newTransaction.amount && newTransaction.amount > 0 ? 'income-input' : newTransaction.amount < 0 ? 'expense-input' : ''">
              </ion-input>
            </ion-item>

            <ion-button expand="block" @click="addTransaction" class="add-button" :disabled="!isValidTransaction">
              <ion-icon :icon="addOutline"></ion-icon>
              Add Transaction
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>

    <!-- Modal for Editing Transaction -->
    <ion-modal :is-open="isEditModalOpen" @didDismiss="closeEditModal" class="transaction-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Edit Transaction</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeEditModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card class="form-card">
          <ion-card-content>
            <ion-item class="custom-input">
              <ion-label position="floating">Description</ion-label>
              <ion-input v-model="editingTransaction.text" placeholder="What's this transaction?"></ion-input>
            </ion-item>

            <ion-item class="custom-input">
              <ion-label position="floating">Amount</ion-label>
              <ion-input 
                v-model="editingTransaction.amount" 
                type="number" 
                placeholder="Enter amount (- for expense)"
                :class="editingTransaction.amount && editingTransaction.amount > 0 ? 'income-input' : editingTransaction.amount < 0 ? 'expense-input' : ''">
              </ion-input>
            </ion-item>

            <ion-button expand="block" @click="updateTransaction" class="add-button" :disabled="!isValidEditTransaction">
              <ion-icon :icon="addOutline"></ion-icon>
              Update Transaction
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>

    <ion-alert
      :is-open="showDeleteAlert"
      header="Delete Transaction"
      message="Are you sure you want to delete this transaction?"
      :buttons="[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            showDeleteAlert.value = false;
            transactionToDelete.value = null;
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: confirmDelete
        }
      ]"
      @didDismiss="showDeleteAlert = false"
    ></ion-alert>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { timeOutline, addOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { initStorage, setData, getData, STORAGE_KEYS } from '../utils/storage';

// Import Ionic components
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonNote,
  IonCardContent,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonAlert
} from '@ionic/vue';

const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const transactions = ref([]);
const editingTransaction = ref({
  id: 0,
  text: '',
  amount: 0
});

const newTransaction = ref({
  text: '',
  amount: ''
});

const showDeleteAlert = ref(false);
const transactionToDelete = ref(null);

const isValidTransaction = computed(() => {
  return newTransaction.value.text && newTransaction.value.amount;
});

const isValidEditTransaction = computed(() => {
  return editingTransaction.value.text && editingTransaction.value.amount;
});

const totalBalance = computed(() => {
  return transactions.value.reduce((acc, curr) => acc + curr.amount, 0);
});

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter(t => t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  newTransaction.value.text = '';
  newTransaction.value.amount = '';
};

const openEditModal = (transaction) => {
  editingTransaction.value = { ...transaction };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingTransaction.value = {
    id: 0,
    text: '',
    amount: 0
  };
};

const addTransaction = async () => {
  try {
    if (isValidTransaction.value) {
      const newTransactionItem = {
        id: Date.now(),
        text: newTransaction.value.text,
        amount: parseFloat(newTransaction.value.amount)
      };
      
      transactions.value.push(newTransactionItem);
      await setData(STORAGE_KEYS.TRANSACTIONS, transactions.value);
      closeModal();
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
    // You could add a toast notification here
  }
};

const updateTransaction = async () => {
  try {
    if (editingTransaction.value && isValidEditTransaction.value) {
      const index = transactions.value.findIndex(t => t.id === editingTransaction.value?.id);
      if (index !== -1) {
        transactions.value[index] = {
          id: editingTransaction.value.id,
          text: editingTransaction.value.text || '',
          amount: Number(editingTransaction.value.amount)
        };
        await setData(STORAGE_KEYS.TRANSACTIONS, transactions.value);
        closeEditModal();
      }
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    // You could add a toast notification here
  }
};

const handleDelete = (event, id) => {
  event.stopPropagation();
  transactionToDelete.value = id;
  showDeleteAlert.value = true;
};

const confirmDelete = async () => {
  if (transactionToDelete.value) {
    await deleteTransaction(transactionToDelete.value);
    transactionToDelete.value = null;
  }
};

const deleteTransaction = async (id) => {
  try {
    transactions.value = transactions.value.filter(t => t.id !== id);
    await setData(STORAGE_KEYS.TRANSACTIONS, transactions.value);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    // You could add a toast notification here
  }
};

// Initialize storage and load transactions
onMounted(async () => {
  try {
    await initStorage();
    const storedTransactions = await getData(STORAGE_KEYS.TRANSACTIONS);
    if (storedTransactions) {
      transactions.value = storedTransactions;
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
    // You could add a toast notification here
  }
});
</script>

<style scoped>
.gradient-background {
  --background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3a 100%);
}

.app-title {
  font-weight: 700;
  font-size: 1.3rem;
  color: #e0e0e0;
}

.balance-section {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.balance-label {
  color: #a0a0a0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
  color: #ffffff;
}

.summary-card {
  margin: 20px 0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(40, 40, 50, 0.8);
}

.income-expense {
  text-align: center;
  padding: 20px 0;
}

.income-expense h3 {
  margin: 0;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 600;
  color: #a0a0a0;
}

.divider {
  border-left: 1px solid #3a3a4a;
}

.income {
  color: #4caf50;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 10px 0;
}

.expense {
  color: #f44336;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 10px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 16px;
}

.section-title ion-icon {
  font-size: 1.4rem;
  color: #4caf50;
}

.transaction-list {
  background: transparent;
}

.transaction-item {
  --background: rgba(40, 40, 50, 0.8);
  margin-bottom: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.transaction-item h2 {
  font-weight: 600;
  font-size: 1rem;
  color: #e0e0e0;
}

.transaction-item p {
  font-size: 0.8rem;
  color: #a0a0a0;
}

.income-border {
  border-left: 4px solid #4caf50;
}

.expense-border {
  border-left: 4px solid #f44336;
}

.income-text {
  color: #4caf50;
  font-weight: 700;
  font-size: 1.1rem;
}

.expense-text {
  color: #f44336;
  font-weight: 700;
  font-size: 1.1rem;
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(40, 40, 50, 0.8);
}

.custom-input {
  --background: transparent;
  margin-bottom: 16px;
}

.custom-input ion-label {
  color: #e0e0e0;
}

.income-input {
  color: #4caf50;
}

.expense-input {
  color: #f44336;
}

.add-button {
  margin-top: 20px;
  --background: #4caf50;
  --background-hover: #45a049;
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
}

ion-item {
  --padding-start: 0;
}

ion-list {
  padding: 0;
}

/* Add these new styles for better hover and active states */
.transaction-item:hover {
  --background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.add-button:hover {
  opacity: 0.9;
}

ion-item-option {
  --background: #f44336;
}

.scrollable-list {
  max-height: calc(100vh - 380px);
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}

.scrollable-list::-webkit-scrollbar {
  width: 6px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 3px;
}

.fab-button {
  --background: #4caf50;
  --background-hover: #45a049;
  --background-activated: #45a049;
  margin-bottom: 16px;
  margin-right: 16px;
}

.transaction-modal {
  --height: 400px;
  --border-radius: 16px 16px 0 0;
}

.transaction-modal ion-toolbar {
  --background: #1e1e2e;
  --color: white;
}

.transaction-modal ion-toolbar ion-button {
  --color: white;
}

@media (min-width: 768px) {
  .transaction-modal {
    --width: 400px;
    --height: 450px;
    --border-radius: 16px;
  }
}

/* Ensure the form card in modal has no duplicate shadows */
.transaction-modal .form-card {
  box-shadow: none;
  background: transparent;
}

.amount-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-button {
  --padding-start: 4px;
  --padding-end: 4px;
  height: 24px;
  margin: 0;
}

.delete-button ion-icon {
  font-size: 18px;
}
</style>

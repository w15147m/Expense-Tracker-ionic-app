<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center app-title">💰 Expense Tracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding gradient-background">
      <BalanceCard :transactions="transactions" />
      <TransactionList :transactions="transactions" @delete="deleteTransaction" />
    </ion-content>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openModal" class="fab-button">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <AddTransactionModal 
      :is-open="isModalOpen" 
      @close="closeModal" 
      @add="addTransaction"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { ref } from 'vue';
import { addOutline } from 'ionicons/icons';
import BalanceCard from '@/components/BalanceCard.vue';
import TransactionList from '@/components/TransactionList.vue';
import AddTransactionModal from '@/components/AddTransactionModal.vue';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

const isModalOpen = ref(false);
const transactions = ref<Transaction[]>([
  { id: 1, text: 'Flower', amount: -19.99 },
  { id: 2, text: 'Salary', amount: 299.97 },
  { id: 3, text: 'Book', amount: -10 },
  { id: 4, text: 'Camera', amount: 150 }
]);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const addTransaction = (transaction: { text: string; amount: number }) => {
  transactions.value.push({
    id: Date.now(),
    ...transaction
  });
};

const deleteTransaction = (id: number) => {
  transactions.value = transactions.value.filter(t => t.id !== id);
};
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

.fab-button {
  --background: #4caf50;
  --background-hover: #45a049;
  --background-activated: #45a049;
  margin-bottom: 16px;
  margin-right: 16px;
}
</style>

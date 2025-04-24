<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center app-title">💰 Expense Tracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding gradient-background">
      <BalanceCard :transactions="transactions" />
      <TransactionList :transactions="transactions" @delete="deleteTransaction" @edit="editTransaction" />
    </ion-content>

    <ion-fab vertical="bottom" horizontal="end" :fixed="true">
      <ion-fab-button @click="openModal" class="fab-button">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <AddTransactionModal 
      :is-open="isModalOpen" 
      @close="closeModal" 
      @add="addTransaction"
    />
  </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { add } from 'ionicons/icons';
import BalanceCard from '@/components/BalanceCard.vue';
import TransactionList from '@/components/TransactionList.vue';
import AddTransactionModal from '@/components/AddTransactionModal.vue';
import { storageService } from '@/services/storage.service';

const isModalOpen = ref(false);
const transactions = ref([]);

onMounted(async () => {
  transactions.value = await storageService.getTransactions();
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const addTransaction = async (transaction) => {
  const newTransaction = {
    id: Date.now(),
    ...transaction
  };
  transactions.value = await storageService.addTransaction(newTransaction);
};

const editTransaction = async (transaction) => {
  transactions.value = await storageService.editTransaction(transaction.id, transaction);
};

const deleteTransaction = async (id) => {
  transactions.value = await storageService.deleteTransaction(id);
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

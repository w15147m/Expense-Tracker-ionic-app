<template>
  <div class="history-section">
    <h2 class="section-title">
      <ion-icon name="time-outline"></ion-icon>
      History
    </h2>
    <div class="scrollable-list">
      <ion-list class="transaction-list">
        <TransactionItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          @delete="onDelete"
          @edit="onEdit"
        />
      </ion-list>
    </div>
  </div>
</template>

<script setup>
import { IonList, IonIcon } from '@ionic/vue';
import TransactionItem from './TransactionItem.vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit']);

const onDelete = (id) => {
  emit('delete', id);
};

const onEdit = (transaction) => {
  emit('edit', transaction);
};
</script>

<style scoped>
.history-section {
  margin-top: 24px;
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

ion-list {
  padding: 0;
}
</style> 
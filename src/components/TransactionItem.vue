<template>
  <ion-item-sliding>
    <ion-item lines="none" class="transaction-item" :class="transaction.amount > 0 ? 'income-border' : 'expense-border'">
      <ion-label>
        <h2>{{ transaction.text }}</h2>
        <p>{{ new Date().toLocaleDateString() }}</p>
      </ion-label>
      <ion-note :class="transaction.amount > 0 ? 'income-text' : 'expense-text'">
        {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
      </ion-note>
    </ion-item>
    <ion-item-options side="end">
      <ion-item-option color="danger" @click="$emit('delete', transaction.id)">
        <ion-icon :icon="trashOutline"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script setup>
import { IonItemSliding, IonItem, IonLabel, IonNote, IonItemOption, IonItemOptions, IonIcon } from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});

defineEmits(['delete']);
</script>

<style scoped>
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

.transaction-item:hover {
  --background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

ion-item-option {
  --background: #f44336;
}
</style> 
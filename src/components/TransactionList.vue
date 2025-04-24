<template>
  <div class="m-t-24">
    <h2 class="d-flex align-center gap-8 fs-20 text-white m-b-16">
      <ion-icon name="time-outline" class="fs-24 text-success"></ion-icon>
      History
    </h2>
    <div class="h-calc-100vh-380 overflow-y-auto pd-r-8 m-r-n8 scrollbar-custom">
      <ion-list class="bg-transparent pd-0">
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
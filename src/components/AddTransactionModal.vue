<template>
  <ion-modal :is-open="isOpen" @didDismiss="onClose" class="h-px-400 br-16 br-t-16 br-b-0">
    <ion-header>
      <ion-toolbar class="bg-dark text-white">
        <ion-title>Add Transaction</ion-title>
        <template v-slot:end>
          <ion-buttons>
            <ion-button @click="onClose" class="text-white">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </template>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="br-16 bg-dark-50 pd-20">
        <ion-card-content>
          <div class="m-b-20">
            <ion-item class="bg-transparent pd-0 m-b-8">
              <ion-label position="stacked" class="text-white m-b-8">Description</ion-label>
              <ion-input 
                v-model="newTransaction.text" 
                placeholder="What's this transaction?"
                class="bg-white-10 br-8 pd-12 text-white">
              </ion-input>
            </ion-item>
          </div>

          <div class="m-b-20">
            <ion-item class="bg-transparent pd-0 m-b-8">
              <ion-label position="stacked" class="text-white m-b-8">Amount</ion-label>
              <ion-input 
                v-model="newTransaction.amount" 
                type="number" 
                placeholder="Enter amount (- for expense)"
                class="bg-white-10 br-8 pd-12"
                :class="newTransaction.amount && newTransaction.amount > 0 ? 'text-success' : newTransaction.amount < 0 ? 'text-danger' : 'text-white'">
              </ion-input>
            </ion-item>
          </div>

          <ion-button expand="block" @click="onAdd" class="bg-success br-12 fw-600 h-px-48 m-t-24" :disabled="!isValidTransaction">
            <ion-icon :icon="addOutline"></ion-icon>
            Add Transaction
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
         IonIcon, IonContent, IonCard, IonCardContent, IonItem, IonLabel, 
         IonInput } from '@ionic/vue';
import { ref, computed } from 'vue';
import { addOutline, closeOutline } from 'ionicons/icons';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'add']);

const newTransaction = ref({
  text: '',
  amount: 0
});

const isValidTransaction = computed(() => {
  return newTransaction.value.text && newTransaction.value.amount !== 0;
});

const onClose = () => {
  newTransaction.value = { text: '', amount: 0 };
  emit('close');
};

const onAdd = () => {
  if (isValidTransaction.value) {
    emit('add', {
      text: newTransaction.value.text,
      amount: Number(newTransaction.value.amount)
    });
    onClose();
  }
};
</script>

<style>
@media (min-width: 768px) {
  ion-modal {
    --width: 400px;
    --height: 450px;
    --border-radius: 16px;
  }
}

/* Fix for Ionic input overlapping */
ion-item::part(native) {
  padding: 0;
}

ion-input::part(native) {
  padding: 0;
}
</style> 
<template>
  <ion-modal :is-open="isOpen" @didDismiss="onClose" class="transaction-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Transaction</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="onClose">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="form-card">
        <ion-card-content>
          <div class="form-group">
            <ion-item class="custom-input">
              <ion-label position="stacked">Description</ion-label>
              <ion-input 
                v-model="newTransaction.text" 
                placeholder="What's this transaction?"
                class="input-field">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-item class="custom-input">
              <ion-label position="stacked">Amount</ion-label>
              <ion-input 
                v-model="newTransaction.amount" 
                type="number" 
                placeholder="Enter amount (- for expense)"
                class="input-field"
                :class="newTransaction.amount && newTransaction.amount > 0 ? 'income-input' : newTransaction.amount < 0 ? 'expense-input' : ''">
              </ion-input>
            </ion-item>
          </div>

          <ion-button expand="block" @click="onAdd" class="add-button" :disabled="!isValidTransaction">
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
      amount: newTransaction.value.amount
    });
    onClose();
  }
};
</script>

<style scoped>
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

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(40, 40, 50, 0.8);
}

.form-group {
  margin-bottom: 20px;
}

.custom-input {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  margin-bottom: 8px;
}

.custom-input ion-label {
  color: #e0e0e0;
  margin-bottom: 8px;
}

.input-field {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  --placeholder-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.income-input {
  color: #4caf50;
}

.expense-input {
  color: #f44336;
}

.add-button {
  margin-top: 24px;
  --background: #4caf50;
  --background-hover: #45a049;
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
}

.add-button:hover {
  opacity: 0.9;
}

@media (min-width: 768px) {
  .transaction-modal {
    --width: 400px;
    --height: 450px;
    --border-radius: 16px;
  }
}

.transaction-modal .form-card {
  box-shadow: none;
  background: transparent;
}

/* Fix for Ionic input overlapping */
ion-item::part(native) {
  padding: 0;
}

ion-input::part(native) {
  padding: 0;
}
</style> 
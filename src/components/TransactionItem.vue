<template>
  <ion-item-sliding>
    <ion-item button lines="none" class="transaction-item" :class="transaction.amount > 0 ? 'income-border' : 'expense-border'" @click="handleEdit">
      <ion-label>
        <h2>{{ transaction.text }}</h2>
        <p>{{ new Date().toLocaleDateString() }}</p>
      </ion-label>
      <ion-note :class="transaction.amount > 0 ? 'income-text' : 'expense-text'">
        {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
      </ion-note>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="danger" @click="confirmDelete">
        <div class="option-button">
          <ion-icon :icon="trashOutline"></ion-icon>
          Delete
        </div>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Edit Modal -->
  <ion-modal :is-open="isEditModalOpen" @didDismiss="closeEditModal" class="transaction-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Edit Transaction</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeEditModal">
            <ion-icon :icon="closeCircleOutline"></ion-icon>
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
                v-model="editedTransaction.text" 
                placeholder="What's this transaction?"
                class="input-field">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-item class="custom-input">
              <ion-label position="stacked">Amount</ion-label>
              <ion-input 
                v-model="editedTransaction.amount" 
                type="number" 
                placeholder="Enter amount (- for expense)"
                class="input-field"
                :class="editedTransaction.amount && editedTransaction.amount > 0 ? 'income-input' : editedTransaction.amount < 0 ? 'expense-input' : ''">
              </ion-input>
            </ion-item>
          </div>

          <ion-button expand="block" @click="saveEdit" class="save-button" :disabled="!isValidEdit">
            <ion-icon :icon="checkmarkCircleOutline" class="button-icon"></ion-icon>
            Save Changes
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>

  <!-- Delete Alert -->
  <ion-alert
    :is-open="isDeleteAlertOpen"
    header="Confirm Delete"
    message="Are you sure you want to delete this transaction?"
    :buttons="[
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        role: 'confirm',
        handler: () => handleDelete(),
      },
    ]"
    @didDismiss="isDeleteAlertOpen = false"
  ></ion-alert>
</template>

<script setup>
import { IonItemSliding, IonItem, IonLabel, IonNote, IonItemOption, IonItemOptions, IonIcon,
         IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
         IonCard, IonCardContent, IonInput, IonAlert } from '@ionic/vue';
import { trashOutline, closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { ref, computed } from 'vue';

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit']);

const isEditModalOpen = ref(false);
const isDeleteAlertOpen = ref(false);
const editedTransaction = ref({
  text: '',
  amount: 0
});

const isValidEdit = computed(() => {
  return editedTransaction.value.text && editedTransaction.value.amount !== 0;
});

const handleEdit = () => {
  editedTransaction.value = { ...props.transaction };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const saveEdit = () => {
  emit('edit', {
    id: props.transaction.id,
    text: editedTransaction.value.text,
    amount: Number(editedTransaction.value.amount)
  });
  closeEditModal();
};

const confirmDelete = () => {
  isDeleteAlertOpen.value = true;
};

const handleDelete = () => {
  emit('delete', props.transaction.id);
};
</script>

<style scoped>
.transaction-item {
  --background: rgba(40, 40, 50, 0.8);
  margin-bottom: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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
  --background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.option-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

.option-button ion-icon {
  font-size: 1.4rem;
  margin-bottom: 4px;
}

ion-item-option {
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  font-size: 0.9rem;
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

.save-button {
  margin-top: 24px;
  --background: #4caf50;
  --background-hover: #45a049;
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
}

.button-icon {
  margin-right: 8px;
}

.save-button:hover {
  opacity: 0.9;
}

@media (min-width: 768px) {
  .transaction-modal {
    --width: 400px;
    --height: 450px;
    --border-radius: 16px;
  }
}
</style> 
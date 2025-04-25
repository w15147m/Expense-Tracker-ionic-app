<template>
  <div class="balance-section">
    <h2 class="balance-label">YOUR BALANCE</h2>
    <h1 class="balance-amount">${{ totalBalance.toFixed(2) }}</h1>
    <ion-card class="summary-card">
      <ion-row>
        <ion-col>
          <div class="income-expense">
            <h3>INCOME</h3>
            <p class="income">+${{ totalIncome.toFixed(0) }}</p>
          </div>
        </ion-col>
        <ion-col class="divider">
          <div class="income-expense">
            <h3>EXPENSE</h3>
            <p class="expense">-${{ totalExpense.toFixed(0) }}</p>
          </div>
        </ion-col>
      </ion-row>
    </ion-card>
  </div>
</template>

<script setup>
import { IonCard, IonRow, IonCol } from '@ionic/vue';
import { computed } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const totalBalance = computed(() => {
  return props.transactions.reduce((acc, curr) => acc + curr.amount, 0);
});

const totalIncome = computed(() => {
  return props.transactions
    .filter(t => t.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
});

const totalExpense = computed(() => {
  return props.transactions
    .filter(t => t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
});
</script>

<style scoped>
.balance-section {
  text-align: center;
  margin-bottom: 24px;
  padding: 10px;
}

.balance-label {
  color: #a0a0a0;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.balance-amount {
  font-size: 40px;
  font-weight: 700;
  margin: 10px 0;
  color: #ffffff;
}

.summary-card {
  margin: 15px 0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(40, 40, 50, 0.8);
}

.income-expense {
  text-align: center;
  padding: 10px;
}

.income-expense h3 {
  margin: 0;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  color: #a0a0a0;
}

.divider {
  border-left: 1px solid #3a3a4a;
}

.income {
  color: #4caf50;
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0;
}

.expense {
  color: #f44336;
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0;
}
</style> 
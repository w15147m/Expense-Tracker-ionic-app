<template>
  <div class="text-center m-b-24 pd-20">
    <h2 class="text-gray-400 fs-16 fw-600 m-0">YOUR BALANCE</h2>
    <h1 class="fs-40 fw-700 m-10-0 text-white">${{ totalBalance.toFixed(2) }}</h1>

    <ion-card class="br-16 shadow-4 bg-dark-50 m-20-0">
      <ion-row>
        <ion-col>
          <div class="text-center pd-20">
            <h3 class="m-0 text-uppercase fs-14 fw-600 text-gray-400">INCOME</h3>
            <p class="text-success fs-24 fw-700 m-10-0">+${{ totalIncome.toFixed(2) }}</p>
          </div>
        </ion-col>
        <ion-col class="border-l-1 border-dark-100">
          <div class="text-center pd-20">
            <h3 class="m-0 text-uppercase fs-14 fw-600 text-gray-400">EXPENSE</h3>
            <p class="text-danger fs-24 fw-700 m-10-0">-${{ totalExpense.toFixed(2) }}</p>
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
</style> 
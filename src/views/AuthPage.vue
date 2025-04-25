<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-container">
        <login-form 
          v-if="currentForm === 'LoginForm'"
          @switch-to-register="currentForm = 'RegisterForm'"
          :initial-credentials="loginCredentials"
        />
        <register-form 
          v-if="currentForm === 'RegisterForm'"
          @switch-to-login="switchToLogin()"
          @switch-to-login-with-credentials="switchToLoginWithCredentials"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';

const currentForm = ref('LoginForm');
const loginCredentials = ref(null);

const switchToLogin = () => {
  loginCredentials.value = null;
  currentForm.value = 'LoginForm';
};

const switchToLoginWithCredentials = (credentials) => {
  loginCredentials.value = credentials;
  currentForm.value = 'LoginForm';
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style> 
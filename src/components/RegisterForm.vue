<template>
  <div class="register-container">
    <ion-card class="auth-card">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Sign up to get started</p>
      </div>
      <ion-card-content>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div class="form-group">
          <ion-item class="custom-input" lines="none">
            <ion-label position="stacked">Name</ion-label>
            <ion-input
              v-model="name"
              type="text"
              placeholder="Enter your name"
            ></ion-input>
          </ion-item>
        </div>

        <div class="form-group">
          <ion-item class="custom-input" lines="none">
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              v-model="email"
              type="email"
              placeholder="Enter your email"
            ></ion-input>
          </ion-item>
        </div>

        <div class="form-group">
          <ion-item class="custom-input" lines="none">
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              v-model="password"
              type="password"
              placeholder="Choose a password"
            ></ion-input>
          </ion-item>
        </div>

        <ion-button 
          expand="block" 
          @click="handleRegister" 
          class="register-button"
          :disabled="isLoading"
        >
          <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          <span v-else>Create Account</span>
        </ion-button>

        <div class="divider">
          <span>or</span>
        </div>

        <div class="login-prompt">
          <span>Already have an account?</span>
          <ion-button fill="clear" @click="$emit('switch-to-login')" class="login-link">
            Sign In
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/auth.service';
import { useRouter } from 'vue-router';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  toastController
} from '@ionic/vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const showToast = async (message, color = 'success') => {
  const toast = await toastController.create({
    message: message,
    duration: 2000,
    position: 'top',
    color: color
  });
  await toast.present();
};

const handleRegister = async () => {
  try {
    errorMessage.value = '';
    successMessage.value = '';
    isLoading.value = true;

    if (!name.value || !email.value || !password.value) {
      errorMessage.value = 'Please fill in all fields';
      return;
    }

    const result = await authService.register({
      name: name.value,
      email: email.value,
      password: password.value
    });

    if (result.success) {
      successMessage.value = 'Registration successful!';
      await showToast('Registration successful! Redirecting to login...');
      
      // Emit credentials to parent for login form
      const credentials = {
        email: email.value,
        password: password.value
      };
      
      // Small delay to show success message
      setTimeout(() => {
        $emit('switch-to-login-with-credentials', credentials);
      }, 1500);
    }
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.';
    await showToast(errorMessage.value, 'danger');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-card {
  max-width: 400px;
  width: 100%;
  border-radius: 20px;
  background: #1e1e1e;
  margin: 0;
}

.auth-header {
  padding: 24px 24px 0;
  text-align: left;
}

.auth-header h1 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
}

.auth-header p {
  margin: 8px 0 0;
  color: #8e8e93;
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
}

.custom-input {
  --background: #2c2c2e;
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  margin: 8px 0;
}

.custom-input ion-label {
  color: #8e8e93;
  margin-bottom: 4px;
}

.custom-input ion-input {
  --padding-top: 8px;
  --padding-bottom: 8px;
  --placeholder-color: #666;
  --color: #fff;
}

.error-message {
  color: #ff4961;
  background-color: rgba(255, 73, 97, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  color: #2fdf75;
  background-color: rgba(47, 223, 117, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.register-button {
  --background: #5856d6;
  --border-radius: 12px;
  --box-shadow: none;
  margin: 24px 0 16px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
}

.register-button ion-spinner {
  width: 24px;
  height: 24px;
}

.divider {
  text-align: center;
  position: relative;
  margin: 16px 0;
  color: #8e8e93;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #3a3a3c;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: #1e1e1e;
  padding: 0 10px;
  font-size: 14px;
}

.login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  color: #8e8e93;
  font-size: 14px;
}

.login-link {
  --color: #5856d6;
  font-weight: 600;
  text-transform: none;
  font-size: 14px;
  height: 20px;
  margin: 0;
  --padding-start: 4px;
  --padding-end: 4px;
}
</style> 
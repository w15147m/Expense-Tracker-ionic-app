<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleLogout">Logout</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card v-if="user">
        <ion-card-header>
          <ion-card-title>Welcome, {{ user.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>Email</ion-label>
              <ion-text>{{ user.email }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-label>Name</ion-label>
              <ion-text>{{ user.name }}</ion-text>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonButtons
} from '@ionic/vue';

const router = useRouter();
const user = ref(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const handleLogout = async () => {
  try {
    await authService.logout();
    router.push('/auth');
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
};
</script> 
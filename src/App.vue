<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { authService } from './services/auth.service';

const router = useRouter();

onMounted(async () => {
  // Initialize auth service and redirect to auth page
  await authService.init();
  router.push('/auth');
});
</script>

<style>
/* Your global styles here */
</style>

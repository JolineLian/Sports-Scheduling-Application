<template>
    <div>
      <p v-if="userId">User ID: {{ userId }}</p>
      <!-- <button @click="logout">Logout</button> -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const secureMessage = ref('');
  const userId = ref('');
  
  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };
  
  onMounted(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://sports-scheduling-application.onrender.com/api/dashboard-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      secureMessage.value = response.data.message;
      userId.value = response.data.userId;
    } catch (err) {
      alert('Session expired or token invalid.');
      logout();
    }
  });
  </script>
  
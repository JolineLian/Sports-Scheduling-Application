<template>
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const router = useRouter();
  
  onMounted(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');  // Redirect to login if no token is found
    }
  });
  </script>
  
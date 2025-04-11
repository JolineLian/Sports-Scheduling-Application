<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="loginUser">
        <div>
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
          />
        </div>
  
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
  
        <button type="submit">Login</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const loginUser = async () => {
    try {
      const response = await axios.post('https://sports-scheduling-application.onrender.com/api/login', {
        username: username.value,
        password: password.value
      });
  
      // Save the JWT token to localStorage
      localStorage.setItem('token', response.data.token);
  
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      errorMessage.value = 'Invalid username or password';
    }
  };
  </script>
  
<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <button
      @click="guestLogin">Continue as Guest</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth.js';
  
  const { setToken } = useAuth();
  const router = useRouter();
  
  const username = ref('');
  const password = ref('');
  
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username: username.value,
        password: password.value
      });
      setToken(response.data.token);
      router.push('/dashboard');
    } catch {
      alert('Invalid login');
    }
  };
  
  const guestLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/guest-login');
      setToken(response.data.token);
      router.push('/dashboard/events');
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };
  </script>
  
<!-- <template>
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
      const response = await axios.post('http://localhost:8000/api/login', {
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
  </script> -->
  
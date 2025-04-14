<template>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5">
            <div class="box">
              <h2 class="title is-4 has-text-centered">Login</h2>
  
              <form @submit.prevent="login">
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      v-model="username"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
  
                <div class="field">
                  <label class="label">Password</label>
                  <div class="control">
                    <input
                      class="input"
                      type="password"
                      v-model="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
  
                <div class="field">
                  <div class="control">
                    <button class="button is-primary is-fullwidth">Login</button>
                  </div>
                </div>
              </form>
  
              <hr />
  
              <div class="field">
                <div class="control">
                  <button class="button is-light is-fullwidth" @click="guestLogin">
                    Continue as Guest
                  </button>
                </div>
              </div>
  
              <p class="has-text-danger has-text-centered" v-if="errorMessage">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const errorMessage = ref('');
  
  const login = async () => {
    try {
      const response = await axios.post('https://sports-scheduling-application.onrender.com/api/login', {
        username: username.value,
        password: password.value,
      });
  
      setToken(response.data.token);
      router.push('/dashboard/events');
    } catch {
      errorMessage.value = 'Invalid username or password';
    }
  };
  
  const guestLogin = async () => {
    try {
      const response = await axios.post('https://sports-scheduling-application.onrender.com/api/guest-login');
      setToken(response.data.token);
      router.push('/dashboard/events');
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };
  </script>
  
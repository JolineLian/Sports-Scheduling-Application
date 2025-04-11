<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <svg width="640" height="160" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Your SVG code here -->
          </svg>
        </a>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
  
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <Router-link class="navbar-item" to="/">
            Events
          </Router-link>
          <Router-link class="navbar-item" to="/leagues">
            Leagues
          </Router-link>
          <Router-link class="navbar-item">
            Teams
          </Router-link>
        </div>
  
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <Router-link v-if="!isLoggedIn" class="button is-light" to="/login">
                Log in
              </Router-link>
              <button v-if="isLoggedIn" class="button is-light" @click="logout">
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Check if the user is logged in by checking if the token exists in localStorage
  const isLoggedIn = computed(() => {
    return localStorage.getItem('token') !== null;
  });
  
  const router = useRouter();
  
  // Logout method
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the events page
    router.push('/');
  };
  </script>
  
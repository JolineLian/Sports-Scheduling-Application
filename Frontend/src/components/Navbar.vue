<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item brand-title" href="#">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-calendar-alt"></i>
          </span>
          <span><strong>Sports</strong><span class="schedule-text">Schedule</span></span>
        </span>
        </a>
        <a 
        role="button" 
        class="navbar-burger" 
        aria-label="menu" aria-expanded="false" 
        :class="{ 'is-active': isHamburgerOpen }"
        @click="openHamburgerMenu"
        data-target="narbarMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
      </div>
  
      <div 
      id="navbarMenu" 
      class="navbar-menu"
      :class="{ 'is-active': isHamburgerOpen }">
        <div class="navbar-start">
            <Router-link v-if="isLoggedIn" class="navbar-item" to="/dashboard/events">
                Events
            </Router-link>

            <!-- Only show these if the user is an admin -->
            <Router-link v-if="isLoggedIn && isAdmin" class="navbar-item" to="/dashboard/leagues">
                Leagues
            </Router-link>
            <Router-link v-if="isLoggedIn && isAdmin" class="navbar-item" to="/dashboard/teams">
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
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { ref } from 'vue';

const router = useRouter();
const { isLoggedIn, isAdmin, setToken } = useAuth();
const isHamburgerOpen = ref( false )

const openHamburgerMenu = () => {
    isHamburgerOpen.value = !isHamburgerOpen.value
}

const logout = () => {
  setToken(null);
  router.push('/');
};

</script>

<style scoped>
.brand-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.schedule-text {
  font-weight: 300;
  margin-left: 2px;
  color: #f0f0f0;
}

@media screen and (max-width: 1023px) {
  .navbar-menu.is-active {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .navbar-menu .navbar-start,
  .navbar-menu .navbar-end {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .navbar-item {
    justify-content: center;
  }

  .navbar-menu .buttons {
    flex-direction: column;
  }

  .navbar-menu .button {
    margin-top: 0.5rem;
  }
}

</style>

  
<template>
    <div class="modal is-active">
      <div class="modal-background" @click="togglePopup"></div>
  
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button class="delete" aria-label="close" @click="togglePopup"></button>
        </header>
  
        <section class="modal-card-body">
          <slot />
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    togglePopup: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      default: 'Modal'
    }
  })
  </script>
  
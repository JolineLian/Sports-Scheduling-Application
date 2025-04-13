<template>
  <Navbar/>
  <RouterView />
  <div style="display: none">
    <GMapMap :center="{ lat: 0, lng: 0 }" :zoom="1" style="width: 0; height: 0;" />
  </div>
</template>

<script setup>
  import Navbar from '@/components/Navbar.vue'  
</script>

<style scoped>
</style>

<template>
  <GMapMap
    ref="mapRef"
    :center="{ lat, lng }"
    :zoom="15"
    style="width: 100%; height: 300px"
    @tilesloaded="onMapReady"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define props for latitude and longitude
const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
})

// Ref to access the map object
const mapRef = ref(null)

// Function to initialize and add markers when the map is ready
const onMapReady = async () => {
  // Access the map instance from the ref
  const map = mapRef.value?.$mapObject
  if (!map) return

  // Create a regular marker on the map
  new google.maps.Marker({
    map,
    position: { lat: props.lat, lng: props.lng },
    title: 'Event Location'
  })
}
</script>

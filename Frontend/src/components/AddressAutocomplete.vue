<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: String,
})

const emit = defineEmits(['update:modelValue', 'place-selected'])

const localAddress = ref(props.modelValue || '')
const autocompleteInput = ref(null)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localAddress.value) {
      localAddress.value = newVal
    }
  }
)

watch(localAddress, (val) => {
  emit('update:modelValue', val)
})

onMounted(async () => {
  if (!window.google) {
    console.error('Google Maps is not available!')
    return
  }

  await nextTick() // Ensure the DOM is ready

  if (!autocompleteInput.value) {
    console.error('autocompleteInput ref is still null!')
    return
  }

  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {})

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place && place.geometry) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const formattedAddress = place.formatted_address

      localAddress.value = formattedAddress
      emit('update:modelValue', formattedAddress)
      emit('place-selected', { lat, lng, address: formattedAddress })
    }
  })
})
</script>



<template>
  <input
    ref="autocompleteInput"
    type="text"
    class="input"
    :placeholder="placeholder"
    v-model="localAddress"
  />
</template>

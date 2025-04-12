<template>
    <div 
    class="bg-white relative border rounded-lg"
    v-if="router.currentRoute.value.path === '/dashboard/events'">
      <table class="table">
        <thead>
          <tr>
            <th>TEAM</th>
            <th>DATE</th>
            <th>EVENT</th>
            <th>LOCATION</th>
            <th>VS</th>
            <th>NOTES</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id">
            <td>{{ event.team }}</td>
            <td>{{ event.date }}</td>
            <td>{{ event.event_type }}</td>
            <td>{{ event.address || 'NONE' }}</td>
            <td>{{ event.opponent }}</td>
            <td>{{ event.notes }}</td>
            <td>
              <!-- Details Button -->
              <button @click="togglePopup('details', event._id)">Details</button>
              <Popup 
                v-if="activePopupId.details === event._id"
                :togglePopup="() => togglePopup('details', event._id)"
              >
                <p>{{ event.event_type }}</p>
                <p>{{ event.date }}</p>
                <p>{{ event.league }}</p>
                <p>{{ event.division }}</p>
                <p>{{ event.team }}</p>
                <p>{{ event.opponent }}</p>
                <p>{{ event.play }}</p>
                <p>{{ event.back }}</p>
                <p>{{ event.notes }}</p>
                <p>{{ event.address }}</p>
              </Popup>
  
              <!-- Edit Button -->
              <button v-if="isAdmin" @click="togglePopup('edit', event._id)">Edit</button>
              <Popup 
                v-if="activePopupId.edit === event._id"
                :togglePopup="() => togglePopup('edit', event._id)"
              >
                <h3>Edit Event</h3>
                <form>
                  <label for="event_type">Event Type:</label>
                  <input v-model="event.event_type" type="text" id="event_type" />
                  
                  <label for="date">Date:</label>
                  <input v-model="event.date" type="date" id="date" />
                  
                  <label for="opponent">Opponent:</label>
                  <input v-model="event.opponent" type="text" id="opponent" />
                  
                  <label for="notes">Notes:</label>
                  <textarea v-model="event.notes" id="notes"></textarea>
                  
                  <!-- Add more fields as necessary -->
                  
                  <button type="submit">Save Changes</button>
                </form>
              </Popup>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bg-white relative border rounded-lg"
    v-if="router.currentRoute.value.path === '/dashboard/leagues'">
      <table class="table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>DIVISIONS</th>
            <th>TEAMS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="league in leagues" :key="leagues._id">
            <td>{{ league.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>


<script setup>
import { ref } from 'vue'
import Popup from './Popup.vue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth.js';

const { isAdmin } = useAuth();

const props = defineProps({
  events: Array,
  leagues: Array,
  visible: Boolean
})

// To track active popups for details and editing
const activePopupId = ref({
  details: null,
  edit: null
})

const togglePopup = (type, id) => {
  activePopupId.value[type] = activePopupId.value[type] === id ? null : id
}
</script>
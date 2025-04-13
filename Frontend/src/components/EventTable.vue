<template>
  <div>
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
          <td>{{ formatDate(event.date) }}</td>
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
              <Map v-if="event.lat && event.lng" :lat="Number(event.lat)" :lng="Number(event.lng)" />
            </Popup>

            <!-- Edit Button -->
            <button v-if="isAdmin" @click="() => togglePopup('edit', event._id, event)">Edit</button>

            <Popup 
              v-if="activePopupId.edit === event._id && editedEvent"
              :key="event._id"
              :togglePopup="() => togglePopup('edit', event._id)"
            >
              <form @submit.prevent="saveEdit(event)">
                <h3>Edit Event</h3>

                <label>Enter Type</label>
                <select v-model="editedEvent.event_type">
                  <option value="" disabled>Select Type</option>
                  <option value="game">Game</option>
                  <option value="practice">Practice</option>
                </select>

                <div>
                  <label>Date:</label>
                  <input type="date" v-model="editedEvent.date" />
                  <label>Play:</label>
                  <input v-model="editedEvent.play" placeholder="Play" />
                  <label>Back:</label>
                  <input v-model="editedEvent.back" placeholder="Back" />
                </div>

                <div v-if="editedEvent">
                  <AddressAutocomplete
                    v-model="editedEvent.address"
                    placeholder="Enter address"
                    @place-selected="({ lat, lng }) => {
                      editedEvent.lat = lat
                      editedEvent.lng = lng
                    }"
                  />
                </div>

                <div>
                  <label>League:</label>
                  <select v-model="editedEvent.league">
                    <option disabled value="">Select League</option>
                    <option v-for="league in leagues" :key="league._id" :value="league.name">
                      {{ league.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label>Division:</label>
                  <input v-model="editedEvent.division" placeholder="Division" />
                </div>

                <div>
                  <label>Team:</label>
                  <select v-model="editedEvent.team">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in teams" :key="team._id" :value="team.name">
                      {{ team.name }}
                    </option>
                  </select>
                </div>

                <div v-if="editedEvent.event_type !== 'practice'">
                  <label>Opponent:</label>
                  <select v-model="editedEvent.opponent">
                    <option disabled value="">Select Opponent</option>
                    <option v-for="opp in opps" :key="opp._id" :value="opp.name">
                      {{ opp.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label>Notes:</label>
                  <textarea v-model="editedEvent.notes" placeholder="Notes"></textarea>
                </div>

                <button type="submit">Save Changes</button>
              </form>
            </Popup>

            <!-- Delete Button -->
            <button v-if="isAdmin" @click="() => deleteEvent(event._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Popup from './Popup.vue'
import { useAuth } from '@/composables/useAuth.js'
import axios from 'axios'
import Map from './Map.vue'
import AddressAutocomplete from './AddressAutocomplete.vue'

const { isAdmin } = useAuth()

const editedEvent = ref(null)

const props = defineProps({
  events: Array,
  leagues: Array,
  teams: Array,
  opps: Array,
  deleteEvent: Function,
})

const activePopupId = ref({
  details: null,
  edit: null
})

const togglePopup = (type, id, event = null) => {
  if (type === 'edit') {
    if (activePopupId.value.edit === id) {
      activePopupId.value.edit = null
      editedEvent.value = null
    } else {
      activePopupId.value.edit = id
      editedEvent.value = JSON.parse(JSON.stringify(event))
    }
  } else {
    activePopupId.value.details = activePopupId.value.details === id ? null : id
  }
}

const saveEdit = async (originalEvent) => {
  try {
    const updatedEvent = { ...editedEvent.value }

    const res = await axios.put(`http://localhost:8000/api/events/${originalEvent._id}`, updatedEvent)

    if (res.status === 200) {
      Object.assign(originalEvent, updatedEvent)
      alert('Event updated successfully!')
      togglePopup('edit', originalEvent._id)
    }
  } catch (error) {
    console.error('Error updating event:', error)
    alert('Failed to update event.')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}
</script>

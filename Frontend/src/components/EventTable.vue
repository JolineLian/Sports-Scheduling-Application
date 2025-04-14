<template>
    <div class="section pt-4 pb-4">
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th>TEAM</th>
          <th>DATE</th>
          <th>EVENT</th>
          <th>LOCATION</th>
          <th>VS</th>
          <th>NOTES</th>
          <th></th>
          <th></th>
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
            <span class="icon" @click="togglePopup('details', event._id)" style="cursor: pointer;">
              <i class="fa-solid fa-bars"></i>
            </span>

            <!-- <button @click="togglePopup('details', event._id)">Details</button> -->
            <Popup 
              v-if="activePopupId.details === event._id"
              :togglePopup="() => togglePopup('details', event._id)"
              title="Event Details"
            >
              <p>Type: {{ event.event_type }}</p>
              <p>Date: {{ formatDate(event.date) }}</p>
              <p>League: {{ event.league }}</p>
              <p>Division: {{ event.division }}</p>
              <p>Team: {{ event.team }}</p>
              <p>Opponent: {{ event.opponent }}</p>
              <p>Play: {{ event.play }}</p>
              <p>Back: {{ event.back }}</p>
              <p>Notes: {{ event.notes }}</p>
              <p>{{ event.address }}</p>
              <Map v-if="event.lat && event.lng" :lat="Number(event.lat)" :lng="Number(event.lng)" />
            </Popup>

          </td>
          <td>
            
            <!-- Edit Button -->
            <span v-if="isAdmin" class="icon pencil-icon" @click="togglePopup('edit', event._id, event)" style="cursor: pointer;">
              <i class="fa-solid fa-pen"></i>
            </span>

            <!-- <button v-if="isAdmin" @click="() => togglePopup('edit', event._id, event)">Edit</button> -->

            <Popup 
              v-if="activePopupId.edit === event._id && editedEvent"
              :key="event._id"
              :togglePopup="() => togglePopup('edit', event._id)"
              title="Edit Event"
            >
              <form @submit.prevent="saveEdit(event)">
                <label>Type: </label>
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

                <!-- <div v-if="editedEvent"> -->
                  Address:
                  <AddressAutocomplete
                    v-model="editedEvent.address"
                    placeholder="Enter address"
                    @place-selected="({ lat, lng }) => {
                      editedEvent.lat = lat
                      editedEvent.lng = lng
                    }"
                  />
                <!-- </div> -->

                <div>
                  <label>League: </label>
                  <select v-model="editedEvent.league">
                    <option disabled value="">Select League</option>
                    <option v-for="league in leagues" :key="league._id" :value="league.name">
                      {{ league.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label>Division: </label>
                  <input v-model="editedEvent.division" placeholder="Division" />
                </div>

                <div>
                  <label>Team: </label>
                  <select v-model="editedEvent.team">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in teams" :key="team._id" :value="team.name">
                      {{ team.name }}
                    </option>
                  </select>
                </div>

                <div v-if="editedEvent.event_type !== 'practice'">
                  <label>Opponent: </label>
                  <select v-model="editedEvent.opponent">
                    <option disabled value="">Select Opponent</option>
                    <option v-for="opp in opps" :key="opp._id" :value="opp.name">
                      {{ opp.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label>Notes:</label>
                  <div>
                    <textarea v-model="editedEvent.notes" placeholder="Notes"></textarea>
                  </div>
                </div>

                <button class="button has-background-primary-soft has-text-soft" type="submit">Save Changes</button>
              </form>
            </Popup>

            <!-- Delete Button -->
            <span v-if="isAdmin" class="icon delete-icon" @click="() => deleteEvent(event._id)" style="cursor: pointer;">
              <i class="fa-solid fa-trash"></i>
            </span>
            <!-- <button v-if="isAdmin" @click="() => deleteEvent(event._id)">Delete</button> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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

<style scoped>
.table {
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
}

th,
td {
  vertical-align: middle;
  text-align: center;
  padding: 0.75rem 0.5rem;
}

th:last-child,
td:last-child {
  width: 120px;
}

button {
  margin: 2px;
}

form input {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

form button[type="submit"] {
  margin-top: 1rem;
}

/* Default color for the pencil icon */
.pencil-icon i {
  color: #FF8C00; /* Default Orange */
  transition: color 0.3s ease; /* Smooth transition on hover */
}

/* Hover effect for the pencil icon */
.pencil-icon:hover i {
  color: #FF4500; /* Darker orange on hover */
}

.delete-icon i {
  color: #D9534F; /* Default Orange */
  transition: color 0.3s ease; /* Smooth transition on hover */
}

/* Hover effect for the pencil icon */
.delete-icon:hover i {
  color: #C9302C; /* Darker orange on hover */
}

</style>
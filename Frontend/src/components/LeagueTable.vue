<template>
    <div class="Search">
      <!-- Add League -->
      <div class="filter-container">
        <div class="filter-row center-row">
          <button class="button has-background-primary-soft has-text-soft is-large" @click="togglePopup('add')">+</button>
  
          <Popup v-if="activePopupId.add" :togglePopup="() => togglePopup('add')" title="Add New League">
            <form @submit.prevent="createLeague">
              <div>
                <label>Name:</label>
                <input type="text" v-model="newLeague.name" placeholder="League name" />
              </div>
  
              <div>
                <label>Number of Divisions:</label>
                <input type="number" min="1" v-model.number="newLeague.division" placeholder="Number of divisions" />
              </div>
  
              <button type="submit">Create League</button>
            </form>
          </Popup>
        </div>
      </div>
  
      <!-- League-->
      <div class="section pt-4 pb-4">
        <div class="container">
          <table class="table">
            <thead>
              <tr>
                <th>LEAGUE</th>
                <th>DIVISIONS</th>
                <th>DETAILS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="league in leagues" :key="league._id">
                <td>{{ league.name }}</td>
                <td>{{ league.divisions.length }}</td>
                <td>
                    <!-- Details -->
                    <span class="icon" @click="togglePopup('details', league._id)" style="cursor: pointer;">
                        <i class="fa-solid fa-bars"></i>
                    </span>
                  <Popup
                    v-if="activePopupId.details === league._id"
                    :togglePopup="() => togglePopup('details', league._id)"
                    title="League Details"
                  >
                    <p><strong>Name:</strong> {{ league.name }}</p>
                    <p><strong>Divisions:</strong> {{ league.divisions.join(', ') }}</p>
                  </Popup>
                </td>
                <td>
                  <!-- Edit -->
                  <span class="icon pencil-icon" @click="togglePopup('edit', league._id, league)" style="cursor: pointer;">
                    <i class="fa-solid fa-pen"></i>
                  </span>
  
                  <Popup
                    v-if="activePopupId.edit === league._id && editedLeague"
                    :key="league._id"
                    :togglePopup="() => togglePopup('edit', league._id)"
                    title="Edit League"
                  >
                    <form @submit.prevent="saveEdit(league)">
                      <div>
                        <label>Name:</label>
                        <input type="text" v-model="editedLeague.name" placeholder="League name" />
                      </div>
                      <div>
                        <label>Number of Divisions:</label>
                        <input
                          type="number"
                          min="1"
                          v-model.number="editedLeague.division"
                          placeholder="Number of divisions"
                        />
                      </div>
                      <button class="button has-background-primary-soft has-text-soft" type="submit">Save Changes</button>
                    </form>
                  </Popup>
  
                  <!-- Delete -->
                  <span class="icon delete-icon" @click="() => deleteLeague(league._id)" style="cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
  
  
<script setup>
import { ref } from 'vue'
import Popup from './Popup.vue'
import axios from 'axios'

// Props
const props = defineProps({
leagues: Array,
deleteLeague: Function,
})

// Popup state
const activePopupId = ref({
details: null,
edit: null,
add: false,
})

const editedLeague = ref(null)
const newLeague = ref({
name: '',
division: 1,
})

// Toggle popups
const togglePopup = (type, id = null, league = null) => {
    if (type === 'edit') {
        if (activePopupId.value.edit === id) {
            activePopupId.value.edit = null
            editedLeague.value = null
        } else {
            activePopupId.value.edit = id
            editedLeague.value = {
            _id: league._id,
            name: league.name,
            division: league.divisions, // now it's a number
            }
        }
        } else if (type === 'details') {
            activePopupId.value.details = activePopupId.value.details === id ? null : id
        } else if (type === 'add') {
            activePopupId.value.add = !activePopupId.value.add
        if (activePopupId.value.add) {
            newLeague.value = { name: '', division: 1 }
        }
    }
}

const saveEdit = async (originalLeague) => {
    if (!editedLeague.value.name || editedLeague.value.division < 1) {
    return alert('Please enter a valid name and division number.')
    }

    const duplicate = props.leagues.find(
        (l) =>
        l.name.trim().toLowerCase() === editedLeague.value.name.trim().toLowerCase() &&
        l._id !== editedLeague.value._id
    )

    if (duplicate) {
    return alert('A league with this name already exists.')
    }

    try {
        const updatedLeague = {
        name: editedLeague.value.name,
        division: editedLeague.value.division, // ✅ send "division", not "divisions"
        }


        const res = await axios.put(
        `http://localhost:8000/api/leagues/${originalLeague._id}`,
        updatedLeague
        )

        if (res.status === 200) {
        originalLeague.name = updatedLeague.name
        originalLeague.divisions = updatedLeague.divisions

        alert('League updated successfully!')
        togglePopup('edit', originalLeague._id)
        }
        } catch (err) {
        console.error('Failed to update league:', err)
        alert('Error updating league.')
    }
}


const createLeague = async () => {
    if (!newLeague.value.name || newLeague.value.division < 1) {
        return alert('Please enter a valid name and division number.')
    }

    const duplicate = props.leagues.find(
        (l) => l.name.trim().toLowerCase() === newLeague.value.name.trim().toLowerCase()
    )

    if (duplicate) {
        return alert('A league with this name already exists.')
    }

    try {
        const newEntry = {
        name: newLeague.value.name,
        division: newLeague.value.division,
        }

        const res = await axios.post('http://localhost:8000/api/leagues', newEntry)

        if (res.status === 201) {
        props.leagues.push(res.data.newLeague)
        alert('League created successfully!')
        togglePopup('add')
        }
    } catch (err) {
        console.error('Failed to create league:', err)
        alert('Error creating league.')
    }
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

/* Button icon colors */
.pencil-icon i {
  color: #FF8C00;
  transition: color 0.3s ease;
}
.pencil-icon:hover i {
  color: #FF4500;
}

.delete-icon i {
  color: #D9534F;
  transition: color 0.3s ease;
}
.delete-icon:hover i {
  color: #C9302C;
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

/* Matching filter-container style */
.filter-container {
  max-width: 1000px;
  margin: 2rem auto;
  /* border-radius: 12px; */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.center-row {
  justify-content: center;
}

</style>

  
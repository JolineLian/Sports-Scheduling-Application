<template>
    <div>
      <!-- Add League Button -->
      
  
      <!-- League Table -->
      <table class="table">
        <thead>
          <tr>
            <th>LEAGUE</th>
            <th>DIVISIONS</th>
            <th>DETAILS</th>
            <th>ACTIONS</th>
            <th>
                <div style="margin-bottom: 1rem;">
                    <button class="button is-primary" @click="togglePopup('add')">+</button>
                </div>
            
                <!-- Add League Popup -->
                <Popup v-if="activePopupId.add" :togglePopup="() => togglePopup('add')">
                    <form @submit.prevent="createLeague">
                    <h3>Add New League</h3>
            
                    <div>
                        <label>Name:</label>
                        <input type="text" v-model="newLeague.name" placeholder="League name" />
                    </div>
            
                    <div>
                        <label>Number of Divisions:</label>
                        <input
                        type="number"
                        min="1"
                        v-model.number="newLeague.division"
                        placeholder="Number of divisions"
                        />
                    </div>
            
                    <button type="submit">Create League</button>
                    </form>
                </Popup>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="league in leagues" :key="league._id">
            <td>{{ league.name }}</td>
            <td>{{ league.divisions.length }}</td>
            <td>
              <button @click="togglePopup('details', league._id)">Details</button>
              <Popup
                v-if="activePopupId.details === league._id"
                :togglePopup="() => togglePopup('details', league._id)"
              >
                <p><strong>Name:</strong> {{ league.name }}</p>
                <p><strong>Divisions:</strong> {{ league.divisions.join(', ') }}</p>
              </Popup>
            </td>
            <td>
              <!-- Edit Button -->
              <button @click="() => togglePopup('edit', league._id, league)">Edit</button>
              <Popup
                v-if="activePopupId.edit === league._id && editedLeague"
                :key="league._id"
                :togglePopup="() => togglePopup('edit', league._id)"
              >
                <form @submit.prevent="saveEdit(league)">
                  <h3>Edit League</h3>
  
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
  
                  <button type="submit">Save Changes</button>
                </form>
              </Popup>
  
              <!-- Delete Button -->
              <button @click="() => deleteLeague(league._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
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
  
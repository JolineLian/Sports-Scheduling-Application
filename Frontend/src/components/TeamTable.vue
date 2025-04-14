<template>
  <div class="Search">
    <!-- Add Team Button -->
    <div class="filter-container">
      <div class="filter-row center-row">
        <button class="button has-background-primary-soft has-text-soft is-large" @click="togglePopup('add')">+</button>

        <!-- Add Team Popup -->
        <Popup v-if="activePopupId.add" :togglePopup="() => togglePopup('add')" title="Add New Team">
          <form @submit.prevent="createTeam">
            <div>
              <label>Name:</label>
              <input type="text" v-model="newTeam.name" placeholder="Team name" />
            </div>

            <div>
              <label>League:</label>
              <select v-model="newTeam.league_id">
                <option v-for="league in leagues" :key="league._id" :value="league._id">
                  {{ league.name }}
                </option>
              </select>
            </div>

            <div>
              <label>Division:</label>
              <input
                type="number"
                min="1"
                v-model.number="newTeam.division"
                placeholder="Division number"
              />
            </div>

            <button type="submit">Create Team</button>
          </form>
        </Popup>
      </div>
    </div>

    <!-- Team Table -->
    <div class="section pt-4 pb-4">
      <div class="container">
        <table class="table">
          <thead class="is-primary">
            <tr>
              <th>TEAM</th>
              <th>LEAGUE</th>
              <th>DIVISION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in teams" :key="team._id">
              <td>{{ team.name }}</td>
              <td>{{ getLeagueName(team.league_id) }}</td>
              <td>{{ team.division }}</td>
              <td>
                <!-- Edit Icon -->
                <span class="icon pencil-icon" @click="togglePopup('edit', team._id, team)" style="cursor: pointer;">
                  <i class="fa-solid fa-pen"></i>
                </span>

                <Popup
                  v-if="activePopupId.edit === team._id && editedTeam"
                  :togglePopup="() => togglePopup('edit', team._id)"
                  title="Edit Team"
                >
                  <form @submit.prevent="saveEdit(team)">

                    <div>
                      <label>Name:</label>
                      <input type="text" v-model="editedTeam.name" />
                    </div>

                    <div>
                      <label>League:</label>
                      <select v-model="editedTeam.league_id">
                        <option v-for="league in leagues" :key="league._id" :value="league._id">
                          {{ league.name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label>Division:</label>
                      <input
                        type="number"
                        min="1"
                        v-model.number="editedTeam.division"
                        placeholder="Division number"
                      />
                    </div>

                    <button class="button has-background-primary-soft has-text-soft" type="submit">Save Changes</button>
                  </form>
                </Popup>

                <!-- Delete Icon -->
                <span class="icon delete-icon" @click="() => deleteTeam(team._id)" style="cursor: pointer;">
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

const editedTeam = ref(null)

const props = defineProps({
  teams: Array,
  leagues: Array,
  deleteTeam: Function,
})

const newTeam = ref({
  name: '',
  league_id: '',
  division: 1,
})

const activePopupId = ref({
  edit: null,
  add: false,
})

const getLeagueName = (id) => {
  const league = props.leagues.find((l) => l._id === id)
  return league ? league.name : 'Unknown League'
}

const togglePopup = (type, id = null, team = null) => {
  if (type === 'edit') {
    if (activePopupId.value.edit === id) {
      activePopupId.value.edit = null
      editedTeam.value = null
    } else {
      activePopupId.value.edit = id
      const divisionNumber = team.division.toString().replace(/division\s*/i, '').trim()
      editedTeam.value = { ...team, division: Number(divisionNumber) || 1 }
    }
  } else if (type === 'add') {
    activePopupId.value.add = !activePopupId.value.add
    if (activePopupId.value.add) {
      newTeam.value = { name: '', league_id: '', division: 1 }
    }
  }
}

const createTeam = async () => {
  if (!newTeam.value.name || !newTeam.value.league_id || newTeam.value.division < 1) {
    return alert('Please enter all valid team details.')
  }

  const isDuplicate = props.teams.some(
    (team) =>
      team.league_id === newTeam.value.league_id &&
      team.division === `Division ${newTeam.value.division}` &&
      team.name === newTeam.value.name
  )

  if (isDuplicate) {
    return alert('A team with the same name, league, and division already exists.')
  }

  const payload = {
    name: newTeam.value.name.trim(),
    league_id: newTeam.value.league_id,
    division: `Division ${newTeam.value.division}`,
  }

  try {
    const res = await axios.post('http://localhost:8000/api/teams', payload)
    if (res.status === 201) {
      props.teams.push(res.data.newTeam)
      alert('Team created successfully!')
      togglePopup('add')
    }
  } catch (err) {
    console.error('Failed to create team:', err)
    alert('Error creating team.')
  }
}

const saveEdit = async (originalTeam) => {
  if (!editedTeam.value.name || !editedTeam.value.league_id || editedTeam.value.division < 1) {
    return alert('Please enter all valid team details.')
  }

  const rawDivision = editedTeam.value.division.toString().replace(/division\s*/i, '').trim()
  const updatedTeam = {
    name: editedTeam.value.name,
    league_id: editedTeam.value.league_id,
    division: `Division ${rawDivision}`,
  }

  const isDuplicate = props.teams.some(
    (team) =>
      team._id !== originalTeam._id &&
      team.league_id === updatedTeam.league_id &&
      team.division === updatedTeam.division &&
      team.name === updatedTeam.name
  )

  if (isDuplicate) {
    return alert('A team with the same name, league, and division already exists.')
  }

  try {
    const res = await axios.put(`http://localhost:8000/api/teams/${originalTeam._id}`, updatedTeam)
    if (res.status === 200) {
      Object.assign(originalTeam, updatedTeam)
      alert('Team updated successfully!')
      togglePopup('edit', originalTeam._id)
    }
  } catch (err) {
    console.error('Failed to update team:', err)
    alert('Error updating team.')
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

form input,
form select {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

form button[type="submit"] {
  margin-top: 1rem;
}

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
``

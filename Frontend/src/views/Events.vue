<template>
    <div class="Search">
        <div>
            <div class="filter-bar">
                <div class="filter-item">
                    <button class="button is-primary" @click="showEvent = !showEvent">EVENT</button>
                    <div v-if="showEvent" class="dropdown-content">
                        <div v-for="(type, index) in eventType" :key="index" class="checkbox-item">
                            <input 
                                type="checkbox" 
                                :value="type"
                                v-model="selectedEvent"
                                @change="eventFilterReq"
                            />
                            <label>{{ type }}</label>
                        </div>
                    </div>
                </div>
                            <!-- DATE -->
                <div class="filter-item">
                    <button class="button is-primary" @click="showDate = !showDate">DATE</button>
                    <div v-if="showDate" class="dropdown-content">
                        <div class="date-item">
                            <label for="start-date">Start:</label>
                            <input
                                type="date"
                                id="start-date"
                                v-model="startDate"
                                @change="eventFilterReq"
                            />
                        </div>
                        <div class="date-item">
                            <label for="end-date">End:</label>
                            <input
                                type="date"
                                id="end-date"
                                v-model="endDate"
                                @change="eventFilterReq"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- LEAGUE -->
                <div class="filter-item">
                    <button class="button is-primary" @click="showLeague = !showLeague">LEAGUE</button>
                    <div v-if="showLeague" class="dropdown-content">
                        <div v-for="(league, index) in leagues" :key="index" class="checkbox-item">
                            <input 
                            type="checkbox" 
                            :value="league._id"
                            v-model="selectedLeague"
                            @change="eventFilterReq"
                            />
                            <label>{{ league.name }}</label>
                        </div>
                    </div>
                </div>

                <!-- TEAM -->
                <div class="filter-item">
                    <button class="button is-primary" @click="showTeams = !showTeams">TEAM</button>
                    <div v-if="showTeams" class="dropdown-content">
                        <div v-for="(team, index) in teams" :key="index" class="checkbox-item">
                            <input 
                            type="checkbox" 
                            :value="team.name"
                            v-model="selectedTeams"
                            @change="eventFilterReq"
                            />
                            <label>{{ team.name }}</label>
                        </div>
                    </div>
                </div>

                <!-- VS -->
                <div class="filter-item">
                    <button class="button is-primary" @click="showOpps = !showOpps">VS</button>
                    <div v-if="showOpps" class="dropdown-content">
                        <div v-for="(opp, index) in opps" :key="index" class="checkbox-item">
                            <input 
                            type="checkbox" 
                            :value="opp.name"
                            v-model="selectedOpps"
                            @change="eventFilterReq"
                            />
                            <label>{{ opp.name }}</label>
                        </div>
                    </div>
                </div>

                <div>
                    <button class="button is-primary" @click="() => togglePopup('buttonTrigger')">+</button>
                    <Popup v-if="popupTriggers.buttonTrigger" 
                    :togglePopup="() => togglePopup('buttonTrigger')">
                        <form @submit.prevent="submitform">
                            <div>
                            <h3>Enter Type</h3>
                            <select v-model="event_type">
                                <option value="" disabled>Select Type</option>
                                <option v-for="(type, index) in eventType" :key="index" :value="type">{{ type }}</option>
                            </select>

                            <h3>Enter Date</h3>
                            <div class="date-item">
                                <input type="date" v-model="date" />
                                <input v-model="play" placeholder="Play"/>
                                <input v-model="back" placeholder="Back"/>
                            </div>

                            <h3>Enter Address</h3>
                                <input v-model="address" placeholder="Address"/>

                            <h3>Enter League</h3>
                            <select v-model="league">
                                <option value="" disabled>Select League</option>
                                <option v-for="(league, index) in leagues" :key="index" :value="league">{{ league.name }}</option>
                            </select>

                            <h3>Enter Division</h3>
                            <input v-model="division" placeholder="Eg. Division 1"/>

                            <h3>Enter Team</h3>
                            <select v-model="team">
                                <option value="" disabled>Select Team</option>
                                <option v-for="(team, index) in teams" :key="index" :value="team.name">{{ team.name }}</option>
                            </select>

                            <h3 v-if="event_type !== 'practice'">Enter Opponent</h3>
                            <select v-if="event_type !== 'practice'" v-model="opponent">
                                <option value="" disabled>Select Opponent</option>
                                <option v-for="(opp, index) in opps" :key="index" :value="opp.name">{{ opp.name }}</option>
                            </select>
                            </div>

                            <button type="submit">Create Event</button>
                        </form>
                    </Popup>
                </div>
            </div>
        </div>
    </div>

    <div>
        <Table  
        :events="events" 
        :leagues="leagues"
        :teams="teams"
        :opps="opps"
        :deleteEvent="deleteEvent"/>
    </div>
</template>

<script setup>
    import { ref , onMounted } from 'vue';
    import Table from '../components/EventTable.vue';
    import axios from 'axios';
    import Popup from '../components/Popup.vue'

    const events = ref([]);
    const selectedEvent = ref([]);
    const selectedLeague = ref([]);
    const selectedTeams = ref([]);
    const selectedOpps = ref([]);

    const showEvent = ref( false );
    const showDate = ref( false );
    const showLeague = ref( false );
    const showTeams = ref( false );
    const showOpps = ref( false );

    const startDate = ref('');
    const endDate = ref('');

    const eventType = ['game', 'practice'];
    const leagues = ref([]);
    const teams = ref([]);
    const opps = ref([]);

    const event_type = ref('');
    const date = ref('');
    const play = ref('');
    const back = ref('');
    const address = ref('');
    const league = ref('');
    const league_id = ref('');
    const division = ref('');
    const team = ref('');
    const opponent = ref('');

    // const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

    const popupTriggers = ref({
        buttonTrigger: false,
    })

    const filterTeams = async () => {
        const queryString = {};

        if (selectedLeague.value.length > 0) {
            queryString.league = selectedLeague.value.join(',');
            const res = await axios.get(`http://localhost:8000/api/teams/leagues`, { params: queryString});
            teams.value = res.data.teams;
            opps.value = res.data.teams;
        }
    }

    const submitform = async () => {
        if (!event_type.value || !date.value || !league.value || !division.value || !team.value || !opponent.value) {
            alert('Please fill out all fields.');
            return;
        }

        if (event_type.value !== 'practice' && !opponent.value) {
            alert('Please select an opponent.');
            return;
        }

        league_id.value = league.value._id;

        try {
            const res = await axios.post("http://localhost:8000/api/events", {
                event_type: event_type.value,
                date: date.value,
                play: play.value,
                back: back.value,
                address: address.value,
                league: league.value.name,
                league_id: league_id.value,
                division: division.value,
                team: team.value,
                opponent: opponent.value,
            });

            if (res.status === 200) {
                alert('Event created successfully!');
                togglePopup('buttonTrigger');
                resetForm();
            }
        } catch (error) {
            console.error('Error response:', error.response);
            alert('There was an error creating the event. Please try again later.');
        }
    };

    const eventFilterReq = async () => {
        const queryString = {};
        filterTeams();

        if (selectedEvent.value.length > 0) {
            queryString.type = selectedEvent.value.join(',');
        }

        if (selectedLeague.value.length > 0) {
            queryString.league = selectedLeague.value.join(',');
        }

        if (selectedTeams.value.length > 0) {
            queryString.team = selectedTeams.value.join(',');
        }

        if (selectedOpps.value.length > 0) {
            queryString.opponent = selectedOpps.value.join(',');
        }

        if (startDate && endDate) {
            queryString.startDate = startDate._value;
            queryString.endDate = endDate._value;
        }

        const res = await axios.get(`http://localhost:8000/api/events/filter`, { params: queryString});

        events.value = res.data.events;
    }   

    const deleteEvent = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:8000/api/events/${id}`);
        if (res.status === 200) {
        events.value = events.value.filter(event => event._id !== id);
        alert('Event deleted successfully!');
        }
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete event.');
    }
    }

    const togglePopup = (trigger) => {
        popupTriggers.value[trigger] =!popupTriggers.value[trigger];
    }

    onMounted( async () => {
        const eventData = await axios.get('http://localhost:8000/api/events');
        const leagueData = await axios.get('http://localhost:8000/api/leagues');
        const teamsData = await axios.get('http://localhost:8000/api/teams');
        const oppsData = await axios.get('http://localhost:8000/api/teams');
       
        leagues.value = leagueData.data.leagues;
        teams.value = teamsData.data.teams;
        opps.value = oppsData.data.teams;
        events.value = eventData.data.events;
    })

</script>

<style scoped>
    li {
        list-style-type: none;
    }
    .filter-bar {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.filter-item .button {
  width: auto;
  white-space: nowrap;
}

/* Checkbox container below each button */
.dropdown-content {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #dbdbdb;
  padding: 0.5rem;
  border-radius: 4px;
  z-index: 1;
  min-width: 120px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

</style>
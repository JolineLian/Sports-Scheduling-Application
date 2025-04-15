<template>
    <div class="Search">
      <div class="filter-container">
    
        <!-- Row 1: Filters -->
        <div class="filter-row">
          <!-- EVENT -->
          <div class="filter-item">
            <div class="dropdown" :class="{'is-active': showEvent}">
              <div class="dropdown-trigger">
                <button class="button" @click="showEvent = !showEvent" aria-haspopup="true" aria-controls="dropdown-menu-event">
                  <span>EVENT</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-event" role="menu">
                <div class="dropdown-content">
                  <div v-for="(type, index) in eventType" :key="index" class="dropdown-item">
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
            </div>
          </div>
    
          <!-- DATE -->
          <div class="filter-item">
            <div class="dropdown" :class="{'is-active': showDate}">
              <div class="dropdown-trigger">
                <button class="button" @click="showDate = !showDate" aria-haspopup="true" aria-controls="dropdown-menu-date">
                  <span>DATE</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-date" role="menu">
                <div class="dropdown-content">
                  <div class="dropdown-item">
                    <label for="start-date">Start:</label>
                    <input type="date" id="start-date" v-model="startDate" @change="eventFilterReq" />
                  </div>
                  <div class="dropdown-item">
                    <label for="end-date">End:</label>
                    <input type="date" id="end-date" v-model="endDate" @change="eventFilterReq" />
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <!-- LEAGUE -->
          <div class="filter-item">
            <div class="dropdown" :class="{'is-active': showLeague}">
              <div class="dropdown-trigger">
                <button class="button" @click="showLeague = !showLeague" aria-haspopup="true" aria-controls="dropdown-menu-league">
                  <span>LEAGUE</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-league" role="menu">
                <div class="dropdown-content">
                  <div v-for="(league, index) in leagues" :key="index" class="dropdown-item">
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
            </div>
          </div>
    
          <!-- TEAM -->
          <div class="filter-item">
            <div class="dropdown" :class="{'is-active': showTeams}">
              <div class="dropdown-trigger">
                <button class="button" @click="showTeams = !showTeams" aria-haspopup="true" aria-controls="dropdown-menu-team">
                  <span>TEAM</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-team" role="menu">
                <div class="dropdown-content">
                  <div v-for="(team, index) in teams" :key="index" class="dropdown-item">
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
            </div>
          </div>
    
          <!-- VS -->
          <div class="filter-item">
            <div class="dropdown" :class="{'is-active': showOpps}">
              <div class="dropdown-trigger">
                <button class="button" @click="showOpps = !showOpps" aria-haspopup="true" aria-controls="dropdown-menu-vs">
                  <span>VS</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-vs" role="menu">
                <div class="dropdown-content">
                  <div v-for="(opp, index) in opps" :key="index" class="dropdown-item">
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
            </div>
          </div>
        </div>
    
        <!-- Row 2: Only the + Button -->
        <div class="filter-row center-row">
          <button v-if="isAdmin" class="button has-background-primary-soft has-text-soft is-large" @click="() => togglePopup('buttonTrigger')">+</button>
          <Popup v-if="popupTriggers.buttonTrigger" 
                 :togglePopup="() => togglePopup('buttonTrigger')" title="Add New Event">
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
                      <AddressAutocomplete 
                          v-model="address" 
                          placeholder="Enter address"
                          @place-selected="onPlaceSelected"
                      />
  
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
    
    <!-- Events Table -->
    <div>
      <Table  
        :events="events" 
        :leagues="leagues"
        :teams="teams"
        :opps="opps"
        :deleteEvent="deleteEvent"
      />
    </div>
  </template>

<script setup>
    import { ref , onMounted } from 'vue';
    import Table from '../components/EventTable.vue';
    import axios from 'axios';
    import Popup from '../components/Popup.vue'
    import AddressAutocomplete from '@/components/AddressAutocomplete.vue';
    import { useAuth } from '@/composables/useAuth.js';


    const { isAdmin } = useAuth();


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
    const latitude = ref(null);
    const longitude = ref(null);

    const onPlaceSelected = ({ lat, lng, address }) => {
        address.value = address;
        latitude.value = lat;
        longitude.value = lng;
    };

    // const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

    const popupTriggers = ref({
        buttonTrigger: false,
    })

    const filterTeams = async () => {
        const queryString = {};

        if (selectedLeague.value.length > 0) {
            queryString.league = selectedLeague.value.join(',');
            const res = await axios.get(`https://sports-scheduling-application.onrender.com/api/teams/leagues`, { params: queryString});
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
            const res = await axios.post("https://sports-scheduling-application.onrender.com/api/events", {
                event_type: event_type.value,
                date: date.value,
                play: play.value,
                back: back.value,
                address: address.value,
                lat: latitude.value,
                lng: longitude.value,
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

        const res = await axios.get(`https://sports-scheduling-application.onrender.com/api/events/filter`, { params: queryString});

        events.value = res.data.events;
    }   

    const deleteEvent = async (id) => {
    try {
        const res = await axios.delete(`https://sports-scheduling-application.onrender.com/api/events/${id}`);
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
        const eventData = await axios.get('https://sports-scheduling-application.onrender.com/api/events');
        const leagueData = await axios.get('https://sports-scheduling-application.onrender.com/api/leagues');
        const teamsData = await axios.get('https://sports-scheduling-application.onrender.com/api/teams');
        const oppsData = await axios.get('https://sports-scheduling-application.onrender.com/api/teams');
       
        leagues.value = leagueData.data.leagues;
        teams.value = teamsData.data.teams;
        opps.value = oppsData.data.teams;
        events.value = eventData.data.events;
    })

</script>

<style scoped>
.filter-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  /* background-color: #f8f8f8; */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.filter-item .button {
  white-space: nowrap;
}

.dropdown-content {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* background-color: white; */
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

.date-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
<template>
    <div>
        <Table :leagues="leagues" :deleteLeague="deleteLeague"/>
    </div>
</template>

<script setup>
    import { ref , onMounted } from 'vue';
    import Table from '../components/LeagueTable.vue';
    import axios from 'axios';


    const leagues = ref([]);

    const deleteLeague = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:8000/api/leagues/${id}`);
        if (res.status === 200) {
        leagues.value = leagues.value.filter(league => league._id !== id); // fixed here
        alert('League deleted successfully!');
        }
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete league.');
    }
    }


    onMounted( async () => {
        const leagueData = await axios.get('http://localhost:8000/api/leagues');
       
        leagues.value = leagueData.data.leagues;
    })
</script>
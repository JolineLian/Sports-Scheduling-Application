<template>
    <Table :teams="teams" :leagues="leagues" :deleteTeam="deleteTeam"/>
</template>

<script setup>
    import Table from '@/components/TeamTable.vue';
    import { ref, onMounted} from 'vue';
    import axios from 'axios';

    const teams = ref([]);
    const leagues = ref([]);

    const deleteTeam = async (teamId) => {
        try {
            const res = await axios.delete(`https://sports-scheduling-application-1.onrender.com/api/teams/${teamId}`);

            if (res.status === 200) {
            const index = teams.value.findIndex((team) => team._id === teamId);
            if (index !== -1) teams.value.splice(index, 1);

            alert('Team deleted successfully!');
            }
        } catch (err) {
            console.error('Failed to delete team:', err);
            alert('Error deleting team.');
        }
    };



    onMounted( async () => {
        const teamsData = await axios.get('https://sports-scheduling-application-1.onrender.com/api/teams');
        const leaguesData = await axios.get('https://sports-scheduling-application-1.onrender.com/api/leagues');

        teams.value = teamsData.data.teams;
        leagues.value = leaguesData.data.leagues;
    })
</script>
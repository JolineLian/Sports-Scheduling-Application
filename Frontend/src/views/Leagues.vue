<template>
    <div>
        <Table :leagues="leagues"/>
    </div>
</template>

<script setup>
    import { ref , onMounted } from 'vue';
    import Table from '../components/Table.vue';
    import axios from 'axios';

    const leagues = ref([]);

    onMounted( async () => {
        const leagueData = await axios.get('http://localhost:8000/api/leagues');
       
        leagues.value = leagueData.data.leagues;
        console.log(leagues.value[0].name)
    })
</script>
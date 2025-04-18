// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)
// app.component('AppLink', AppLink)
app.use(router)
// app.mount('#app')

axios.get('https://sports-scheduling-application.onrender.com/api/google-maps-key')
  .then(res => {
    const key = res.data.key
    if (!key) throw new Error('API key missing from response')

    app.use(VueGoogleMaps, {
      load: {
        key,
        v: 'weekly',
        loading: 'async', // ✅ Add this line to fix the warning
        libraries: 'places', // optional but common
      },
    })

    app.mount('#app')
  })
  .catch(err => {
    console.error('Error loading Google Maps API key:', err)
    // Optionally show an error page or fallback UI
  })

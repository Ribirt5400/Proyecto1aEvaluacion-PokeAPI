import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueSplide from '@splidejs/vue-splide';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router)
app.use(VueSplide);
app.mount('#app')
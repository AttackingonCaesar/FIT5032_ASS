import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import 'vue-toast-notification/dist/theme-sugar.css';
import 'leaflet/dist/leaflet.css';
const app = createApp(App);
app.use(router);
app.mount('#app')

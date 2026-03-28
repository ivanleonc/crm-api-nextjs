import { createApp } from 'vue';
import './style.css'; // Aquí está cargado Tailwind
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router); // Activamos el router
app.mount('#app');
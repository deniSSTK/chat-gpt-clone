import { createApp } from 'vue'
import './style.css'
import App from "./App.vue"
import router from './router'
const app = createApp(App);
import ErrorDisplay from "./components/ErrorDisplay.vue";

app.component('ErrorDisplay', ErrorDisplay);

app.use(router);

app.mount('#app');
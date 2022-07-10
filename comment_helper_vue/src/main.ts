import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setupStore } from '@/store';
import './index.css';
import http from '@/api/http.js';

const app = createApp(App);
setupStore(app);
app.use(router);
app.provide('http', http);
app.mount("#app")

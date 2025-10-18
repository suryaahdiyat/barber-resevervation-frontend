import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import "./style.css";
import App from "./App.vue";
import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);
app.use(Vue3Toastify, {
  autoclose: 3000,
  // transition: "zoom",
});
app.use(router);
app.use(createPinia());
app.mount("#app");

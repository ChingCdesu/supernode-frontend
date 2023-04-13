import { createApp } from "vue";
import App from "@/App.vue";
import i18n from "@/i18n";
import router from "@/router";

import "virtual:uno.css";
import "@/assets/style/style.less";

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount("#app");

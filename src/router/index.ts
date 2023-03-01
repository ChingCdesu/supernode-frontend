import { createRouter, createWebHistory } from "vue-router";

import HomeRoute from "@/router/routes/home";
import LoginRoute from "@/router/routes/login";

export default createRouter({
  history: createWebHistory(),
  routes: [
    HomeRoute,
    LoginRoute,
  ]
});

import { createRouter, createWebHistory } from "vue-router";

import HomeRoute from "@/router/routes/home";
import LoginRoute from "@/router/routes/login";

const router = createRouter({
  history: createWebHistory(),
  routes: [HomeRoute, LoginRoute],
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

import { useAuthState } from "@/store/auth";

import HomeRoute from "@/router/routes/home";
import LoginRoute from "@/router/routes/login";

const { isLogin } = useAuthState();

const router = createRouter({
  history: createWebHistory(),
  routes: [HomeRoute, LoginRoute],
});

router.beforeEach((to, from) => {
  if (to.path === "/login") {
    return;
  }
  if (to.path.startsWith("/api")) {
    return;
  }
  if (!isLogin.value) {
    return { path: "/login" };
  }
});

export default router;

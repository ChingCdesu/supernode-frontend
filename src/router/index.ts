import { createRouter, createWebHistory } from "vue-router";

import { useAuthState } from "@/store/auth";

import HomeRoute from "@/router/routes/home";
import LoginRoute from "@/router/routes/login";
import { getMe } from "@/api/v1/business/users";

const { isExpired } = useAuthState();

const router = createRouter({
  history: createWebHistory(),
  routes: [HomeRoute, LoginRoute],
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/api")) {
    return;
  }
  if (to.path === "/login") {
    return;
  }
  if (isExpired.value) {
    return { path: "/login" };
  } else {
    getMe()
      .then(() => {
        next();
      })
      .catch(() => {
        next({ path: "/login" });
      });
  }
});

export default router;

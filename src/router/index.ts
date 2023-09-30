import { createRouter, createWebHistory } from "vue-router";

import { useAuthState } from "@/store/auth";
import { useUserState } from "@/store/user";

import HomeRoute from "@/router/routes/home";
import LoginRoute from "@/router/routes/login";

const { isExpired } = useAuthState();
const { getMe } = useUserState();

const router = createRouter({
  history: createWebHistory(),
  routes: [HomeRoute, LoginRoute],
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/api")) {
    next();
    return;
  }
  if (to.path === "/login") {
    next();
    return;
  }
  if (isExpired.value) {
    next({ path: "/login" });
    return;
  }
  getMe()
    .then(() => next())
    .catch(() => next({ path: "/login" }));
});

export default router;

import type { RouteRecordRaw } from "vue-router";

import LoginPage from "@/pages/login/Login.vue";

const route: RouteRecordRaw = {
  path: "/",
  component: LoginPage,
};

export default route;

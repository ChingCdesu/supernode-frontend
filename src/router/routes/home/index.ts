import type { RouteRecordRaw } from "vue-router";

import HomePage from "@/pages/home/Home.vue";

const route: RouteRecordRaw = {
  path: "/",
  component: HomePage,
  children: [
    // { path: "/", component: () => import("@/components/home/Content/Admin/Index.vue") },
    {
      path: "/",
      component: () => import("@/components/home/Content/Devices/Index.vue"),
    },
    {
      path: "/settings",
      component: () => import("@/components/home/Content/Settings/Index.vue"),
    },
    {
      path: "/admin",
      children: [
        {
          path: "users",
          component: () => import("@/components/home/Content/Admin/Users.vue"),
        },
        {
          path: "devices",
          component: () => import("@/components/home/Content/Admin/Devices.vue"),
        },
        {
          path: "communities",
          component: () => import("@/components/home/Content/Admin/Communities/Communities.vue"),
        },
      ],
    },
  ],
};

export default route;

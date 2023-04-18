import type { RouteRecordRaw } from "vue-router";

import HomePage from "@/pages/home/Home.vue";

import DashboardContentPage from "@/components/home/Content/Dashboard.vue";
import DeviceContentPage from "@/components/home/Content/Devices/Index.vue";

import AdminContentPage from "@/components/home/Content/Admin/Index.vue";
import SettingsContentPage from "@/components/home/Content/Settings/Index.vue";

const route: RouteRecordRaw = {
  path: "/",
  component: HomePage,
  children: [
    // { path: "/", component: DashboardContentPage },
    { path: "/", component: DeviceContentPage },
    { path: "/settings", component: SettingsContentPage },
    { path: "/admin", component: AdminContentPage },
  ],
};

export default route;

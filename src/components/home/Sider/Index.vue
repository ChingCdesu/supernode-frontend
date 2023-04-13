<script lang="ts" setup>
import { h, computed, ComputedRef } from "vue";
import {
  NH3,
  NText,
  NMenu,
  NSpace,
  NDropdown,
  NAvatar,
  MenuOption,
  DropdownOption,
} from "naive-ui";
import { useI18n } from "vue-i18n";
import { useRoute, RouterLink } from "vue-router";
import { Icon } from "@vicons/utils";
import {
  Devices,
  Settings,
  Dashboard,
  Logout,
  HeartRateMonitor,
} from "@vicons/tabler";

import ColorSchemaSwitch from "@/components/common/ColorSchemaSwitch.vue";
import LocaleSelector from "@/components/common/LocaleSelector.vue";

import { useUserState } from "@/store/user";

const { t } = useI18n();
const route = useRoute();
const { user } = useUserState();

const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
  return [
    {
      label: () =>
        h(RouterLink, { to: "/" }, () => t("message.routes.dashboard")),
      key: "/",
      icon: () => h(Icon, null, { default: () => h(Dashboard) }),
    },
    {
      label: () =>
        h(RouterLink, { to: "/devices" }, () => t("message.routes.devices")),
      key: "/devices",
      icon: () => h(Icon, null, { default: () => h(Devices) }),
    },
    {
      label: () =>
        h(RouterLink, { to: "/settings" }, () => t("message.routes.settings")),
      key: "/settings",
      icon: () => h(Icon, null, { default: () => h(Settings) }),
    },
    {
      label: () =>
        h(RouterLink, { to: "/admin" }, () => t("message.routes.admin")),
      key: "/admin",
      icon: () => h(Icon, null, { default: () => h(HeartRateMonitor) }),
      show: !!user.value?.isAdmin,
    },
  ];
});

const userActionOptions: DropdownOption[] = [
  {
    label: () => h(NText, null, () => t("message.user.logout")),
    key: "logout",
    icon: () => h(Icon, null, { default: () => h(Logout) }),
  },
];
</script>

<template>
  <div class="px-1 py-4 flex flex-col justify-between h-full">
    <NSpace vertical>
      <div class="text-center">
        <NH3 class="m-0">
          <NText>Supernode Server</NText>
        </NH3>
      </div>
      <NMenu :options="menuOptions" :value="route.path" />
    </NSpace>
    <div class="flex flex-col items-center">
      <!-- <NSpace class="self-center" align="center">
        <ColorSchemaSwitch />
        <LocaleSelector />
      </NSpace> -->
      <NDropdown :options="userActionOptions" placement="right">
        <div class="px-4 flex justify-between items-center w-full">
          <NAvatar round size="large">
            <!-- TODO: avatar image -->
            {{ user?.name }}
          </NAvatar>
          <NText strong>{{ user?.name }}</NText>
        </div>
      </NDropdown>
    </div>
  </div>
</template>

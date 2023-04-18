<script lang="ts" setup>
import { NLayout, NLayoutSider, NLayoutContent, useMessage } from "naive-ui";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import Sider from "@/components/home/Sider/Index.vue";

import { useAuthState } from "@/store/auth";
import { useUserState } from "@/store/user";


const router = useRouter();
const message = useMessage();
const { t } = useI18n();

const { isExpired } = useAuthState();
const { getMe } = useUserState();

onMounted(() => {
  if (isExpired.value /* 登录信息未过期 */) {
    getMe()
      .then(() => {})
      .catch(() => {
        message.error(t("message.user.expired"));
        router.push({
          path: "/login",
          params: {
            redirect: router.currentRoute.value.fullPath,
          },
        });
      });
  }
});
</script>

<template>
  <NLayout class="page" has-sider>
    <NLayoutSider class="sider" bordered>
      <Sider />
    </NLayoutSider>
    <NLayoutContent class="content">
      <router-view />
    </NLayoutContent>
  </NLayout>
</template>

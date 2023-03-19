<script lang="ts" setup>
import { NH1, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, useMessage } from "naive-ui";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAuthState } from "@/store/auth";
import { useUserState } from "@/store/user";

const router = useRouter();
const message = useMessage();
const { t } = useI18n();

const { isExpired } = useAuthState();
const { getMe } = useUserState();

onMounted(() => {
  if (isExpired.value /* 登录信息未过期 */) {
    getMe().then(() => {

    }).catch(() => {
      message.error(t("message.user.expired"));
      router.push("/login");
    });
  }
});

</script>

<template>
  <NLayout class="page">
    <NLayoutHeader>
      <NH1>Header</NH1>
    </NLayoutHeader>
    <NLayout has-sider>
      <NLayoutSider>
        <NH1>Sider</NH1>
      </NLayoutSider>
      <NLayoutContent>
        <NH1>Content</NH1>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<style lang="less" scoped>
.n-h {
  margin: 0;
}
</style>
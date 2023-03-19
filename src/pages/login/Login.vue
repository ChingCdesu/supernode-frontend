<script lang="ts" setup>
import { NSpace, useThemeVars, useDialog } from "naive-ui";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import ColorSchemaSwitch from "@/components/common/ColorSchemaSwitch.vue";
import LocaleSelector from "@/components/common/LocaleSelector.vue";
import LoginCard from "@/components/login/LoginCard.vue";
import { useCancellablePromise } from "@/utils/cancellablePromise";
import { useUserState } from "@/store/user";
import { useAuthState } from "@/store/auth";

const { t } = useI18n();
const themeVars = useThemeVars();
const router = useRouter();
const dialog = useDialog();

const { getMe } = useUserState();
const { isExpired } = useAuthState();

onMounted(() => {
  if (isExpired.value /* 登录信息未过期 */) {
    const { cancel, promise } = useCancellablePromise(getMe);
    const dialogInstance = dialog.info({
      title: t("message.common.redirecting"),
      content: t("message.user.infoFetching"),
      negativeText: t("message.common.cancel"),
      maskClosable: false,
      closeOnEsc: false,
      onNegativeClick() {
        // 用户手动登录
        cancel();
        dialogInstance.destroy();
      },
    });
    promise.value!.then(() => {
      router.push("/");
      dialogInstance.destroy();
    }).catch(() => {
      dialogInstance.destroy();
    });
  }

});
</script>

<template>
  <div class="page">
    <div class="background">
      <video muted autoplay loop>
        <source src="@/assets/videos/login-background.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="login-content">
      <div class="drawer" :style="{ backgroundColor: themeVars.bodyColor }">
        <LoginCard />
      </div>
      <div class="customize">
        <NSpace align="center">
          <ColorSchemaSwitch />
          <LocaleSelector />
        </NSpace>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -9999;
  transition: filter 1.5s cubic-bezier(0.075, 0.82, 0.165, 1);

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.dark .background {
  filter: grayscale(100%) brightness(90%) invert(75%) contrast(175%);
}

.login-content {
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  align-items: end;
}

.customize {
  padding: 1rem;
}

.drawer {
  width: 20rem;
  min-width: 300px;
  height: 100vh;
  border-radius: 1em 0 0 1em;
  opacity: 0.75;
}
</style>

<script lang="ts" setup>
import { NSpace, NCard, useMessage, NInput, NButton } from "naive-ui";
import { Icon } from "@vicons/utils";
import { UserCircle, Lock } from "@vicons/tabler";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref } from "vue";

import { useUserState } from "@/store/user";

const { t } = useI18n();
const message = useMessage();
const router = useRouter();
const { localLogin } = useUserState();

const inputUsername = ref("");
const inputPassword = ref("");
const loading = ref(false);

function login() {
  loading.value = true;
  localLogin(inputUsername.value, inputPassword.value)
    .then((user) => {
      router.push("/");
    })
    .catch((error) => {
      loading.value = false;
      console.log(error);
    });
}

function oidcLogin() {
  window.location.href = "/api/auth/oidc";
}
</script>

<template>
  <div class="container">
    <NCard class="login-card" :bordered="false" :title="$t('message.common.welcomeback')">
      <NSpace vertical>
        <div class="input-row">
          <Icon size="24">
            <UserCircle />
          </Icon>
          <NInput :placeholder="$t('message.common.username')" v-model:value="inputUsername" />
        </div>
        <div class="input-row">
          <Icon size="24">
            <Lock />
          </Icon>
          <NInput type="password" show-password-on="click"
            :placeholder="$t('message.common.passcode')" v-model:value="inputPassword" />
        </div>
      </NSpace>

      <template #action>
        <div class="login-actions">
          <NButton @click="login" :loading="loading" :disabled="loading">
            {{ $t("message.common.login") }}
          </NButton>
          <NButton class="oidc-login" text @click="oidcLogin">
            Login with OIDC
          </NButton>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.login-card {
  text-align: center;
  background-color: transparent;

  & :deep(.n-card__action) {
    background-color: transparent;
  }

  & :deep(.n-card__content) {
    padding-bottom: 0;
  }
}

.input-row {
  display: flex;
  align-items: center;
  text-align: start;

  &> :deep(.xicon) {
    margin-right: 4px;
  }
}

.login-actions {
  display: flex;
  flex-direction: column;

  &>* {
    margin-bottom: 1em;
  }
}

.oidc-login {
  justify-self: center;
}
</style>
